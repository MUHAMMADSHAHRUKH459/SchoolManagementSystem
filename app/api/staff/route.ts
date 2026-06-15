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
          { employeeId: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const staff = await prisma.staff.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(staff);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const existing = await prisma.staff.findFirst({
      where: { employeeId: body.employeeId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Employee ID already exists" },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.create({
      data: {
        ...body,
        salary: parseFloat(body.salary),
        joiningDate: new Date(body.joiningDate ?? new Date()),
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}