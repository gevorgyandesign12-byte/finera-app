import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown) {
  const text = readString(value);
  const number = Number(text);

  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function readBoolean(value: unknown) {
  return value === true || value === "true";
}

function calculateSuggestedFee(input: {
  employeeCount: number;
  monthlyDocumentCount: number;
  taxRegime: string;
  bankAccountCount: number;
  hasVat: boolean;
  hasWarehouse: boolean;
  hasProduction: boolean;
  hasImportExport: boolean;
}) {
  let fee = 50_000;

  if (input.employeeCount > 50) {
    fee += 120_000;
  } else if (input.employeeCount > 20) {
    fee += 70_000;
  } else if (input.employeeCount > 5) {
    fee += 30_000;
  }

  if (input.monthlyDocumentCount > 300) {
    fee += 100_000;
  } else if (input.monthlyDocumentCount > 100) {
    fee += 60_000;
  } else if (input.monthlyDocumentCount > 30) {
    fee += 25_000;
  }

  if (input.taxRegime === "vat") {
    fee += 30_000;
  }

  if (input.taxRegime === "profit_tax") {
    fee += 20_000;
  }

  if (input.taxRegime === "mixed") {
    fee += 50_000;
  }

  if (input.bankAccountCount > 1) {
    fee += (input.bankAccountCount - 1) * 10_000;
  }

  if (input.hasVat && input.taxRegime !== "vat") {
    fee += 30_000;
  }

  if (input.hasWarehouse) {
    fee += 25_000;
  }

  if (input.hasProduction) {
    fee += 40_000;
  }

  if (input.hasImportExport) {
    fee += 35_000;
  }

  return fee;
}

function toApiContract(contract: Awaited<ReturnType<typeof prisma.serviceContract.findFirst>>) {
  if (!contract) {
    return null;
  }

  return {
    id: contract.id,
    organizationId: contract.organizationId,
    contractNumber: contract.contractNumber,
    signedAt: contract.signedAt,
    startsAt: contract.startsAt,
    endsAt: contract.endsAt,

    employeeCount: contract.employeeCount,
    monthlyDocumentCount: contract.monthlyDocumentCount,
    taxRegime: contract.taxRegime,
    bankAccountCount: contract.bankAccountCount,
    hasVat: contract.hasVat,
    hasWarehouse: contract.hasWarehouse,
    hasProduction: contract.hasProduction,
    hasImportExport: contract.hasImportExport,
    suggestedFeeAmount: contract.suggestedFeeAmount,
    approvedFeeAmount: contract.approvedFeeAmount,

    feeAmount: contract.feeAmount,
    feeCurrency: contract.feeCurrency,
    status: contract.status,
    responsiblePerson: contract.responsiblePerson,
    notes: contract.notes,
    createdAt: contract.createdAt.toISOString(),
    updatedAt: contract.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const organizationId = request.nextUrl.searchParams.get("organizationId") ?? "";

  if (!organizationId) {
    return NextResponse.json({ error: "Կազմակերպությունը ընտրված չէ։" }, { status: 400 });
  }

  const contract = await prisma.serviceContract.findFirst({
    where: { organizationId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ contract: toApiContract(contract) });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const organizationId = readString(body.organizationId);
    const contractNumber = readString(body.contractNumber);
    const signedAt = readString(body.signedAt);
    const startsAt = readString(body.startsAt);
    const endsAt = readString(body.endsAt);

    const employeeCount = readNumber(body.employeeCount);
    const monthlyDocumentCount = readNumber(body.monthlyDocumentCount);
    const taxRegime = readString(body.taxRegime) || "turnover_tax";
    const bankAccountCount = readNumber(body.bankAccountCount);
    const hasVat = readBoolean(body.hasVat);
    const hasWarehouse = readBoolean(body.hasWarehouse);
    const hasProduction = readBoolean(body.hasProduction);
    const hasImportExport = readBoolean(body.hasImportExport);

    const suggestedFeeAmount = String(
      calculateSuggestedFee({
        employeeCount,
        monthlyDocumentCount,
        taxRegime,
        bankAccountCount,
        hasVat,
        hasWarehouse,
        hasProduction,
        hasImportExport,
      })
    );

    const approvedFeeAmount = readString(body.approvedFeeAmount) || suggestedFeeAmount;
    const feeCurrency = readString(body.feeCurrency) || "AMD";
    const status = readString(body.status) || "draft";
    const responsiblePerson = readString(body.responsiblePerson);
    const notes = readString(body.notes);

    if (!organizationId) {
      return NextResponse.json({ error: "Կազմակերպությունը ընտրված չէ։" }, { status: 400 });
    }

    if (!contractNumber) {
      return NextResponse.json({ error: "Պայմանագրի համարը պարտադիր է։" }, { status: 400 });
    }

    const existingContract = await prisma.serviceContract.findFirst({
      where: { organizationId },
      orderBy: { updatedAt: "desc" },
    });

    const contractData = {
      contractNumber,
      signedAt: signedAt || null,
      startsAt: startsAt || null,
      endsAt: endsAt || null,

      employeeCount,
      monthlyDocumentCount,
      taxRegime,
      bankAccountCount,
      hasVat,
      hasWarehouse,
      hasProduction,
      hasImportExport,
      suggestedFeeAmount,
      approvedFeeAmount,

      feeAmount: approvedFeeAmount,
      feeCurrency,
      status,
      responsiblePerson: responsiblePerson || null,
      notes: notes || null,
    };

    const contract = existingContract
      ? await prisma.serviceContract.update({
          where: { id: existingContract.id },
          data: contractData,
        })
      : await prisma.serviceContract.create({
          data: {
            organizationId,
            ...contractData,
          },
        });

    return NextResponse.json({ contract: toApiContract(contract) });
  } catch {
    return NextResponse.json(
      { error: "Չհաջողվեց պահպանել պայմանագիրը DEV DB-ում։" },
      { status: 500 }
    );
  }
}
