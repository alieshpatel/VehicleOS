"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Wrench, Fuel, Bell, TrendingUp } from "lucide-react";

interface StatsProps {
  stats: {
    totalVehicles: number;
    upcomingServices: number;
    fuelExpensesThisMonth: number;
    activeReminders: number;
  };
}

function AnimatedNumber({
  target,
  prefix = "",
  suffix = "",
  duration = 1200,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const statCards = [
  {
    key: "totalVehicles" as const,
    title: "Total Vehicles",
    icon: Car,
    subtitle: "Registered in your garage",
    gradient: "from-violet-500 to-indigo-500",
    bgGradient: "from-violet-500/10 to-indigo-500/5",
    iconBg: "bg-gradient-to-br from-violet-500 to-indigo-500",
  },
  {
    key: "upcomingServices" as const,
    title: "Upcoming Services",
    icon: Wrench,
    subtitle: "Logged maintenance records",
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-500/10 to-amber-500/5",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-500",
  },
  {
    key: "fuelExpensesThisMonth" as const,
    title: "Fuel Expenses (Month)",
    icon: Fuel,
    subtitle: "Across all vehicles",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/5",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    prefix: "₹",
  },
  {
    key: "activeReminders" as const,
    title: "Active Reminders",
    icon: Bell,
    subtitle: "Pending tasks",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/5",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
];

export function DashboardStats({ stats }: StatsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, idx) => (
        <Card
          key={card.key}
          className={`relative overflow-hidden border-border/50 shadow-sm group hover:shadow-md transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${idx * 100}ms` }}
        >
          {/* Gradient background accent */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`} />

          {/* Hover glow */}
          <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />

          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`h-9 w-9 rounded-xl ${card.iconBg} flex items-center justify-center shadow-sm`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">
              <AnimatedNumber
                target={stats[card.key]}
                prefix={card.prefix}
                duration={1200 + idx * 200}
              />
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <TrendingUp className={`h-3 w-3 text-emerald-500`} />
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
