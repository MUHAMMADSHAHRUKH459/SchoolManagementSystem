"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-config";
import { cn } from "@/lib/utils";
import { GraduationCap, ChevronRight, Sparkles } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col animate-fade-in-left"
      style={{ background: "var(--color-sidebar)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
          style={{
            background: "linear-gradient(135deg, oklch(0.5 0.18 150), oklch(0.4 0.15 160))",
            boxShadow: "0 4px 14px oklch(0.5 0.18 150 / 0.4)",
          }}
        >
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-sidebar-foreground tracking-wide flex items-center gap-1">
            SchoolMS
            <Sparkles className="h-3 w-3 text-green-400" />
          </p>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--sidebar-muted)" }}>
            Management System
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--sidebar-muted)" }}>
          Main Navigation
        </p>

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 animate-fade-in-up",
                isActive
                  ? "text-white"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              style={{
                animationDelay: `${index * 0.05}s`,
                ...(isActive
                  ? {
                      background: "linear-gradient(135deg, oklch(0.5 0.18 150), oklch(0.42 0.15 160))",
                      boxShadow: "0 4px 12px oklch(0.5 0.18 150 / 0.3)",
                    }
                  : {}),
              }}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-all duration-200",
                isActive
                  ? "text-white"
                  : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground group-hover:scale-110"
              )} />
              <span className="flex-1">{item.title}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400"
            style={{ animation: "pulse-green 2s infinite" }} />
          <p className="text-[10px]" style={{ color: "var(--sidebar-muted)" }}>
            System Online
          </p>
        </div>
      </div>
    </aside>
  );
}