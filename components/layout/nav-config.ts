import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  CreditCard,
  Wallet,
  CalendarCheck,
} from "lucide-react";

export const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Students", href: "/students", icon: GraduationCap },
  { title: "Teachers", href: "/teachers", icon: Users },
  { title: "Staff", href: "/staff", icon: Briefcase },
  { title: "Fees", href: "/fees", icon: CreditCard },
  { title: "Salary", href: "/salary", icon: Wallet },
  { title: "Attendance", href: "/attendance", icon: CalendarCheck },
];