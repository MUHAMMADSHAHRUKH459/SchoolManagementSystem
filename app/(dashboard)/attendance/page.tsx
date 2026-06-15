import { PageHeader } from "@/components/shared/PageHeader";
import { AttendanceClient } from "./AttendanceClient";

export default function AttendancePage() {
  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Mark daily attendance for students, teachers and staff"
      />
      <AttendanceClient />
    </div>
  );
}