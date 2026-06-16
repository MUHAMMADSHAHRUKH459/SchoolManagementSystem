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
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StudentMember } from "@/types";

function ActionCell({ student }: { student: StudentMember }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this student? This cannot be undone.")) return;
    const res = await fetch(`/api/students/${student.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Student deleted");
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
        <DropdownMenuItem onClick={() => router.push(`/students/${student.id}`)}>
          <Eye className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/students/${student.id}/edit`)}>
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

export const studentColumns: ColumnDef<StudentMember>[] = [
  {
    accessorKey: "admissionNo",
    header: "Adm. No",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("admissionNo")}</span>
    ),
  },
  {
    accessorKey: "rollNo",
    header: "Roll No",
  },
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.firstName} {row.original.lastName}
      </span>
    ),
  },
  {
    id: "class",
    header: "Class",
    cell: ({ row }) => (
      <span>Class {row.original.class} — {row.original.section}</span>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <span className="capitalize text-sm">
        {row.getValue<string>("gender").toLowerCase()}
      </span>
    ),
  },
  {
    accessorKey: "fatherName",
    header: "Father",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      return (
        <Badge variant={status === "ACTIVE" ? "default" : status === "SUSPENDED" ? "destructive" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell student={row.original} />,
  },
];