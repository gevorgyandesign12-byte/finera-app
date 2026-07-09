import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(value: unknown) {
  return value === true || value === "true";
}

function toApiBusinessAddress(
  businessAddress: Awaited<ReturnType<typeof prisma.organizationBusinessAddress.findFirst>>
) {
  if (!businessAddress) {
    return null;
  }

  return {
    id: businessAddress.id,
    organizationId: businessAddress.organizationId,
    code: businessAddress.code,
    address: businessAddress.address,
    isPrimary: businessAddress.isPrimary,
    status: businessAddress.status,
    notes: businessAddress.notes,
    createdAt: businessAddress.createdAt.toISOString(),
    updatedAt: businessAddress.updatedAt.toISOString(),
  };
}

function makeBusinessAddressCodeBase(serviceCode: string) {
  return serviceCode.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

async function makeNextBusinessAddressCode(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { serviceCode: true },
  });

  if (!organization) {
    throw new Error("ORGANIZATION_NOT_FOUND");
  }

  if (!organization.serviceCode) {
    throw new Error("SERVICE_CODE_MISSING");
  }

  const base = makeBusinessAddressCodeBase(organization.serviceCode);
  const addresses = await prisma.organizationBusinessAddress.findMany({
    where: { organizationId },
    select: { code: true },
  });

  const maxNumber = addresses.reduce((max, businessAddress) => {
    const prefix = base + "-";
    if (!businessAddress.code.startsWith(prefix)) {
      return max;
    }

    const value = Number.parseInt(businessAddress.code.slice(prefix.length), 10);

    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return base + "-" + String(maxNumber + 1);
}

export async function GET(request: NextRequest) {
  const organizationId = request.nextUrl.searchParams.get("organizationId") ?? "";

  if (!organizationId) {
    return NextResponse.json({ error: "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0568\u0576\u057f\u0580\u057e\u0561\u056e \u0579\u0567\u0589" }, { status: 400 });
  }

  const businessAddresses = await prisma.organizationBusinessAddress.findMany({
    where: { organizationId },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({
    businessAddresses: businessAddresses.map(toApiBusinessAddress),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const organizationId = readString(body.organizationId);
    const address = readString(body.address);
    const isPrimary = readBoolean(body.isPrimary);
    const status = readString(body.status) || "active";
    const notes = readString(body.notes);

    if (!organizationId) {
      return NextResponse.json({ error: "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0568\u0576\u057f\u0580\u057e\u0561\u056e \u0579\u0567\u0589" }, { status: 400 });
    }

    if (!address) {
      return NextResponse.json({ error: "\u0533\u0578\u0580\u056e\u0578\u0582\u0576\u0565\u0578\u0582\u0569\u0575\u0561\u0576 \u0570\u0561\u057d\u0581\u0565\u0576 \u057a\u0561\u0580\u057f\u0561\u0564\u056b\u0580 \u0567\u0589" }, { status: 400 });
    }

    const existingCount = await prisma.organizationBusinessAddress.count({
      where: { organizationId },
    });

    const shouldBePrimary = isPrimary || existingCount === 0;

    if (shouldBePrimary) {
      await prisma.organizationBusinessAddress.updateMany({
        where: { organizationId },
        data: { isPrimary: false },
      });
    }

    const code = await makeNextBusinessAddressCode(organizationId);

    const businessAddress = await prisma.organizationBusinessAddress.create({
      data: {
        organizationId,
        code,
        address,
        isPrimary: shouldBePrimary,
        status,
        notes: notes || null,
      },
    });

    return NextResponse.json({ businessAddress: toApiBusinessAddress(businessAddress) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "ORGANIZATION_NOT_FOUND") {
      return NextResponse.json({ error: "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581\u0589" }, { status: 404 });
    }

    if (message === "SERVICE_CODE_MISSING") {
      return NextResponse.json({ error: "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0561\u0576 Finera \u056f\u0578\u0564\u0568 \u0579\u056b \u056c\u0580\u0561\u0581\u057e\u0565\u056c\u0589" }, { status: 400 });
    }

    if (message.includes("Unique constraint")) {
      return NextResponse.json({ error: "\u0531\u0575\u057d \u056f\u0578\u0564\u0578\u057e \u0563\u0578\u0580\u056e\u0578\u0582\u0576\u0565\u0578\u0582\u0569\u0575\u0561\u0576 \u0570\u0561\u057d\u0581\u0565 \u0561\u0580\u0564\u0565\u0576 \u056f\u0561\u0589" }, { status: 409 });
    }

    return NextResponse.json(
      { error: "\u0533\u0578\u0580\u056e\u0578\u0582\u0576\u0565\u0578\u0582\u0569\u0575\u0561\u0576 \u0570\u0561\u057d\u0581\u0565\u0576 \u0579\u057a\u0561\u0570\u057a\u0561\u0576\u057e\u0565\u0581 DEV DB-\u0578\u0582\u0574\u0589" },
      { status: 500 }
    );
  }
}
