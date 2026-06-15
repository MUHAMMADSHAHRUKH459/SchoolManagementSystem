import { PageHeader } from "@/components/shared/PageHeader";
import { SalaryForm } from "@/components/salary/SalaryForm";

export default function NewSalaryPage() {
  return (
    <div>
      <PageHeader
        title="Add Salary"
        description="Create a new salary record"
      />
      <SalaryForm />
    </div>
  );
}