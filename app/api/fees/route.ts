import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId") ?? "";
  const status = searchParams.get("status") ?? "";
  const month = searchParams.get("month") ?? "";
  const year = searchParams.get("year") ?? "";

  const where = {
    ...(studentId ? { studentId } : {}),
    ...(status ? { status: status as "PAID" | "UNPAID" | "PARTIAL" | "WAIVED" } : {}),
    ...(month ? { month: parseInt(month) } : {}),
    ...(year ? { year: parseInt(year) } : {}),
  };

  const fees = await prisma.fee.findMany({
    where,
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rollNo: true,
          admissionNo: true,
          class: true,
          section: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(fees);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const existing = await prisma.fee.findUnique({
      where: {
        studentId_month_year: {
          studentId: body.studentId,
          month: parseInt(body.month),
          year: parseInt(body.year),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Fee record already exists for this month" },
        { status: 400 }
      );
    }

    const amount = parseFloat(body.amount);
    const discount = parseFloat(body.discount ?? "0");
    const lateFine = parseFloat(body.lateFine ?? "0");
    const paidAmount = parseFloat(body.paidAmount ?? "0");
    const totalAmount = amount - discount + lateFine;
    const dueAmount = totalAmount - paidAmount;

    const status =
      paidAmount <= 0
        ? "UNPAID"
        : paidAmount >= totalAmount
        ? "PAID"
        : "PARTIAL";

    const fee = await prisma.fee.create({
      data: {
        studentId: body.studentId,
        month: parseInt(body.month),
        year: parseInt(body.year),
        amount,
        discount,
        lateFine,
        totalAmount,
        paidAmount,
        dueAmount,
        status,
        remarks: body.remarks ?? null,
        paidAt: paidAmount > 0 ? new Date() : null,
      },
    });

    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create fee" }, { status: 500 });
  }
}