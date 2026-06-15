import { PageHeader } from "@/components/shared/PageHeader";
import { StaffForm } from "@/components/staff/StaffForm";

export default function NewStaffPage() {
  return (
    <div>
      <PageHeader title="Add Staff" description="Register a new staff member" />
      <StaffForm mode="create" />
    </div>
  );
}