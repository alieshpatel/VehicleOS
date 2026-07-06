"use client";

import {
  Wrench,
  Fuel,
  FileText,
  Stethoscope,
  Bell,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── Animated Odometer (used in Fuel Logs feature card) ─── */
function MiniOdometer() {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          let v = 0;
          const target = 12458;
          const step = target / 60;
          const t = setInterval(() => {
            v += step;
            if (v >= target) {
              setValue(target);
              clearInterval(t);
            } else setValue(Math.floor(v));
          }, 25);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const digits = value.toString().padStart(6, "0").split("");

  return (
    <div ref={ref} className="flex items-end gap-px mt-3 mb-1">
      {digits.map((d, i) => (
        <div
          key={i}
          className={`w-6 h-8 rounded flex items-center justify-center font-mono text-sm font-bold border transition-colors duration-300 ${
            i >= 4
              ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          {d}
        </div>
      ))}
      <span className="text-[10px] text-white/30 ml-1.5 mb-1">km</span>
    </div>
  );
}

/* ─── Animated circular gauge (used in Analytics feature card) ─── */
function MiniGauge() {
  const [percent, setPercent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          let p = 0;
          const t = setInterval(() => {
            p += 1;
            if (p >= 72) {
              setPercent(72);
              clearInterval(t);
            } else setPercent(p);
          }, 20);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div ref={ref} className="relative w-24 h-24 mt-3">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="5"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white font-mono">{percent}</span>
        <span className="text-[9px] text-white/40 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

/* ─── Animated fuel bar (used in Fuel Logs feature card) ─── */
function FuelBar() {
  const [level, setLevel] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => setLevel(68), 200);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-3 space-y-1.5">
      <div className="flex justify-between text-[10px] text-white/40">
        <span>E</span>
        <span className="font-mono text-emerald-400">{level}%</span>
        <span>F</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5 border border-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-1500 ease-out"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Reminder pulse dots ─── */
function ReminderPulse() {
  return (
    <div className="mt-3 space-y-2">
      {[
        { label: "Insurance", days: "12 days", color: "bg-amber-400" },
        { label: "PUC", days: "3 days", color: "bg-red-400" },
        { label: "Service", days: "45 days", color: "bg-emerald-400" },
      ].map((r) => (
        <div key={r.label} className="flex items-center gap-2 text-xs">
          <span className={`h-1.5 w-1.5 rounded-full ${r.color} animate-pulse`} />
          <span className="text-white/60">{r.label}</span>
          <span className="ml-auto text-white/30 font-mono text-[10px]">
            {r.days}
          </span>
        </div>
      ))}
    </div>
  );
}

const features = [
  {
    title: "Maintenance Tracking",
    description: "Keep a detailed log of all services, repairs, and part replacements with cost tracking.",
    icon: Wrench,
    gradient: "from-orange-500 to-amber-500",
    widget: null as React.ReactNode,
  },
  {
    title: "Fuel Logs & Efficiency",
    description: "Log every fill-up and watch your real-world mileage tick up on a live odometer.",
    icon: Fuel,
    gradient: "from-emerald-500 to-teal-500",
    widget: "odometer" as const,
  },
  {
    title: "Smart Reminders",
    description: "Never miss an insurance renewal, PUC deadline, or scheduled service.",
    icon: Bell,
    gradient: "from-blue-500 to-indigo-500",
    widget: "reminders" as const,
  },
  {
    title: "AI Diagnostics",
    description: "Describe symptoms and our Gemini-powered AI suggests causes and estimated costs.",
    icon: Stethoscope,
    gradient: "from-violet-500 to-purple-500",
    widget: null as React.ReactNode,
  },
  {
    title: "Digital Glovebox",
    description: "Securely store RC books, insurance policies, and service bills as photos or PDFs.",
    icon: FileText,
    gradient: "from-pink-500 to-rose-500",
    widget: null as React.ReactNode,
  },
  {
    title: "Cost Analytics",
    description: "Visualize monthly spending with an interactive dashboard gauge.",
    icon: BarChart3,
    gradient: "from-cyan-500 to-sky-500",
    widget: "gauge" as const,
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const renderWidget = () => {
    switch (feature.widget) {
      case "odometer":
        return <MiniOdometer />;
      case "gauge":
        return <MiniGauge />;
      case "reminders":
        return <ReminderPulse />;
      default:
        return feature.title === "Fuel Logs & Efficiency" ? (
          <FuelBar />
        ) : null;
    }
  };

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient border on hover */}
      <div
        className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.gradient} transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Glow */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl transition-opacity duration-500 ${
          isHovered ? "opacity-10" : "opacity-0"
        }`}
      />

      {/* Card inner */}
      <div className="relative rounded-2xl bg-[#0f0f13] border border-white/[0.06] p-6 sm:p-7 h-full flex flex-col transition-transform duration-300 group-hover:-translate-y-1">
        <div
          className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
        >
          <feature.icon className="h-5 w-5 text-white" />
        </div>

        <h3 className="text-base font-semibold text-white mb-1.5">
          {feature.title}
        </h3>
        <p className="text-white/40 text-sm leading-relaxed flex-1">
          {feature.description}
        </p>

        {/* Inline animated widget */}
        {renderWidget()}

        {/* Bottom accent */}
        <div
          className={`mt-4 h-0.5 rounded-full bg-gradient-to-r ${feature.gradient} transition-all duration-500 ${
            isHovered ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        />
      </div>
    </div>
  );
}

export function Features() {
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#09090b]">
      {/* Subtle top/bottom gradients */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={headingRef}
          className={`text-center max-w-3xl mx-auto mb-16 sm:mb-20 transition-all duration-700 ${
            headingVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400 mb-6">
            Dashboard Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white mb-4">
            Everything your car needs,
            <span className="block mt-1 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              in one dashboard
            </span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            From an animated odometer to AI diagnostics — experience vehicle
            management like an in-car instrument cluster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} index={idx} />
          ))}
        </div>

        {/* Dashboard gauge image below */}
        <div className="mt-20 flex justify-center">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b] z-10 pointer-events-none" />
            <Image
              src="/dashboard-gauge.png"
              alt="Vehicle dashboard gauge cluster"
              width={600}
              height={400}
              className="w-full h-auto rounded-2xl opacity-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
