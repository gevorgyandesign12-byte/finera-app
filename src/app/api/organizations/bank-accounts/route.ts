import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const allowedStatuses = new Set(["active", "inactive", "closed"]);

const bankAccountInclude = {
  armenianBank: true,
  currency: true,
} satisfies Prisma.OrganizationBankAccountInclude;

type BankAccountWithRelations =
  Prisma.OrganizationBankAccountGetPayload<{
    include: typeof bankAccountInclude;
  }>;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(value: unknown) {
  return value === true || value === "true";
}

function hasOwn(body: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(body, key);
}

function normalizeAccountNumber(value: unknown) {
  return readString(value).replace(/\s+/g, "");
}

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

function toApiBankAccount(account: BankAccountWithRelations) {
  return {
    id: account.id,
    organizationId: account.organizationId,
    armenianBankId: account.armenianBankId,
    currencyId: account.currencyId,
    accountNumber: account.accountNumber,
    accountName: account.accountName,
    bankCodeSnapshot: account.bankCodeSnapshot,
    bankNameSnapshot: account.bankNameSnapshot,
    swiftCodeSnapshot: account.swiftCodeSnapshot,
    currencyCodeSnapshot: account.currencyCodeSnapshot,
    isPrimary: account.isPrimary,
    status: account.status,
    openedAt: account.openedAt,
    closedAt: account.closedAt,
    notes: account.notes,
    bank: {
      id: account.armenianBank.id,
      bankCode: account.armenianBank.bankCode,
      name: account.armenianBank.name,
      swiftCode: account.armenianBank.swiftCode,
      isHeadOffice: account.armenianBank.isHeadOffice,
      isBranch: account.armenianBank.isBranch,
      isActive: account.armenianBank.isActive,
    },
    currency: {
      id: account.currency.id,
      isoCode: account.currency.isoCode,
      armenianName: account.currency.armenianName,
      englishName: account.currency.englishName,
      isBase: account.currency.isBase,
      isActive: account.currency.isActive,
    },
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  };
}

