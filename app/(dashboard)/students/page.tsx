import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StudentTableClient } from "./StudentTableClient";
import { StudentType } from "@/types";

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
  });

  const studentList = students.map((student) => ({
    ...student,
    dateOfBirth: student.dateOfBirth.toISOString(),
    admissionDate: student.admissionDate.toISOString(),
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <PageHeader
            title="Students"
            description={`${students.length} total students`}
          />
        </div>
        <Link
          href="/students/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </Link>
      </div>
      <StudentTableClient students={studentList as StudentType[]} />
    </div>
  );
}
