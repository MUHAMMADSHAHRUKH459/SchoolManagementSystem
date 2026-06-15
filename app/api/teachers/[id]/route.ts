import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      subjects: { include: { subject: true } },
      salaries: { orderBy: { createdAt: "desc" }, take: 6 },
    },
  });

  if (!teacher) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(teacher);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { subjectIds, subjects, salaries, createdAt, updatedAt, ...data } = body;

    await prisma.teacherSubject.deleteMany({ where: { teacherId: id } });

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        joiningDate: new Date(data.joiningDate),
        salary: parseFloat(data.salary),
        subjects: subjectIds?.length
          ? {
              create: subjectIds.map((sid: string) => ({
                subject: { connect: { id: sid } },
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.teacher.delete({ where: { id } });
  return NextResponse.json({ success: true });
}