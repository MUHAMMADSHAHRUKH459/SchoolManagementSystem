import { PageHeader } from "@/components/shared/PageHeader";
import { StudentForm } from "@/components/students/StudentForm";

export default function NewStudentPage() {
  return (
    <div>
      <PageHeader
        title="Add Student"
        description="Register a new student"
      />
      <StudentForm mode="create" />
    </div>
  );
}