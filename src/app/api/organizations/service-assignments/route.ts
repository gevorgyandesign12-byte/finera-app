import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const roleLabels: Record<string, string> = {
  manager: "Մենեջեր",
  chief_accountant: "Գլխավոր հաշվապահ",
  accountant: "Հաշվապահ",
  payroll_hr: "Աշխատավարձ և կադրեր",
  support: "Աջակցություն",
  tech: "Տեխնիկական սպասարկում",
};

const workScopeLabels: Record<string, string> = {
  service_management: "Սպասարկման կառավարում",
  accounting_supervision: "Հաշվապահական վերահսկում",
  cash_bank: "Դրամարկղ և բանկ",
  purchase_sales_documents: "Գնումներ, վաճառք, փաստաթղթեր",
  warehouse_inventory: "Պահեստ և գույքագրում",
  tax_reports: "Հարկային հաշվետվություններ",
  documents: "Փաստաթղթերի մշակում",
  payroll_and_hr: "Աշխատավարձ և կադրեր",
  customer_support: "Հաճախորդների աջակցություն",
  technical_support: "Տեխնիկական աջակցություն",
};

export async function GET(request: NextRequest) {
  const organizationId = request.nextUrl.searchParams.get("organizationId")?.trim();

  if (!organizationId) {
    return NextResponse.json(
      { error: "organizationId պարամետրը պարտադիր է։" },
      { status: 400 },
    );
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      name: true,
      taxId: true,
      serviceAssignments: {
        where: { status: "active" },
        orderBy: [
          { roleScope: "asc" },
          { workScope: "asc" },
        ],
        select: {
          id: true,
          roleScope: true,
          workScope: true,
          status: true,
          notes: true,
          assignedAt: true,
          fineraEmployee: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              roleGroup: true,
              positionTitle: true,
              departmentName: true,
            },
          },
        },
      },
    },
  });

  if (!organization) {
    return NextResponse.json(
      { error: "Կազմակերպությունը չի գտնվել։" },
      { status: 404 },
    );
  }

  const assignments = organization.serviceAssignments.map((assignment) => ({
    id: assignment.id,
    roleScope: assignment.roleScope,
    roleLabel: roleLabels[assignment.roleScope] ?? assignment.roleScope,
    workScope: assignment.workScope,
    workScopeLabel: workScopeLabels[assignment.workScope] ?? assignment.workScope,
    status: assignment.status,
    notes: assignment.notes,
    assignedAt: assignment.assignedAt.toISOString(),
    employee: assignment.fineraEmployee,
  }));

  return NextResponse.json({
    organization: {
      id: organization.id,
      name: organization.name,
      taxId: organization.taxId,
    },
    assignments,
  });
}
