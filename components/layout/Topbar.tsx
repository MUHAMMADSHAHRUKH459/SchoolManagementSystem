"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Bell, Settings, User, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-config";

export function Topbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const initials = session?.user?.name?.slice(0, 2).toUpperCase() ?? "AD";

  const currentPage = navItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href))
  );

  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border px-6 animate-fade-in-up"
      style={{
        background: "oklch(1 0 0 / 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Home className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">/</span>
        <span className="text-xs font-semibold text-foreground">
          {currentPage?.title ?? "Dashboard"}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full relative hover:bg-primary/10 transition-colors"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-primary/10 hover:rotate-45 transition-all duration-300"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
        </Button>

        <div className="h-5 w-px bg-border mx-2" />

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-primary/8 transition-all duration-200 border border-transparent hover:border-primary/20">
              <Avatar className="h-7 w-7">
                <AvatarFallback
                  className="text-[10px] font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.5 0.18 150), oklch(0.4 0.15 160))",
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight">{session?.user?.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Administrator</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 animate-scale-in">
            <DropdownMenuLabel className="pb-1">
              <p className="text-sm font-semibold">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground font-normal">{session?.user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}