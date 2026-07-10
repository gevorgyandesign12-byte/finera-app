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

function readRequiredText(value: unknown, fieldName: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(fieldName + " is required.");
  }

  return value.trim();
}

function readOptionalText(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Optional text field must be a string or null.");
  }

  return value.trim() || null;
}

function readRequiredBoolean(value: unknown, fieldName: string) {
  if (typeof value !== "boolean") {
    throw new Error(fieldName + " must be boolean.");
  }

  return value;
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

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const id = readRequiredText(body.id, "id");
    const bankCode = readRequiredText(body.bankCode, "bankCode");
    const name = readRequiredText(body.name, "name");
    const swiftCode = readOptionalText(body.swiftCode)?.toUpperCase() ?? null;
    const parentBankCode = readOptionalText(body.parentBankCode);
    const directoryType = readRequiredText(body.directoryType, "directoryType");
    const isHeadOffice = readRequiredBoolean(body.isHeadOffice, "isHeadOffice");
    const isBranch = readRequiredBoolean(body.isBranch, "isBranch");
    const isActive = readRequiredBoolean(body.isActive, "isActive");

    if (!directoryTypes.includes(directoryType as (typeof directoryTypes)[number])) {
      return NextResponse.json(
        { error: "\u0531\u0576\u0569\u0578\u0582\u0575\u056c\u0561\u057f\u0580\u0565\u056c\u056b \u0579\u0567 \u057f\u0565\u0572\u0565\u056f\u0561\u057f\u0578\u0582\u056b \u057f\u0565\u057d\u0561\u056f\u0568\u0589" },
        { status: 400 },
      );
    }

    if (isHeadOffice && isBranch) {
      return NextResponse.json(
        { error: "\u0533\u0580\u0561\u057c\u0578\u0582\u0574\u0568 \u0579\u056b \u056f\u0561\u0580\u0578\u0572 \u0574\u056b\u0561\u056a\u0561\u0574\u0561\u0576\u0561\u056f \u056c\u056b\u0576\u0565\u056c \u0563\u056c\u056d\u0561\u0574\u0561\u057d \u0587 \u0574\u0561\u057d\u0576\u0561\u0573\u0575\u0578\u0582\u0572\u0589" },
        { status: 400 },
      );
    }

    if (parentBankCode === bankCode) {
      return NextResponse.json(
        { error: "\u0533\u056c\u056d\u0561\u0574\u0561\u057d\u056b \u056f\u0578\u0564\u0568 \u0579\u056b \u056f\u0561\u0580\u0578\u0572 \u0570\u0561\u0574\u0568\u0576\u056f\u0576\u0565\u056c \u0576\u0578\u0582\u0575\u0576 \u0563\u0580\u0561\u057c\u0574\u0561\u0576 \u056f\u0578\u0564\u056b \u0570\u0565\u057f\u0589" },
        { status: 400 },
      );
    }

    const existing = await prisma.armenianBank.findUnique({
      where: { id },
      select: { id: true, bankCode: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "\u0532\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0563\u0580\u0561\u057c\u0578\u0582\u0574\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581\u0589" },
        { status: 404 },
      );
    }

    if (parentBankCode) {
      const parent = await prisma.armenianBank.findUnique({
        where: { bankCode: parentBankCode },
        select: { id: true },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "\u0546\u0577\u057e\u0561\u056e \u0563\u056c\u056d\u0561\u0574\u0561\u057d\u056b \u056f\u0578\u0564\u0578\u057e \u0562\u0561\u0576\u056f \u0579\u0563\u057f\u0576\u057e\u0565\u0581\u0589" },
          { status: 400 },
        );
      }
    }

    const bank = await prisma.$transaction(async (tx) => {
      const savedBank = await tx.armenianBank.update({
        where: { id },
        data: {
          bankCode,
          name,
          swiftCode,
          directoryType,
          parentBankCode,
          isHeadOffice,
          isBranch,
          isActive,
          status: isActive ? "active" : "inactive",
        },
        select: bankSelect,
      });

      if (existing.bankCode !== bankCode) {
        await tx.armenianBank.updateMany({
          where: { parentBankCode: existing.bankCode },
          data: { parentBankCode: bankCode },
        });
      }

      return savedBank;
    });

    return NextResponse.json({ bank: toApiBank(bank) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "\u0531\u0575\u057d \u0562\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u056f\u0578\u0564\u0576 \u0561\u0580\u0564\u0565\u0576 \u0563\u0578\u0575\u0578\u0582\u0569\u0575\u0578\u0582\u0576 \u0578\u0582\u0576\u056b\u0589" },
          { status: 409 },
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "\u0532\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0563\u0580\u0561\u057c\u0578\u0582\u0574\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581\u0589" },
          { status: 404 },
        );
      }
    }

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "\u0532\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0563\u0580\u0561\u057c\u0578\u0582\u0574\u0568 \u0579\u0570\u0561\u057b\u0578\u0572\u057e\u0565\u0581 \u057a\u0561\u0570\u057a\u0561\u0576\u0565\u056c\u0589",
        detail: message,
      },
      { status: 500 },
    );
  }
}
