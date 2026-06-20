import { Navbar } from "@/components/landing/navbar";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className="flex-1 pt-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Deep Dive into Features</h1>
        </div>
        <Features />
      </main>
      <Footer />
    </div>
  );
}
