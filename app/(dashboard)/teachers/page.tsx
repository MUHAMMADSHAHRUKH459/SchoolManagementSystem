import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TeacherTableClient } from "./TeacherTableClient";
import type { Teacher } from "@/components/teachers/TeacherColumns";

export default async function TeachersPage() {
  const teachers = await prisma.teacher.findMany({
    include: { subjects: { include: { subject: true } } },
    orderBy: { createdAt: "desc" },
  });

  const normalizedTeachers: Teacher[] = teachers.map((teacher) => ({
    ...teacher,
    salary: teacher.salary.toString(),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <PageHeader
          title="Teachers"
          description={`${teachers.length} total teachers`}
        />
        <Link
          href="/teachers/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Teacher
        </Link>
      </div>
      <TeacherTableClient teachers={normalizedTeachers} />
    </div>
  );
}