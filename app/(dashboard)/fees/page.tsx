import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FeeTableClient } from "./FeeTableClient";
import { FeeWithStudent } from "@/types";

export default async function FeesPage() {
  const fees = await prisma.fee.findMany({
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rollNo: true,
          admissionNo: true,
          class: true,
          section: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const unpaid = fees.filter((f) => f.status === "UNPAID").length;
  const partial = fees.filter((f) => f.status === "PARTIAL").length;

  return (
    <div>
      <PageHeader
        title="Fees"
        description={`${fees.length} records — ${unpaid} unpaid, ${partial} partial`}
      >
        <Button asChild>
          <Link href="/fees/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Fee
          </Link>
        </Button>
      </PageHeader>
      <FeeTableClient fees={fees as unknown as FeeWithStudent[]} />
    </div>
  );
}