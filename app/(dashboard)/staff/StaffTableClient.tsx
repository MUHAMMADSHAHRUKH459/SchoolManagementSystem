"use client";

import type { Staff } from "@prisma/client";
import { useState, useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { staffColumns } from "@/components/staff/StaffColumns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function StaffTableClient({ staff }: { staff: Staff[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return staff.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.employeeId.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q)
    );
  }, [staff, search]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <DataTable columns={staffColumns} data={filtered} />
    </div>
  );
}