import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Activity } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Introducing AI-Powered Diagnostics
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            The intelligent operating system for your vehicles.
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl mb-10 max-w-2xl mx-auto">
            Track maintenance, log fuel expenses, store important documents, and get AI-powered diagnostics when things go wrong — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base" asChild>
              <Link href="/sign-up">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base" asChild>
              <Link href="/features">See all features</Link>
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              Secure storage
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Real-time tracking
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
    </section>
  );
}
