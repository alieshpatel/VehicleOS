import { Wrench, Fuel, FileText, Stethoscope, Bell, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Maintenance Tracking",
    description: "Keep a detailed log of all services, repairs, and part replacements with cost tracking.",
    icon: Wrench,
  },
  {
    title: "Fuel Logs & Efficiency",
    description: "Log every fill-up to automatically calculate your vehicle's real-world mileage and running costs.",
    icon: Fuel,
  },
  {
    title: "Smart Reminders",
    description: "Never miss an insurance renewal, PUC deadline, or scheduled service with automated alerts.",
    icon: Bell,
  },
  {
    title: "AI Diagnostics",
    description: "Describe symptoms and our Gemini-powered AI will suggest possible causes and estimated costs.",
    icon: Stethoscope,
  },
  {
    title: "Digital Glovebox",
    description: "Securely store photos or PDFs of your RC book, insurance policies, and service bills.",
    icon: FileText,
  },
  {
    title: "Cost Analytics",
    description: "Visualize your monthly spending on fuel and maintenance with interactive charts.",
    icon: BarChart3,
  },
];

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to manage your garage
          </h2>
          <p className="text-lg text-muted-foreground">
            VehicleOS replaces your messy spreadsheets and scattered paper bills with a clean, organized dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-none shadow-md bg-background hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
