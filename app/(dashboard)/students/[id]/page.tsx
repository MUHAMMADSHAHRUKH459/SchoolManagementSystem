import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      fees: { orderBy: { year: "desc" }, take: 12 },
    },
  });

  if (!student) notFound();

  const rows = [
    ["Full Name", `${student.firstName} ${student.lastName}`],
    ["Roll No", student.rollNo],
    ["Admission No", student.admissionNo],
    ["Class", `Class ${student.class} — Section ${student.section}`],
    ["Gender", student.gender],
    ["Date of Birth", new Date(student.dateOfBirth).toLocaleDateString()],
    ["Father", student.fatherName],
    ["Mother", student.motherName],
    ["Phone", student.phone ?? "—"],
    ["Email", student.email ?? "—"],
    ["Address", student.address ?? "—"],
    ["Admission Date", new Date(student.admissionDate).toLocaleDateString()],
  ];

  return (
    <div>
      <PageHeader
        title={`${student.firstName} ${student.lastName}`}
        description={`Adm. No: ${student.admissionNo}`}
      />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge
          variant={
            student.status === "ACTIVE"
              ? "default"
              : student.status === "SUSPENDED"
              ? "destructive"
              : "secondary"
          }
        >
          {student.status}
        </Badge>
        <Link
          href={`/students/${student.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Student Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                {rows.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium text-muted-foreground">
                      {label}
                    </dt>
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
              <CardTitle className="text-base">Recent Fees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {student.fees.length === 0 ? (
                <p className="text-sm text-muted-foreground">No fee records</p>
              ) : (
                student.fees.map((fee) => (
                  <div
                    key={fee.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {new Date(0, fee.month - 1).toLocaleString("default", {
                        month: "short",
                      })}{" "}
                      {fee.year}
                    </span>
                    <Badge
                      variant={fee.status === "PAID" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {fee.status}
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