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

  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      salaries: { orderBy: { createdAt: "desc" }, take: 6 },
    },
  });

  if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(staff);
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
    const { salaries, attendance, createdAt, updatedAt, ...data } = body;

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        ...data,
        salary: parseFloat(data.salary),
        joiningDate: new Date(data.joiningDate),
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.staff.delete({ where: { id } });
  return NextResponse.json({ success: true });
}