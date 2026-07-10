import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const directoryTypes = ["bank", "central_bank", "treasury"] as const;

const bankSelect = {
  id: true,
  bankCode: true,
  name: true,
  swiftCode: true,
  directoryType: true,
  parentBankCode: true,
  isHeadOffice: true,
  isBranch: true,
  isActive: true,
} satisfies Prisma.ArmenianBankSelect;

type ArmenianBankApiRow = Prisma.ArmenianBankGetPayload<{
  select: typeof bankSelect;
}>;

function readLimit(request: NextRequest) {
  const rawLimit = request.nextUrl.searchParams.get("limit");
  const parsedLimit = rawLimit ? Number.parseInt(rawLimit, 10) : 100;

  if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
    return 100;
  }

  return Math.min(parsedLimit, 1000);
}

function readBooleanFlag(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no"].includes(normalized)) {
    return false;
  }

  return null;
}

function readDirectoryType(value: string | null) {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  return directoryTypes.includes(normalized as (typeof directoryTypes)[number])
    ? normalized
    : null;
}

function toApiBank(bank: ArmenianBankApiRow) {
  return {
    id: bank.id,
    bankCode: bank.bankCode,
    name: bank.name,
    swiftCode: bank.swiftCode,
    directoryType: bank.directoryType,
    parentBankCode: bank.parentBankCode,
    isHeadOffice: bank.isHeadOffice,
    isBranch: bank.isBranch,
    isActive: bank.isActive,
  };
}

export async function GET(request: NextRequest) {
  try {
    const limit = readLimit(request);
    const query = request.nextUrl.searchParams.get("q")?.trim() || "";
    const directoryType = readDirectoryType(request.nextUrl.searchParams.get("directoryType"));
    const parentBankCode = request.nextUrl.searchParams.get("parentBankCode")?.trim() || "";
    const swiftCode = request.nextUrl.searchParams.get("swiftCode")?.trim().toUpperCase() || "";
    const isHeadOffice = readBooleanFlag(request.nextUrl.searchParams.get("isHeadOffice"));
    const isBranch = readBooleanFlag(request.nextUrl.searchParams.get("isBranch"));
    const includeInactive = readBooleanFlag(request.nextUrl.searchParams.get("includeInactive")) === true;

    const where: Prisma.ArmenianBankWhereInput = {
      ...(includeInactive ? {} : { isActive: true }),
      ...(directoryType ? { directoryType } : {}),
      ...(parentBankCode ? { parentBankCode } : {}),
      ...(swiftCode ? { swiftCode: { contains: swiftCode } } : {}),
      ...(isHeadOffice !== null ? { isHeadOffice } : {}),
      ...(isBranch !== null ? { isBranch } : {}),
      ...(query
        ? {
            OR: [
              { bankCode: { contains: query } },
              { name: { contains: query } },
              { swiftCode: { contains: query.toUpperCase() } },
            ],
          }
        : {}),
    };

    const [banks, total] = await prisma.$transaction([
      prisma.armenianBank.findMany({
        where,
        orderBy: [{ bankCode: "asc" }],
        take: limit,
        select: bankSelect,
      }),
      prisma.armenianBank.count({ where }),
    ]);

    return NextResponse.json({
      banks: banks.map((bank: (typeof banks)[number]) => toApiBank(bank)),
      meta: {
        total,
        limit,
        returned: banks.length,
        filters: {
          q: query || null,
          directoryType,
          parentBankCode: parentBankCode || null,
          swiftCode: swiftCode || null,
          isHeadOffice,
          isBranch,
          includeInactive,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "\u0532\u0561\u0576\u056f\u0565\u0580\u056b \u057f\u0565\u0572\u0565\u056f\u0561\u057f\u0578\u0582\u0576 \u0579\u0562\u0565\u057c\u0576\u057e\u0565\u0581 DEV Master DB-\u056b\u0581\u0589",
        detail: message,
      },
      { status: 500 },
    );
  }
}
