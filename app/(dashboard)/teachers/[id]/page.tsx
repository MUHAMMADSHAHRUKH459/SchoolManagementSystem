import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      subjects: { include: { subject: true } },
      salaries: { orderBy: { year: "desc" }, take: 6 },
    },
  });

  if (!teacher) notFound();

  const rows = [
    ["Full Name", `${teacher.firstName} ${teacher.lastName}`],
    ["Employee ID", teacher.employeeId],
    ["Email", teacher.email],
    ["Phone", teacher.phone],
    ["Gender", teacher.gender],
    ["Date of Birth", new Date(teacher.dateOfBirth).toLocaleDateString()],
    ["Joining Date", new Date(teacher.joiningDate).toLocaleDateString()],
    ["Qualification", teacher.qualification ?? "—"],
    ["Monthly Salary", `PKR ${Number(teacher.salary).toLocaleString()}`],
    ["Address", teacher.address ?? "—"],
  ];

  return (
    <div>
      <PageHeader
        title={`${teacher.firstName} ${teacher.lastName}`}
        description={`Employee ID: ${teacher.employeeId}`}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge
          variant={
            teacher.status === "ACTIVE"
              ? "default"
              : teacher.status === "SUSPENDED"
              ? "destructive"
              : "secondary"
          }
        >
          {teacher.status}
        </Badge>

        <Link href={`/teachers/${teacher.id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Teacher Details</CardTitle>
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subjects</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {teacher.subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subjects assigned</p>
              ) : (
                teacher.subjects.map((ts) => (
                  <Badge key={ts.subjectId} variant="secondary">
                    {ts.subject.name}
                  </Badge>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Salaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {teacher.salaries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No salary records</p>
              ) : (
                teacher.salaries.map((sal) => (
                  <div key={sal.id} className="flex items-center justify-between text-sm">
                    <span>
                      {new Date(0, sal.month - 1).toLocaleString("default", { month: "short" })}{" "}
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