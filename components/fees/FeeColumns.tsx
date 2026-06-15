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
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FeeStatus, FeeWithStudent, MONTHS } from "@/types";

function ActionCell({ fee }: { fee: FeeWithStudent }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this fee record?")) return;
    const res = await fetch(`/api/fees/${fee.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Fee deleted");
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
        <DropdownMenuItem onClick={() => router.push(`/fees/${fee.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
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

const statusVariant: Record<FeeStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "default",
  UNPAID: "destructive",
  PARTIAL: "secondary",
  WAIVED: "outline",
};

export const feeColumns: ColumnDef<FeeWithStudent>[] = [
  {
    accessorKey: "receiptNo",
    header: "Receipt No",
    cell: ({ row }) => (
      <span className="font-mono text-xs truncate max-w-[100px] block">
        {row.getValue<string>("receiptNo").slice(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    id: "student",
    header: "Student",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">
          {row.original.student.firstName} {row.original.student.lastName}
        </p>
        <p className="text-xs text-muted-foreground">
          {row.original.student.rollNo} — Class {row.original.student.class}
          {row.original.student.section}
        </p>
      </div>
    ),
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
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => (
      <span>PKR {Number(row.getValue("totalAmount")).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "paidAmount",
    header: "Paid",
    cell: ({ row }) => (
      <span className="text-green-600 font-medium">
        PKR {Number(row.getValue("paidAmount")).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "dueAmount",
    header: "Due",
    cell: ({ row }) => (
      <span className="text-red-600 font-medium">
        PKR {Number(row.getValue("dueAmount")).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<FeeStatus>("status");
      return <Badge variant={statusVariant[status]}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell fee={row.original} />,
  },
];