import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StudentForm } from "@/components/students/StudentForm";
import { StudentType } from "@/types";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = (await prisma.student.findUnique({
    where: { id },
  })) as StudentType | null;

  if (!student) notFound();

  return (
    <div>
      <PageHeader
        title="Edit Student"
        description={`${student.firstName} ${student.lastName}`}
      />
      <StudentForm mode="edit" student={student} />
    </div>
  );
}