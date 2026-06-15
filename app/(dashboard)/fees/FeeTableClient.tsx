"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { feeColumns } from "@/components/fees/FeeColumns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { FeeWithStudent, FeeStatus, MONTHS } from "@/types";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export function FeeTableClient({ fees }: { fees: FeeWithStudent[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FeeStatus | "ALL">("ALL");
  const [monthFilter, setMonthFilter] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<string>(currentYear.toString());

  const filtered = useMemo(() => {
    return fees.filter((f) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        f.student.firstName.toLowerCase().includes(q) ||
        f.student.lastName.toLowerCase().includes(q) ||
        f.student.rollNo.toLowerCase().includes(q);

      const matchStatus = statusFilter === "ALL" || f.status === statusFilter;
      const matchMonth = monthFilter === "ALL" || f.month.toString() === monthFilter;
      const matchYear = yearFilter === "ALL" || f.year.toString() === yearFilter;

      return matchSearch && matchStatus && matchMonth && matchYear;
    });
  }, [fees, search, statusFilter, monthFilter, yearFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, roll no..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter((v ?? "ALL") as FeeStatus | "ALL")}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="PARTIAL">Partial</SelectItem>
            <SelectItem value="WAIVED">Waived</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={monthFilter}
          onValueChange={(v) => setMonthFilter(v ?? "ALL")}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Months</SelectItem>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={yearFilter}
          onValueChange={(v) => setYearFilter(v ?? currentYear.toString())}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Years</SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={feeColumns} data={filtered} />
    </div>
  );
}