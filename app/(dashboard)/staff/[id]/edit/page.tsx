import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StaffForm } from "@/components/staff/StaffForm";

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const staff = await prisma.staff.findUnique({ where: { id } });
  if (!staff) notFound();

  return (
    <div>
      <PageHeader
        title="Edit Staff"
        description={`${staff.firstName} ${staff.lastName}`}
      />
      <StaffForm mode="edit" staff={staff} />
    </div>
  );
}