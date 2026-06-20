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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Vehicles", href: "/vehicles", icon: Car },
  { title: "Services", href: "/services", icon: Wrench },
  { title: "Fuel Logs", href: "/fuel", icon: Fuel },
  { title: "Reminders", href: "/reminders", icon: Bell },
  { title: "Documents", href: "/documents", icon: FileText },
  { title: "AI Diagnosis", href: "/ai-diagnosis", icon: Stethoscope },
  { title: "Profile", href: "/profile", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/20">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-lg tracking-tight">VehicleOS</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  isActive ? "bg-muted text-foreground" : ""
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
