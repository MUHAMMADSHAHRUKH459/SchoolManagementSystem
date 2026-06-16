import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, Users, Briefcase, CreditCard,
  Wallet, TrendingUp, TrendingDown, ArrowUpRight,
} from "lucide-react";

export default async function DashboardPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [
    totalStudents, totalTeachers, totalStaff,
    unpaidFees, unpaidSalaries,
    recentFees, recentSalaries,
  ] = await Promise.all([
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.teacher.count({ where: { status: "ACTIVE" } }),
    prisma.staff.count({ where: { status: "ACTIVE" } }),
    prisma.fee.count({ where: { status: "UNPAID" } }),
    prisma.salary.count({ where: { status: "UNPAID" } }),
    prisma.fee.findMany({
      where: { month: currentMonth, year: currentYear },
      include: {
        student: {
          select: { firstName: true, lastName: true, class: true, section: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.salary.findMany({
      where: { month: currentMonth, year: currentYear },
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        staff: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const monthlyIncome = await prisma.fee.aggregate({
    where: { month: currentMonth, year: currentYear, status: "PAID" },
    _sum: { paidAmount: true },
  });

  const monthlyExpense = await prisma.salary.aggregate({
    where: { month: currentMonth, year: currentYear, status: "PAID" },
    _sum: { netSalary: true },
  });

  const income = Number(monthlyIncome._sum.paidAmount ?? 0);
  const expense = Number(monthlyExpense._sum.netSalary ?? 0);
  const balance = income - expense;
  const monthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back! Here's what's happening in ${monthName} ${currentYear}.`}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Students" value={totalStudents} icon={GraduationCap} trend="Active enrollments" color="green" delay={0.05} />
        <StatCard title="Total Teachers" value={totalTeachers} icon={Users} trend="Active faculty" color="blue" delay={0.1} />
        <StatCard title="Staff Members" value={totalStaff} icon={Briefcase} trend="Active staff" color="purple" delay={0.15} />
        <StatCard title="Pending Fees" value={unpaidFees} icon={CreditCard} trend="Unpaid fee records" color="orange" delay={0.2} />
        <StatCard title="Pending Salaries" value={unpaidSalaries} icon={Wallet} trend="Unpaid salary records" color="red" delay={0.25} />
        <StatCard title="Net Balance" value={`PKR ${balance.toLocaleString()}`} icon={TrendingUp} trend="Income minus expense" color="teal" delay={0.3} />
      </div>

      {/* Income vs Expense */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in-up animate-delay-400">
        <Card className="border border-green-100 shadow-sm overflow-hidden card-hover">
          <CardContent className="p-0">
            <div className="flex items-stretch">
              <div className="w-1 shrink-0" style={{ background: "linear-gradient(180deg, oklch(0.5 0.18 150), oklch(0.42 0.15 160))" }} />
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Monthly Income
                    </p>
                    <p className="text-3xl font-bold text-emerald-600">
                      PKR {income.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fee collections — {monthName}
                    </p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-100 shadow-sm overflow-hidden card-hover">
          <CardContent className="p-0">
            <div className="flex items-stretch">
              <div className="w-1 shrink-0" style={{ background: "linear-gradient(180deg, oklch(0.55 0.22 27), oklch(0.48 0.2 20))" }} />
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Monthly Expense
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      PKR {expense.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Salary payments — {monthName}
                    </p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <TrendingDown className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-in-up animate-delay-500">
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Recent Fee Records
              </CardTitle>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                {monthName}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-1">
            {recentFees.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No fee records this month
              </p>
            ) : (
              recentFees.map((fee: typeof recentFees[0]) => (
                <div
                  key={fee.id}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-green-50/60 transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm"
                      style={{ background: "linear-gradient(135deg, oklch(0.5 0.18 150), oklch(0.42 0.15 160))" }}
                    >
                      {fee.student.firstName[0]}{fee.student.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight group-hover:text-green-700 transition-colors">
                        {fee.student.firstName} {fee.student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Class {fee.student.class}{fee.student.section}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      PKR {Number(fee.totalAmount).toLocaleString()}
                    </p>
                    <Badge
                      variant={fee.status === "PAID" ? "default" : fee.status === "PARTIAL" ? "secondary" : "destructive"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {fee.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                Recent Salary Records
              </CardTitle>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                {monthName}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-1">
            {recentSalaries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No salary records this month
              </p>
            ) : (
              recentSalaries.map((sal: typeof recentSalaries[0]) => {                const person = sal.teacher ?? sal.staff;
                return (
                  <div
                    key={sal.id}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50/60 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm"
                        style={{ background: "linear-gradient(135deg, oklch(0.5 0.18 264), oklch(0.42 0.15 250))" }}
                      >
                        {person?.firstName[0]}{person?.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight group-hover:text-blue-700 transition-colors">
                          {person?.firstName} {person?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sal.teacher ? "Teacher" : "Staff"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        PKR {Number(sal.netSalary).toLocaleString()}
                      </p>
                      <Badge
                        variant={sal.status === "PAID" ? "default" : "destructive"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {sal.status}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}