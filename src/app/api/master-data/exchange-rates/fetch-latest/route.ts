import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const endpoint = "https://api.cba.am/exchangerates.asmx";
const isoCodes = ["USD", "EUR", "RUB"];

function getTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));

  return match ? match[1].trim() : null;
}

function sha256(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function makeEnvelope(iso: string) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ExchangeRatesLatestByISO xmlns="http://www.cba.am/">
      <ISO>${iso}</ISO>
    </ExchangeRatesLatestByISO>
  </soap:Body>
</soap:Envelope>`;
}

function toRateDate(currentDate: string) {
  return currentDate.slice(0, 10);
}

async function fetchCbaRate(iso: string) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: "\"http://www.cba.am/ExchangeRatesLatestByISO\"",
    },
    body: makeEnvelope(iso),
  });

  const xml = await response.text();

  if (!response.ok) {
    throw new Error(`${iso}: CBA HTTP ${response.status}`);
  }

  const currentDate = getTag(xml, "CurrentDate");
  const amount = getTag(xml, "Amount");
  const rate = getTag(xml, "Rate");
  const difference = getTag(xml, "Difference");

  if (!currentDate || !amount || !rate) {
    throw new Error(`${iso}: missing required CBA fields`);
  }

  return {
    iso,
    currentDate,
    rateDate: toRateDate(currentDate),
    amount,
    rate,
    difference,
    rawPayload: xml,
    rawPayloadHash: sha256(xml),
  };
}

export async function POST() {
  const startedAt = new Date();
  const fetchedRows: Awaited<ReturnType<typeof fetchCbaRate>>[] = [];

  try {
    for (const iso of isoCodes) {
      fetchedRows.push(await fetchCbaRate(iso));
    }

    for (const row of fetchedRows) {
      const currency = await prisma.currency.findUnique({
        where: { isoCode: row.iso },
      });

      if (!currency) {
        throw new Error(`Currency not found in Master DB: ${row.iso}`);
      }

      await prisma.exchangeRate.upsert({
        where: {
          currencyId_rateDate_source: {
            currencyId: currency.id,
            rateDate: row.rateDate,
            source: "CBA",
          },
        },
        update: {
          rate: row.rate,
          change: row.difference,
          sourcePublishedAt: row.currentDate,
          sourceFetchedAt: startedAt,
          rawPayloadHash: row.rawPayloadHash,
          rawPayload: row.rawPayload,
        },
        create: {
          currencyId: currency.id,
          rateDate: row.rateDate,
          rate: row.rate,
          change: row.difference,
          source: "CBA",
          sourcePublishedAt: row.currentDate,
          sourceFetchedAt: startedAt,
          rawPayloadHash: row.rawPayloadHash,
          rawPayload: row.rawPayload,
        },
      });
    }

    const combinedHash = sha256(fetchedRows.map((row) => row.rawPayloadHash).join("|"));

    await prisma.exchangeRateFetchLog.create({
      data: {
        source: "CBA",
        fetchType: "manual_latest",
        requestedDate: fetchedRows[0]?.rateDate ?? null,
        status: "success",
        ratesCount: fetchedRows.length,
        rawPayloadHash: combinedHash,
        fetchedAt: startedAt,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      source: "CBA",
      ratesCount: fetchedRows.length,
      rateDate: fetchedRows[0]?.rateDate ?? null,
      rates: fetchedRows.map((row) => ({
        isoCode: row.iso,
        rateDate: row.rateDate,
        rate: row.rate,
        change: row.difference,
        sourcePublishedAt: row.currentDate,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    await prisma.exchangeRateFetchLog.create({
      data: {
        source: "CBA",
        fetchType: "manual_latest",
        status: "failed",
        ratesCount: fetchedRows.length,
        errorMessage: message,
        fetchedAt: startedAt,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        ok: false,
        error: "\u053f\u0532-\u056b\u0581 \u0583\u0578\u056d\u0561\u0580\u056a\u0565\u0584\u0576\u0565\u0580\u0568 \u0579\u0569\u0561\u0580\u0574\u0561\u0581\u057e\u0565\u0581\u056b\u0576\u0589",
        detail: message,
      },
      { status: 500 },
    );
  }
}
