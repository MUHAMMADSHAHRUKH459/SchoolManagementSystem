import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { TeacherForm } from "@/components/teachers/TeacherForm";

export default async function EditTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: { subjects: { include: { subject: true } } },
  });

  if (!teacher) notFound();

  return (
    <div>
      <PageHeader
        title="Edit Teacher"
        description={`${teacher.firstName} ${teacher.lastName}`}
      />
      <TeacherForm mode="edit" teacher={teacher as any} />
    </div>
  );
}