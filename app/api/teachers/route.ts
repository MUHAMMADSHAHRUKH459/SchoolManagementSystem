import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";

  const where = search
    ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { employeeId: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const teachers = await prisma.teacher.findMany({
    where,
    include: { subjects: { include: { subject: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { subjectIds, ...data } = body;

    const existing = await prisma.teacher.findFirst({
      where: {
        OR: [{ employeeId: data.employeeId }, { email: data.email }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Employee ID or Email already exists" },
        { status: 400 }
      );
    }

    const teacher = await prisma.teacher.create({
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        joiningDate: new Date(data.joiningDate ?? new Date()),
        salary: parseFloat(data.salary),
        subjects: subjectIds?.length
          ? {
              create: subjectIds.map((id: string) => ({
                subject: { connect: { id } },
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}