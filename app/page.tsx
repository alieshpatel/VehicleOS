import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { ConnectCar } from "@/components/landing/connect-car";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] bg-[#09090b]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <ConnectCar />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
