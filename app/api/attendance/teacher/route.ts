import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const attendance = await prisma.teacherAttendance.findMany({
    where: date ? { date: new Date(date) } : {},
    include: {
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(attendance);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const records = body.records as {
      teacherId: string;
      date: string;
      status: AttendanceStatus;
      remarks?: string;
    }[];

    const results = await Promise.all(
      records.map((record) =>
        prisma.teacherAttendance.upsert({
          where: {
            teacherId_date: {
              teacherId: record.teacherId,
              date: new Date(record.date),
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks ?? null,
          },
          create: {
            teacherId: record.teacherId,
            date: new Date(record.date),
            status: record.status,
            remarks: record.remarks ?? null,
          },
        })
      )
    );

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save attendance" },
      { status: 500 }
    );
  }
}