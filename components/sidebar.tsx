"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  LayoutDashboard,
  Wrench,
  Fuel,
  Bell,
  FileText,
  Stethoscope,
  Settings,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, gradient: "from-violet-500 to-indigo-500" },
  { title: "Vehicles", href: "/vehicles", icon: Car, gradient: "from-cyan-500 to-blue-500" },
  { title: "Services", href: "/services", icon: Wrench, gradient: "from-orange-500 to-amber-500" },
  { title: "Fuel Logs", href: "/fuel", icon: Fuel, gradient: "from-emerald-500 to-teal-500" },
  { title: "Reminders", href: "/reminders", icon: Bell, gradient: "from-blue-500 to-indigo-500" },
  { title: "Documents", href: "/documents", icon: FileText, gradient: "from-pink-500 to-rose-500" },
  { title: "AI Diagnosis", href: "/ai-diagnosis", icon: Stethoscope, gradient: "from-fuchsia-500 to-purple-500" },
  { title: "Profile", href: "/profile", icon: Settings, gradient: "from-slate-500 to-zinc-500" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-background to-muted/10">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border/50 px-4 lg:h-[60px]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Gauge className="h-4 w-4 text-white" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight">VehicleOS</span>
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-3 gap-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground transition-all duration-200 hover:text-foreground",
                  isActive
                    ? "bg-primary/8 text-foreground shadow-sm"
                    : "hover:bg-muted/50"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b ${item.gradient}`} />
                )}

                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0",
                    isActive
                      ? `bg-gradient-to-br ${item.gradient} shadow-sm`
                      : "bg-muted/50 group-hover:bg-muted"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                </div>
                <span className="truncate">{item.title}</span>

                {/* Hover glow */}
                {isActive && (
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient} opacity-[0.04]`} />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom accent */}
      <div className="p-4 border-t border-border/50">
        <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/10 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-semibold text-foreground">AI Diagnosis</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Describe symptoms and get instant AI-powered vehicle diagnosis.
          </p>
          <Link
            href="/ai-diagnosis"
            className="mt-2 inline-flex items-center text-[11px] font-medium text-violet-500 hover:text-violet-400 transition-colors"
          >
            Try now →
          </Link>
        </div>
      </div>
    </div>
  );
}
