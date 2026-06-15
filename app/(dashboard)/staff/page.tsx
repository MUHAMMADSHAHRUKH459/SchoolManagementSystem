import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StaffTableClient } from "./StaffTableClient";

export default async function StaffPage() {
  const staff = await prisma.staff.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Staff</h1>
          <p className="mt-2 text-sm text-muted-foreground">{staff.length} total staff members</p>
        </div>
        <Link
          href="/staff/new"
          className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Link>
      </div>
      <StaffTableClient staff={staff} />
    </div>
  );
}