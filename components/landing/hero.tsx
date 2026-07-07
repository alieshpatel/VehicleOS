"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Gauge, Shield, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export function Hero() {
  const [visible, setVisible] = useState(false);
  const [lightsPhase, setLightsPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    // Continuous blinking parking lights cycle: 0=off, 1=on, repeats
    const blinkInterval = setInterval(() => {
      setLightsPhase((prev) => (prev === 0 ? 1 : 0));
    }, 1200);
    return () => {
      clearTimeout(t1);
      clearInterval(blinkInterval);
    };
  }, []);

  const lightsOn = lightsPhase === 1;

  return (
    <section className="relative overflow-hidden min-h-[100svh] flex items-center bg-[#09090b]">
      {/* Ambient background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[120px] animate-ambient-1" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] animate-ambient-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-fuchsia-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Road ground line */}
      <div className="absolute bottom-[18%] sm:bottom-[22%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_80%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left pt-10 lg:pt-0">
            <div
              className={`transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400 backdrop-blur-sm mb-6">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                AI-Powered Vehicle Intelligence
              </div>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white mb-6 transition-all duration-700 delay-150 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <span className="block">Your car.</span>
              <span className="block mt-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                Your control.
              </span>
              <span className="block mt-1 text-white/60">Your&nbsp;OS.</span>
            </h1>

            <p
              className={`text-base sm:text-lg text-white/50 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed transition-all duration-700 delay-300 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Track maintenance with an odometer-style dashboard, log fuel in
              real-time, and let AI diagnose your BMW — all from one
              beautifully crafted platform.
            </p>

            <div
              className={`flex flex-col sm:flex-row items-center lg:items-start gap-4 transition-all duration-700 delay-[450ms] ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 px-8 text-base bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group"
                asChild
              >
                <Link href="/sign-up">
                  Connect your car
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-13 px-8 text-base bg-transparent border-white/10 text-white/70 hover:bg-white/5 hover:text-white hover:border-violet-500/30 transition-all duration-300"
                asChild
              >
                <Link href="/features">Explore features</Link>
              </Button>
            </div>

            <div
              className={`mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 transition-all duration-700 delay-[600ms] ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {[
                { icon: Shield, label: "Encrypted data", color: "text-emerald-400" },
                { icon: Gauge, label: "Real-time stats", color: "text-cyan-400" },
                { icon: Wifi, label: "Always connected", color: "text-violet-400" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-xs text-white/40 font-medium">
                  <b.icon className={`h-3.5 w-3.5 ${b.color}`} />
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: BMW 3 Series with blinking parking lights */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            {/* === HEADLIGHT GLOW — left DRL === */}
            <div
              className={`absolute top-[30%] left-[6%] w-24 h-14 rounded-full transition-all duration-500 pointer-events-none z-20 ${
                lightsOn
                  ? "bg-blue-400/40 blur-2xl opacity-100"
                  : "bg-blue-400/10 blur-xl opacity-30"
              }`}
            />
            {/* === HEADLIGHT GLOW — right DRL === */}
            <div
              className={`absolute top-[33%] left-[22%] w-20 h-10 rounded-full transition-all duration-500 pointer-events-none z-20 ${
                lightsOn
                  ? "bg-blue-300/30 blur-xl opacity-100"
                  : "bg-blue-300/5 blur-lg opacity-20"
              }`}
            />
            {/* === HEADLIGHT beam on ground === */}
            <div
              className={`absolute bottom-[4%] left-[5%] w-[55%] h-16 rounded-full transition-all duration-700 pointer-events-none z-20 ${
                lightsOn
                  ? "bg-blue-400/8 blur-3xl opacity-100"
                  : "opacity-0"
              }`}
            />
            {/* === TAIL LIGHT GLOW === */}
            <div
              className={`absolute top-[36%] right-[4%] w-14 h-8 rounded-full transition-all duration-500 pointer-events-none z-20 ${
                lightsOn
                  ? "bg-red-500/50 blur-xl opacity-100"
                  : "bg-red-500/15 blur-lg opacity-40"
              }`}
            />
            {/* === TAIL LIGHT ground reflection === */}
            <div
              className={`absolute bottom-[4%] right-[5%] w-[30%] h-10 rounded-full transition-all duration-700 pointer-events-none z-20 ${
                lightsOn
                  ? "bg-red-500/8 blur-2xl opacity-100"
                  : "opacity-0"
              }`}
            />

            {/* The car image */}
            <div className="relative z-10">
              <Image
                src="/hero-car-bmw.png"
                alt="BMW 3 Series sedan with parking lights"
                width={800}
                height={500}
                className="w-full h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

