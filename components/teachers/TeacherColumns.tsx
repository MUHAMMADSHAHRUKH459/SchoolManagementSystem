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
import { TeacherMember } from "@/types";

function ActionCell({ teacher }: { teacher: TeacherMember }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this teacher?")) return;
    const res = await fetch(`/api/teachers/${teacher.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Teacher deleted");
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
        <DropdownMenuItem onClick={() => router.push(`/teachers/${teacher.id}`)}>
          <Eye className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/teachers/${teacher.id}/edit`)}>
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

export const teacherColumns: ColumnDef<TeacherMember>[] = [
  {
    accessorKey: "employeeId",
    header: "Emp. ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("employeeId")}</span>
    ),
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "subjects",
    header: "Subjects",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.subjects?.slice(0, 2).map((ts) => (
          <Badge key={ts.subject.id} variant="secondary" className="text-xs">
            {ts.subject.name}
          </Badge>
        ))}
        {row.original.subjects?.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{row.original.subjects.length - 2}
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => (
      <span>PKR {Number(row.getValue("salary")).toLocaleString()}</span>
    ),
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
    cell: ({ row }) => <ActionCell teacher={row.original} />,
  },
];