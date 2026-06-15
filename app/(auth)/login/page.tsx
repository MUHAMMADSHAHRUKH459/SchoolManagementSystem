"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GraduationCap, Eye, EyeOff, Lock, Mail, BookOpen, Users, Award } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, oklch(0.13 0.04 150) 0%, oklch(0.18 0.06 155) 100%)" }}
      >
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10 animate-pulse"
            style={{ background: "radial-gradient(circle, oklch(0.5 0.18 150), transparent)" }} />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, oklch(0.5 0.18 150), transparent)",
              animation: "pulse 3s ease-in-out infinite 1s",
            }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5"
            style={{
              background: "radial-gradient(circle, oklch(0.6 0.2 150), transparent)",
              animation: "pulse 4s ease-in-out infinite 0.5s",
            }} />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-sm w-full">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 animate-fade-in-up">
            <div
              className="h-20 w-20 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.5 0.18 150), oklch(0.4 0.15 160))",
                boxShadow: "0 20px 40px oklch(0.5 0.18 150 / 0.4)",
              }}
            >
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">SchoolMS</h1>
              <p className="text-sm mt-1" style={{ color: "oklch(0.7 0.05 150)" }}>
                Professional School Management
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-3 animate-fade-in-up animate-delay-200">
            {[
              { icon: Users, title: "Student Management", desc: "Complete student lifecycle" },
              { icon: BookOpen, title: "Academic Tracking", desc: "Fees, attendance & more" },
              { icon: Award, title: "Staff Management", desc: "Teachers & staff records" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.02]"
                style={{ background: "oklch(0.20 0.04 150 / 0.8)", border: "1px solid oklch(0.28 0.04 150)" }}
              >
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.5 0.18 150 / 0.2)" }}
                >
                  <item.icon className="h-4 w-4" style={{ color: "oklch(0.65 0.15 150)" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{item.title}</p>
                  <p className="text-[10px]" style={{ color: "oklch(0.6 0.04 150)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center">
            <div
              className="h-14 w-14 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.5 0.18 150), oklch(0.4 0.15 160))" }}
            >
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back 👋</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your administrator account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@school.com"
                  className="pl-9 h-10 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9 h-10 focus:border-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, oklch(0.5 0.18 150), oklch(0.42 0.15 160))",
                boxShadow: "0 4px 14px oklch(0.5 0.18 150 / 0.35)",
              }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>

          <div className="rounded-xl border border-green-100 bg-green-50 p-3">
            <p className="text-xs text-center text-green-700">
              <span className="font-semibold">Demo Credentials:</span>{" "}
              admin@school.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}