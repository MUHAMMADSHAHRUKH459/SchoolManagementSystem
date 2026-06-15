import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const cls = searchParams.get("class") ?? "";

  const where = {
    AND: [
      search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
              { rollNo: { contains: search, mode: "insensitive" as const } },
              { admissionNo: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {},
      cls ? { class: cls } : {},
    ],
  };

  const students = await prisma.student.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const existing = await prisma.student.findFirst({
      where: {
        OR: [
          { rollNo: body.rollNo },
          { admissionNo: body.admissionNo },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Roll No or Admission No already exists" },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        ...body,
        dateOfBirth: new Date(body.dateOfBirth),
        admissionDate: new Date(),
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}