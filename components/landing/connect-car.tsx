"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Wifi, CheckCircle2, Car, Cpu, Cloud, Shield } from "lucide-react";

const steps = [
  { icon: Car, label: "Detecting vehicle", delay: 0 },
  { icon: Cpu, label: "Reading diagnostics", delay: 800 },
  { icon: Cloud, label: "Syncing to cloud", delay: 1600 },
  { icon: Shield, label: "Secured & connected", delay: 2400 },
];

export function ConnectCar() {
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [connected, setConnected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setVisible(true);

          // Play through connection steps
          steps.forEach((_, i) => {
            setTimeout(() => setActiveStep(i), steps[i].delay + 500);
          });
          setTimeout(() => setConnected(true), 3400);
        }
      },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 overflow-hidden bg-[#0a0a0f]"
    >
      {/* Accent lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* Background scan lines */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Car being scanned */}
          <div
            className={`relative transition-all duration-1000 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            {/* Scan line sweeping over the car */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 transition-opacity duration-500 ${
                visible && !connected ? "opacity-100 animate-scan-line" : "opacity-0"
              }`}
            />

            {/* Connection ring pulse */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border transition-all duration-1000 ${
                connected
                  ? "border-emerald-500/30 animate-connection-ring"
                  : "border-cyan-500/20 animate-connection-ring"
              }`}
            />
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border transition-all duration-1000 delay-200 ${
                connected
                  ? "border-emerald-500/15 animate-connection-ring-slow"
                  : "border-cyan-500/10 animate-connection-ring-slow"
              }`}
            />

            <Image
              src="/car-connecting.png"
              alt="Car connecting to VehicleOS system"
              width={700}
              height={450}
              className={`w-full h-auto rounded-2xl relative z-10 transition-all duration-1000 ${
                connected ? "drop-shadow-[0_0_30px_rgba(16,185,129,0.15)]" : ""
              }`}
            />

            {/* Connected badge */}
            <div
              className={`absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 transition-all duration-700 ${
                connected
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-75 translate-y-4"
              }`}
            >
              <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <div>
                  <div className="text-xs text-emerald-300 font-semibold">
                    Vehicle Connected
                  </div>
                  <div className="text-[10px] text-emerald-400/60">
                    All systems synced
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text + connection steps */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400 mb-6">
              <Wifi className="h-3.5 w-3.5" />
              Seamless Connection
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Your car is now
              <span className="block mt-1 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                connected to your system
              </span>
            </h2>

            <p className="text-white/40 text-lg mb-10 leading-relaxed max-w-lg">
              Add your vehicle and watch it come alive in VehicleOS. Our system
              instantly scans, syncs, and secures your car data in the cloud.
            </p>

            {/* Connection steps */}
            <div className="space-y-4">
              {steps.map((step, i) => {
                const isActive = i <= activeStep;
                const isCurrent = i === activeStep && !connected;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${
                      isActive
                        ? "bg-white/[0.03] border border-white/[0.06]"
                        : "opacity-40"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? connected
                            ? "bg-emerald-500/20"
                            : "bg-cyan-500/20"
                          : "bg-white/5"
                      }`}
                    >
                      {isActive && connected ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <step.icon
                          className={`h-5 w-5 transition-colors duration-500 ${
                            isActive ? "text-cyan-400" : "text-white/30"
                          } ${isCurrent ? "animate-pulse" : ""}`}
                        />
                      )}
                    </div>
                    <div>
                      <span
                        className={`text-sm font-medium transition-colors duration-500 ${
                          isActive ? "text-white" : "text-white/30"
                        }`}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <div className="flex gap-1 mt-1">
                          <span className="h-1 w-1 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-1 w-1 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-1 w-1 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
