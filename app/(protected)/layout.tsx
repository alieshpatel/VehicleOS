import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-border/50 bg-gradient-to-b from-background to-muted/10 md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col bg-background">
        <Topbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
