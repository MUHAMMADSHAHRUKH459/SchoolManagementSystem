"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SalaryStatus, SalaryWithPerson, MONTHS } from "@/types";

function ActionCell({ salary }: { salary: SalaryWithPerson }) {
  const router = useRouter();

  const handleMarkPaid = async () => {
    const res = await fetch(`/api/salary/${salary.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basicSalary: salary.basicSalary,
        deductions: salary.deductions,
        advance: salary.advance,
        bonus: salary.bonus,
        status: "PAID",
        remarks: salary.remarks,
      }),
    });
    if (res.ok) {
      toast.success("Marked as paid");
      router.refresh();
    } else {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this salary record?")) return;
    const res = await fetch(`/api/salary/${salary.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Salary deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {salary.status !== "PAID" && (
          <DropdownMenuItem onClick={handleMarkPaid}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Mark as Paid
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const statusVariant: Record<SalaryStatus, "default" | "secondary" | "destructive"> = {
  PAID: "default",
  UNPAID: "destructive",
  PARTIAL: "secondary",
};

export const salaryColumns: ColumnDef<SalaryWithPerson>[] = [
  {
    id: "person",
    header: "Employee",
    cell: ({ row }) => {
      const person = row.original.teacher ?? row.original.staff;
      const type = row.original.teacher ? "Teacher" : "Staff";
      return (
        <div>
          <p className="font-medium text-sm">
            {person?.firstName} {person?.lastName}
          </p>
          <p className="text-xs text-muted-foreground">
            {person?.employeeId} — {type}
          </p>
        </div>
      );
    },
  },
  {
    id: "period",
    header: "Period",
    cell: ({ row }) => (
      <span>
        {MONTHS.find((m) => m.value === row.original.month.toString())?.label}{" "}
        {row.original.year}
      </span>
    ),
  },
  {
    accessorKey: "basicSalary",
    header: "Basic",
    cell: ({ row }) => (
      <span>PKR {Number(row.getValue("basicSalary")).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "deductions",
    header: "Deductions",
    cell: ({ row }) => (
      <span className="text-red-600">
        PKR {Number(row.getValue("deductions")).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "bonus",
    header: "Bonus",
    cell: ({ row }) => (
      <span className="text-green-600">
        PKR {Number(row.getValue("bonus")).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "netSalary",
    header: "Net Salary",
    cell: ({ row }) => (
      <span className="font-semibold">
        PKR {Number(row.getValue("netSalary")).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<SalaryStatus>("status");
      return <Badge variant={statusVariant[status]}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell salary={row.original} />,
  },
];