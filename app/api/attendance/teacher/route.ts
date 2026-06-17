import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AttendanceStatus } from "@/types";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const attendance = await prisma.staffAttendance.findMany({
    where: date ? { date: new Date(date) } : {},
    include: {
      staff: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          role: true,
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
      staffId: string;
      date: string;
      status: AttendanceStatus;
      remarks?: string;
    }[];

    const results = await Promise.all(
      records.map((record) =>
        prisma.staffAttendance.upsert({
          where: {
            staffId_date: {
              staffId: record.staffId,
              date: new Date(record.date),
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks ?? null,
          },
          create: {
            staffId: record.staffId,
            date: new Date(record.date),
            status: record.status,
            remarks: record.remarks ?? null,
          },
        })
      )
    );

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save attendance" }, { status: 500 });
  }
}