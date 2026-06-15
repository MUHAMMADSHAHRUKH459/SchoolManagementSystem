import { PageHeader } from "@/components/shared/PageHeader";
import { FeeForm } from "@/components/fees/FeeForm";

export default function NewFeePage() {
  return (
    <div>
      <PageHeader title="Add Fee" description="Create a new fee record" />
      <FeeForm mode="create" />
    </div>
  );
}