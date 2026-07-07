"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu, Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/vehicles": "My Garage",
  "/services": "Services",
  "/fuel": "Fuel Logs",
  "/reminders": "Reminders",
  "/documents": "Documents",
  "/ai-diagnosis": "AI Diagnosis",
  "/profile": "Profile",
};

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPage = Object.entries(pageTitles).find(
    ([path]) => pathname === path || pathname.startsWith(`${path}/`)
  );

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Page title with breadcrumb-like feel */}
      <div className="flex-1 flex items-center gap-3">
        {currentPage && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" />
            <span className="text-sm font-semibold">{currentPage[1]}</span>
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Search button placeholder */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          <Search className="h-4.5 w-4.5" />
          <span className="sr-only">Search</span>
        </Button>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
        <div className="h-6 w-px bg-border/50 mx-1" />
        <UserButton />
      </div>
    </header>
  );
}
