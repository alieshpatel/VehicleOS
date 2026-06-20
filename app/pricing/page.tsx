import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">Start for free, upgrade when you need more.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for individuals with 1-2 vehicles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">₹0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <ul className="space-y-2 mt-6">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 2 vehicles</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic maintenance logs</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 5 Document uploads</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild><Link href="/sign-up">Get Started</Link></Button>
            </CardFooter>
          </Card>
          
          <Card className="border-primary shadow-lg relative">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For car enthusiasts and families.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">₹199<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <ul className="space-y-2 mt-6">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited vehicles</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> AI Diagnostics</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited documents</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Export to CSV</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild><Link href="/sign-up">Upgrade to Pro</Link></Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
