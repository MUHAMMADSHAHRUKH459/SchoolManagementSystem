import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const month = searchParams.get("month") ?? "";
  const year = searchParams.get("year") ?? "";

  const where = {
    ...(status ? { status: status as "PAID" | "UNPAID" | "PARTIAL" } : {}),
    ...(month ? { month: parseInt(month) } : {}),
    ...(year ? { year: parseInt(year) } : {}),
  };

  const salaries = await prisma.salary.findMany({
    where,
    include: {
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          salary: true,
        },
      },
      staff: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          salary: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(salaries);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { personType, personId, month, year, basicSalary, deductions, advance, bonus, remarks } = body;

    const monthInt = parseInt(month);
    const yearInt = parseInt(year);
    const basicSalaryNum = parseFloat(basicSalary);
    const deductionsNum = parseFloat(deductions ?? "0");
    const advanceNum = parseFloat(advance ?? "0");
    const bonusNum = parseFloat(bonus ?? "0");
    const netSalary = basicSalaryNum - deductionsNum - advanceNum + bonusNum;

    // Check duplicate
    const existing = await prisma.salary.findFirst({
      where: {
        ...(personType === "teacher" ? { teacherId: personId } : { staffId: personId }),
        month: monthInt,
        year: yearInt,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Salary record already exists for this month" },
        { status: 400 }
      );
    }

    const salary = await prisma.salary.create({
      data: {
        month: monthInt,
        year: yearInt,
        basicSalary: basicSalaryNum,
        deductions: deductionsNum,
        advance: advanceNum,
        bonus: bonusNum,
        netSalary,
        status: "UNPAID",
        remarks: remarks ?? null,
        ...(personType === "teacher"
          ? { teacherId: personId }
          : { staffId: personId }),
      },
    });

    return NextResponse.json(salary, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create salary" }, { status: 500 });
  }
}