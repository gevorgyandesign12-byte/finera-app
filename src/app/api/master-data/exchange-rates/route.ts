import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readLimit(request: NextRequest) {
  const rawLimit = request.nextUrl.searchParams.get("limit");
  const parsedLimit = rawLimit ? Number.parseInt(rawLimit, 10) : 50;

  if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
    return 50;
  }

  return Math.min(parsedLimit, 200);
}

export async function GET(request: NextRequest) {
  try {
    const limit = readLimit(request);
    const isoCode = request.nextUrl.searchParams.get("isoCode")?.trim().toUpperCase() || null;

    const currencies = await prisma.currency.findMany({
      where: { isActive: true },
      orderBy: [
        { isBase: "desc" },
        { isoCode: "asc" },
      ],
      select: {
        id: true,
        isoCode: true,
        numericCode: true,
        name: true,
        armenianName: true,
        englishName: true,
        nominal: true,
        isBase: true,
        isActive: true,
        source: true,
      },
    });

    const exchangeRates = await prisma.exchangeRate.findMany({
      where: {
        ...(isoCode
          ? {
              currency: {
                isoCode,
              },
            }
          : {}),
      },
      orderBy: [
        { rateDate: "desc" },
        { currency: { isoCode: "asc" } },
      ],
      take: limit,
      select: {
        id: true,
        rateDate: true,
        rate: true,
        change: true,
        source: true,
        sourcePublishedAt: true,
        sourceFetchedAt: true,
        currency: {
          select: {
            isoCode: true,
            armenianName: true,
            englishName: true,
            nominal: true,
          },
        },
      },
    });

    const fetchLogs = await prisma.exchangeRateFetchLog.findMany({
      orderBy: { fetchedAt: "desc" },
      take: 10,
      select: {
        id: true,
        source: true,
        fetchType: true,
        requestedDate: true,
        status: true,
        ratesCount: true,
        errorMessage: true,
        fetchedAt: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      currencies,
      exchangeRates: exchangeRates.map((rate: (typeof exchangeRates)[number]) => ({
        id: rate.id,
        rateDate: rate.rateDate,
        isoCode: rate.currency.isoCode,
        armenianName: rate.currency.armenianName,
        englishName: rate.currency.englishName,
        nominal: rate.currency.nominal,
        rate: rate.rate,
        change: rate.change,
        source: rate.source,
        sourcePublishedAt: rate.sourcePublishedAt,
        sourceFetchedAt: rate.sourceFetchedAt,
      })),
      fetchLogs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "\u0553\u0578\u056d\u0561\u0580\u056a\u0565\u0584\u0576\u0565\u0580\u0568 \u0579\u0562\u0565\u057c\u0576\u057e\u0565\u0581\u056b\u0576 DEV Master DB-\u056b\u0581\u0589",
        detail: message,
      },
      { status: 500 },
    );
  }
}
