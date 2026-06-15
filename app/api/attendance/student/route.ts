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
  const cls = searchParams.get("class") ?? "";

  const where = {
    ...(date ? { date: new Date(date) } : {}),
    ...(cls
      ? { student: { class: cls } }
      : {}),
  };

  const attendance = await prisma.studentAttendance.findMany({
    where,
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rollNo: true,
          class: true,
          section: true,
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
      studentId: string;
      date: string;
      status: AttendanceStatus;
      remarks?: string;
    }[];

    const results = await Promise.all(
      records.map((record) =>
        prisma.studentAttendance.upsert({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: new Date(record.date),
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks ?? null,
          },
          create: {
            studentId: record.studentId,
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