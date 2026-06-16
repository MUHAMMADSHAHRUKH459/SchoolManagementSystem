"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { studentColumns } from "@/components/students/StudentColumns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { StudentMember } from "@/types";

export function StudentTableClient({ students }: { students: StudentMember[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q)
    );
  }, [students, search]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, roll no..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <DataTable columns={studentColumns} data={filtered} />
    </div>
  );
}