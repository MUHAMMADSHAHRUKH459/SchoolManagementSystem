import { PageHeader } from "@/components/shared/PageHeader";
import { TeacherForm } from "@/components/teachers/TeacherForm";

export default function NewTeacherPage() {
  return (
    <div>
      <PageHeader title="Add Teacher" description="Register a new teacher" />
      <TeacherForm mode="create" />
    </div>
  );
}