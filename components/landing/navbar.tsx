import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">VehicleOS</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/features" className="text-sm font-medium hover:text-primary">Features</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium hover:text-primary hidden sm:block">
            Log in
          </Link>
          <Button asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
