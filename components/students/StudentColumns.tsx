"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StudentType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function ActionCell({ student }: { student: StudentType }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this student? This cannot be undone.")) return;
    const res = await fetch(`/api/students/${student.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Student deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted/80">
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href={`/students/${student.id}`} className="flex w-full items-center gap-2">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/students/${student.id}/edit`} className="flex w-full items-center gap-2">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const studentColumns: ColumnDef<StudentType>[] = [
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
      <span>
        Class {row.original.class} — {row.original.section}
      </span>
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
        <Badge
          variant={
            status === "ACTIVE"
              ? "default"
              : status === "SUSPENDED"
              ? "destructive"
              : "secondary"
          }
        >
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