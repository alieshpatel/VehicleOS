import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-6">About VehicleOS</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We are on a mission to simplify vehicle ownership. No more forgotten renewals, unexpected expensive breakdowns, or messy gloveboxes.
        </p>
      </main>
      <Footer />
    </div>
  );
}
