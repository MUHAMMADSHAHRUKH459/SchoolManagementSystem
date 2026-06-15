import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SalaryTableClient } from "./SalaryTableClient";
import { SalaryWithPerson } from "@/types";

export default async function SalaryPage() {
  const salaries = await prisma.salary.findMany({
    include: {
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          salary: true,
        },
      },
      staff: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          salary: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const unpaid = salaries.filter((s) => s.status === "UNPAID").length;

  return (
    <div>
      <PageHeader
        title="Salary"
        description={`${salaries.length} records — ${unpaid} unpaid`}
      >
        <Button asChild>
          <Link href="/salary/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Salary
          </Link>
        </Button>
      </PageHeader>
      <SalaryTableClient salaries={salaries as unknown as SalaryWithPerson[]} />
    </div>
  );
}