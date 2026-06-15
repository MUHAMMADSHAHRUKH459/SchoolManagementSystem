import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      salaries: { orderBy: { year: "desc" }, take: 6 },
    },
  });

  if (!staff) notFound();

  const rows = [
    ["Full Name", `${staff.firstName} ${staff.lastName}`],
    ["Employee ID", staff.employeeId],
    ["Role", staff.role.charAt(0) + staff.role.slice(1).toLowerCase()],
    ["Phone", staff.phone],
    ["Email", staff.email ?? "—"],
    ["Gender", staff.gender],
    ["Monthly Salary", `PKR ${Number(staff.salary).toLocaleString()}`],
    ["Joining Date", new Date(staff.joiningDate).toLocaleDateString()],
    ["Address", staff.address ?? "—"],
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {staff.firstName} {staff.lastName}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Employee ID: {staff.employeeId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={
                staff.status === "ACTIVE"
                  ? "default"
                  : staff.status === "SUSPENDED"
                  ? "destructive"
                  : "secondary"
              }
            >
              {staff.status}
            </Badge>
            <Link
              href={`/staff/${staff.id}/edit`}
              className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Staff Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                {rows.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                    <dd className="mt-1 text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Salaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {staff.salaries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No salary records</p>
              ) : (
                staff.salaries.map((sal) => (
                  <div key={sal.id} className="flex items-center justify-between text-sm">
                    <span>
                      {new Date(0, sal.month - 1).toLocaleString("default", {
                        month: "short",
                      })}{" "}
                      {sal.year}
                    </span>
                    <Badge
                      variant={sal.status === "PAID" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {sal.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}