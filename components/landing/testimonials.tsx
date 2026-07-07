"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    quote:
      "VehicleOS saved me thousands by catching a maintenance issue my mechanic missed. The AI diagnostics are eerily accurate.",
    name: "Rajesh K.",
    role: "Fleet Manager",
    avatar: "RK",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    quote:
      "I manage 12 vehicles for my business. Before VehicleOS, tracking was a nightmare. Now everything is in one place.",
    name: "Priya M.",
    role: "Business Owner",
    avatar: "PM",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    quote:
      "The smart reminders alone are worth it. I never miss insurance renewals or PUC deadlines anymore.",
    name: "Arjun S.",
    role: "Car Enthusiast",
    avatar: "AS",
    gradient: "from-emerald-500 to-teal-500",
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
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
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative group transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0f0f13] p-6 sm:p-8 h-full hover:border-violet-500/20 transition-all duration-300 hover:-translate-y-1">
        {/* Quote mark */}
        <div className="text-5xl font-serif leading-none text-violet-500/15 mb-4 select-none">
          &ldquo;
        </div>
        <p className="text-white/50 leading-relaxed mb-6">
          {testimonial.quote}
        </p>
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-sm font-semibold`}
          >
            {testimonial.avatar}
          </div>
          <div>
            <div className="font-semibold text-sm text-white">
              {testimonial.name}
            </div>
            <div className="text-xs text-white/30">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [headingVisible, setHeadingVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-[#09090b]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            headingVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-6">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              vehicle owners
            </span>
          </h2>
          <p className="text-lg text-white/40">
            See what our users have to say about VehicleOS.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
