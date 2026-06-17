import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TeacherTableClient } from "./TeacherTableClient";
import { TeacherMember } from "@/types";

export default async function TeachersPage() {
  const teachers = await prisma.teacher.findMany({
    include: { subjects: { include: { subject: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Teachers"
        description={`${teachers.length} total teachers`}
      >
        <Button asChild>
          <Link href="/teachers/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Link>
        </Button>
      </PageHeader>
      <TeacherTableClient teachers={teachers as unknown as TeacherMember[]} />
    </div>
  );
}