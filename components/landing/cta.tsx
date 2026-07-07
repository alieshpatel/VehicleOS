"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CTA() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-[#0a0a0f]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Background ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className={`relative max-w-4xl mx-auto rounded-3xl overflow-hidden transition-all duration-700 ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-95"
          }`}
        >
          {/* Gradient border */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-500 p-px rounded-3xl" />

          {/* Inner */}
          <div className="relative bg-[#0c0c12] m-px rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
            <Sparkles className="absolute top-6 right-8 h-5 w-5 text-violet-500/20 animate-pulse" />
            <Sparkles
              className="absolute bottom-8 left-10 h-4 w-4 text-cyan-500/20 animate-pulse"
              style={{ animationDelay: "1s" }}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-violet-500/5 blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                Ready to take control of
                <span className="block mt-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                  your vehicles?
                </span>
              </h2>
              <p className="text-lg text-white/40 max-w-xl mx-auto mb-8">
                Join thousands of vehicle owners who trust VehicleOS for smarter
                maintenance and worry-free ownership.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="h-13 px-8 text-base bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
                  asChild
                >
                  <Link href="/sign-up">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-8 text-base bg-transparent border-white/10 text-white/70 hover:bg-white/5 hover:border-violet-500/30 transition-all duration-300"
                  asChild
                >
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
              <p className="text-xs text-white/25 mt-6">
                No credit card required · Free plan available forever
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
