import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { FeeForm } from "@/components/fees/FeeForm";
import { FeeWithStudent } from "@/types";

export default async function EditFeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fee = await prisma.fee.findUnique({
    where: { id },
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
  });

  if (!fee) notFound();

  return (
    <div>
      <PageHeader
        title="Edit Fee"
        description={`${fee.student.firstName} ${fee.student.lastName} — ${MONTHS[fee.month - 1]?.label} ${fee.year}`}
      />
      <FeeForm mode="edit" fee={fee as unknown as FeeWithStudent} />
    </div>
  );
}

const MONTHS = [
  { label: "January" }, { label: "February" }, { label: "March" },
  { label: "April" }, { label: "May" }, { label: "June" },
  { label: "July" }, { label: "August" }, { label: "September" },
  { label: "October" }, { label: "November" }, { label: "December" },
];