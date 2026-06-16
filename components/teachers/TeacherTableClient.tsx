"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { teacherColumns } from "@/components/teachers/TeacherColumns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TeacherMember } from "@/types";

export function TeacherTableClient({ teachers }: { teachers: TeacherMember[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return teachers.filter(
      (t) =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.employeeId.toLowerCase().includes(q)
    );
  }, [teachers, search]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teachers..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <DataTable columns={teacherColumns} data={filtered} />
    </div>
  );
}