async function ensurePrimaryAccount(
  transaction: Prisma.TransactionClient,
  organizationId: string,
  currencyId: string
) {
  const existingPrimary =
    await transaction.organizationBankAccount.findFirst({
      where: {
        organizationId,
        currencyId,
        status: "active",
        isPrimary: true,
      },
      select: {
        id: true,
      },
    });

  if (existingPrimary) {
    return;
  }

  const replacement =
    await transaction.organizationBankAccount.findFirst({
      where: {
        organizationId,
        currencyId,
        status: "active",
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
      },
    });

  if (replacement) {
    await transaction.organizationBankAccount.update({
      where: {
        id: replacement.id,
      },
      data: {
        isPrimary: true,
      },
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const organizationId =
      request.nextUrl.searchParams.get("organizationId") ?? "";

    const includeClosed =
      request.nextUrl.searchParams.get("includeClosed") !== "false";

    if (!organizationId) {
      return NextResponse.json(
        {
          error:
            "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0568\u0576\u057f\u0580\u057e\u0561\u056e \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    const bankAccounts =
      await prisma.organizationBankAccount.findMany({
        where: {
          organizationId,
          ...(includeClosed
            ? {}
            : {
                status: "active",
              }),
        },
        include: bankAccountInclude,
        orderBy: [
          {
            status: "asc",
          },
          {
            isPrimary: "desc",
          },
          {
            createdAt: "asc",
          },
        ],
      });

    return NextResponse.json({
      bankAccounts: bankAccounts.map(toApiBankAccount),
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "\u0549\u0570\u0561\u057b\u0578\u0572\u057e\u0565\u0581 \u0562\u0565\u057c\u0576\u0565\u056c \u0562\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0570\u0561\u0577\u056b\u057e\u0576\u0565\u0580\u0568 DEV DB-\u056b\u0581\u0589",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as Record<string, unknown>;

    const organizationId = readString(body.organizationId);
    const armenianBankId = readString(body.armenianBankId);
    const currencyCode = readString(body.currencyCode).toUpperCase();
    const accountNumber = normalizeAccountNumber(body.accountNumber);
    const accountName = readString(body.accountName);
    const requestedPrimary = readBoolean(body.isPrimary);
    const status = readString(body.status) || "active";
    const openedAt = readString(body.openedAt);
    const closedAt = readString(body.closedAt);
    const notes = readString(body.notes);

    if (!organizationId) {
      return NextResponse.json(
        {
          error:
            "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0568\u0576\u057f\u0580\u057e\u0561\u056e \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    if (!armenianBankId) {
      return NextResponse.json(
        {
          error:
            "\u0532\u0561\u0576\u056f\u0568 \u0568\u0576\u057f\u0580\u057e\u0561\u056e \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    if (!accountNumber) {
      return NextResponse.json(
        {
          error:
            "\u0532\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0570\u0561\u0577\u057e\u0565\u0570\u0561\u0574\u0561\u0580\u0568 \u057a\u0561\u0580\u057f\u0561\u0564\u056b\u0580 \u0567\u0589",
        },
        { status: 400 }
      );
    }

    if (!currencyCode) {
      return NextResponse.json(
        {
          error:
            "\u0531\u0580\u056a\u0578\u0582\u0575\u0569\u0568 \u0568\u0576\u057f\u0580\u057e\u0561\u056e \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        {
          error:
            "\u053f\u0561\u0580\u0563\u0561\u057e\u056b\u0573\u0561\u056f\u0568 \u0569\u0578\u0582\u0575\u056c\u0561\u057f\u0580\u0565\u056c\u056b \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    const [organization, bank, currency] = await Promise.all([
      prisma.organization.findUnique({
        where: {
          id: organizationId,
        },
        select: {
          id: true,
        },
      }),

      prisma.armenianBank.findUnique({
        where: {
          id: armenianBankId,
        },
      }),

      prisma.currency.findUnique({
        where: {
          isoCode: currencyCode,
        },
      }),
    ]);

    if (!organization) {
      return NextResponse.json(
        {
          error:
            "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581\u0589",
        },
        { status: 404 }
      );
    }

    if (
      !bank ||
      !bank.isActive ||
      bank.directoryType !== "bank"
    ) {
      return NextResponse.json(
        {
          error:
            "\u0538\u0576\u057f\u0580\u057e\u0561\u056e \u0562\u0561\u0576\u056f\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581 \u056f\u0561\u0574 \u0561\u056f\u057f\u056b\u057e \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    if (!currency || !currency.isActive) {
      return NextResponse.json(
        {
          error:
            "\u0538\u0576\u057f\u0580\u057e\u0561\u056e \u0561\u0580\u056a\u0578\u0582\u0575\u0569\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581 \u056f\u0561\u0574 \u0561\u056f\u057f\u056b\u057e \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    const activeCurrencyAccountCount =
      await prisma.organizationBankAccount.count({
        where: {
          organizationId,
          currencyId: currency.id,
          status: "active",
        },
      });

    const shouldBePrimary =
      status === "active" &&
      (requestedPrimary || activeCurrencyAccountCount === 0);

    const bankAccount = await prisma.$transaction(
      async (transaction) => {
        if (shouldBePrimary) {
          await transaction.organizationBankAccount.updateMany({
            where: {
              organizationId,
              currencyId: currency.id,
            },
            data: {
              isPrimary: false,
            },
          });
        }

        return transaction.organizationBankAccount.create({
          data: {
            organizationId,
            armenianBankId: bank.id,
            currencyId: currency.id,
            accountNumber,
            accountName: accountName || null,
            bankCodeSnapshot: bank.bankCode,
            bankNameSnapshot: bank.name,
            swiftCodeSnapshot: bank.swiftCode,
            currencyCodeSnapshot: currency.isoCode,
            isPrimary: shouldBePrimary,
            status,
            openedAt: openedAt || null,
            closedAt:
              status === "closed"
                ? closedAt || todayInputDate()
                : null,
            notes: notes || null,
          },
          include: bankAccountInclude,
        });
      }
    );

    return NextResponse.json(
      {
        bankAccount: toApiBankAccount(bankAccount),
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "\u0531\u0575\u057d \u0570\u0561\u0577\u057e\u0565\u0570\u0561\u0574\u0561\u0580\u0576 \u0561\u0580\u0564\u0565\u0576 \u0563\u0580\u0561\u0576\u0581\u057e\u0561\u056e \u0567 \u057f\u057e\u0575\u0561\u056c \u056f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0561\u0576 \u0570\u0561\u0574\u0561\u0580\u0589",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "\u0549\u0570\u0561\u057b\u0578\u0572\u057e\u0565\u0581 \u057a\u0561\u0570\u057a\u0561\u0576\u0565\u056c \u0562\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0570\u0561\u0577\u056b\u057e\u0568 DEV DB-\u0578\u0582\u0574\u0589",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body =
      (await request.json()) as Record<string, unknown>;

    const accountId = readString(body.accountId);

    if (!accountId) {
      return NextResponse.json(
        {
          error:
            "\u0532\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0570\u0561\u0577\u056b\u057e\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581\u0589",
        },
        { status: 400 }
      );
    }

    const existing =
      await prisma.organizationBankAccount.findUnique({
        where: {
          id: accountId,
        },
        include: bankAccountInclude,
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "\u0532\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0570\u0561\u0577\u056b\u057e\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581\u0589",
        },
        { status: 404 }
      );
    }

    const armenianBankId = hasOwn(body, "armenianBankId")
      ? readString(body.armenianBankId)
      : existing.armenianBankId;

    const currencyCode = hasOwn(body, "currencyCode")
      ? readString(body.currencyCode).toUpperCase()
      : existing.currency.isoCode;

    const accountNumber = hasOwn(body, "accountNumber")
      ? normalizeAccountNumber(body.accountNumber)
      : existing.accountNumber;

    const status = hasOwn(body, "status")
      ? readString(body.status)
      : existing.status;

    if (!armenianBankId) {
      return NextResponse.json(
        {
          error:
            "\u0532\u0561\u0576\u056f\u0568 \u0568\u0576\u057f\u0580\u057e\u0561\u056e \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    if (!accountNumber) {
      return NextResponse.json(
        {
          error:
            "\u0532\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0570\u0561\u0577\u057e\u0565\u0570\u0561\u0574\u0561\u0580\u0568 \u057a\u0561\u0580\u057f\u0561\u0564\u056b\u0580 \u0567\u0589",
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        {
          error:
            "\u053f\u0561\u0580\u0563\u0561\u057e\u056b\u0573\u0561\u056f\u0568 \u0569\u0578\u0582\u0575\u056c\u0561\u057f\u0580\u0565\u056c\u056b \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    const [bank, currency] = await Promise.all([
      prisma.armenianBank.findUnique({
        where: {
          id: armenianBankId,
        },
      }),

      prisma.currency.findUnique({
        where: {
          isoCode: currencyCode,
        },
      }),
    ]);

    if (
      !bank ||
      !bank.isActive ||
      bank.directoryType !== "bank"
    ) {
      return NextResponse.json(
        {
          error:
            "\u0538\u0576\u057f\u0580\u057e\u0561\u056e \u0562\u0561\u0576\u056f\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581 \u056f\u0561\u0574 \u0561\u056f\u057f\u056b\u057e \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    if (!currency || !currency.isActive) {
      return NextResponse.json(
        {
          error:
            "\u0538\u0576\u057f\u0580\u057e\u0561\u056e \u0561\u0580\u056a\u0578\u0582\u0575\u0569\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581 \u056f\u0561\u0574 \u0561\u056f\u057f\u056b\u057e \u0579\u0567\u0589",
        },
        { status: 400 }
      );
    }

    const requestedPrimary = hasOwn(body, "isPrimary")
      ? readBoolean(body.isPrimary)
      : existing.isPrimary;

    const otherActiveAccountCount =
      await prisma.organizationBankAccount.count({
        where: {
          organizationId: existing.organizationId,
          currencyId: currency.id,
          status: "active",
          id: {
            not: accountId,
          },
        },
      });

    const shouldBePrimary =
      status === "active" &&
      (requestedPrimary || otherActiveAccountCount === 0);

    const accountName = hasOwn(body, "accountName")
      ? readString(body.accountName) || null
      : existing.accountName;

    const openedAt = hasOwn(body, "openedAt")
      ? readString(body.openedAt) || null
      : existing.openedAt;

    const notes = hasOwn(body, "notes")
      ? readString(body.notes) || null
      : existing.notes;

    let closedAt = existing.closedAt;

    if (status === "closed") {
      closedAt = hasOwn(body, "closedAt")
        ? readString(body.closedAt) || todayInputDate()
        : existing.closedAt || todayInputDate();
    } else if (status === "active") {
      closedAt = null;
    } else if (hasOwn(body, "closedAt")) {
      closedAt = readString(body.closedAt) || null;
    }

    const bankAccount = await prisma.$transaction(
      async (transaction) => {
        if (shouldBePrimary) {
          await transaction.organizationBankAccount.updateMany({
            where: {
              organizationId: existing.organizationId,
              currencyId: currency.id,
              id: {
                not: accountId,
              },
            },
            data: {
              isPrimary: false,
            },
          });
        }

        await transaction.organizationBankAccount.update({
          where: {
            id: accountId,
          },
          data: {
            armenianBankId: bank.id,
            currencyId: currency.id,
            accountNumber,
            accountName,
            bankCodeSnapshot: bank.bankCode,
            bankNameSnapshot: bank.name,
            swiftCodeSnapshot: bank.swiftCode,
            currencyCodeSnapshot: currency.isoCode,
            isPrimary: shouldBePrimary,
            status,
            openedAt,
            closedAt,
            notes,
          },
        });

        if (
          existing.currencyId !== currency.id ||
          status !== "active" ||
          !shouldBePrimary
        ) {
          await ensurePrimaryAccount(
            transaction,
            existing.organizationId,
            existing.currencyId
          );
        }

        if (status === "active") {
          await ensurePrimaryAccount(
            transaction,
            existing.organizationId,
            currency.id
          );
        }

        return transaction.organizationBankAccount.findUniqueOrThrow({
          where: {
            id: accountId,
          },
          include: bankAccountInclude,
        });
      }
    );

    return NextResponse.json({
      bankAccount: toApiBankAccount(bankAccount),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "\u0531\u0575\u057d \u0570\u0561\u0577\u057e\u0565\u0570\u0561\u0574\u0561\u0580\u0576 \u0561\u0580\u0564\u0565\u0576 \u0563\u0580\u0561\u0576\u0581\u057e\u0561\u056e \u0567 \u057f\u057e\u0575\u0561\u056c \u056f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0561\u0576 \u0570\u0561\u0574\u0561\u0580\u0589",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "\u0549\u0570\u0561\u057b\u0578\u0572\u057e\u0565\u0581 \u056d\u0574\u0562\u0561\u0563\u0580\u0565\u056c \u0562\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0570\u0561\u0577\u056b\u057e\u0568 DEV DB-\u0578\u0582\u0574\u0589",
      },
      { status: 500 }
    );
  }
}

