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

  const fee = await prisma.fee.findUnique({
    where: { id },
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
  });

  if (!fee) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(fee);
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

    const fee = await prisma.fee.update({
      where: { id },
      data: {
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

    return NextResponse.json(fee);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update fee" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.fee.delete({ where: { id } });
  return NextResponse.json({ success: true });
}