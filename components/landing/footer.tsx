import Link from "next/link";
import { Car } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-[#07070a]">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                  <Car className="h-4.5 w-4.5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                VehicleOS
              </span>
            </Link>
            <p className="text-sm text-white/30 max-w-xs leading-relaxed">
              The intelligent operating system for tracking and maintaining your
              vehicles. Smarter ownership starts here.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Product",
              links: [
                { href: "/features", label: "Features" },
                { href: "/pricing", label: "Pricing" },
                { href: "/changelog", label: "Changelog" },
              ],
            },
            {
              title: "Company",
              links: [
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
              ],
            },
            {
              title: "Connect",
              links: [
                { href: "#", label: "Twitter" },
                { href: "#", label: "GitHub" },
                { href: "#", label: "Discord" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-white/20 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="text-white/40 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white/40 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/20">
          <p>© {new Date().getFullYear()} VehicleOS. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs">
            <span>Built with</span>
            <span className="text-red-400 animate-pulse">♥</span>
            <span>for vehicle owners everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
