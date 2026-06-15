import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "green" | "blue" | "orange" | "red" | "purple" | "teal";
  delay?: number;
}

const colorMap = {
  green: {
    gradient: "linear-gradient(135deg, oklch(0.5 0.18 150), oklch(0.42 0.15 160))",
    shadow: "oklch(0.5 0.18 150 / 0.25)",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-100",
  },
  blue: {
    gradient: "linear-gradient(135deg, oklch(0.5 0.18 264), oklch(0.42 0.15 250))",
    shadow: "oklch(0.5 0.18 264 / 0.25)",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
  },
  orange: {
    gradient: "linear-gradient(135deg, oklch(0.65 0.18 60), oklch(0.58 0.18 50))",
    shadow: "oklch(0.65 0.18 60 / 0.25)",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-100",
  },
  red: {
    gradient: "linear-gradient(135deg, oklch(0.55 0.22 27), oklch(0.48 0.2 20))",
    shadow: "oklch(0.55 0.22 27 / 0.25)",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
  },
  purple: {
    gradient: "linear-gradient(135deg, oklch(0.5 0.2 300), oklch(0.44 0.18 290))",
    shadow: "oklch(0.5 0.2 300 / 0.25)",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-100",
  },
  teal: {
    gradient: "linear-gradient(135deg, oklch(0.52 0.15 185), oklch(0.46 0.14 195))",
    shadow: "oklch(0.52 0.15 185 / 0.25)",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-100",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "green",
  delay = 0,
}: StatCardProps) {
  const c = colorMap[color];

  return (
    <div
      className="animate-fade-in-up card-hover"
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
    >
      <Card className={cn("border shadow-sm overflow-hidden", c.border)}>
        <CardContent className="p-0">
          <div className="flex items-stretch">
            {/* Left color bar */}
            <div
              className="w-1 shrink-0"
              style={{ background: c.gradient }}
            />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {value}
                  </p>
                  {trend && (
                    <p className="text-xs text-muted-foreground">{trend}</p>
                  )}
                </div>
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                  style={{
                    background: c.gradient,
                    boxShadow: `0 4px 12px ${c.shadow}`,
                  }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}