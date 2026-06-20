import { db } from "@/db";
import { services, vehicles } from "@/db/schema";
import { getCurrentUser } from "@/actions/users";
import { eq, inArray, desc } from "drizzle-orm";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    const userVehicles = await db
      .select({ id: vehicles.id, brand: vehicles.brand, model: vehicles.model, vehicleNumber: vehicles.vehicleNumber })
      .from(vehicles)
      .where(eq(vehicles.userId, user.id));

    if (!userVehicles.length) {
      return new Response("No vehicles found", { status: 404 });
    }

    const vehicleIds = userVehicles.map((v) => v.id);
    const vehicleMap = userVehicles.reduce((acc, v) => {
      acc[v.id] = `${v.brand} ${v.model} (${v.vehicleNumber})`;
      return acc;
    }, {} as Record<string, string>);

    const allServices = await db
      .select()
      .from(services)
      .where(inArray(services.vehicleId, vehicleIds))
      .orderBy(desc(services.serviceDate));

    // Generate CSV
    const header = "Vehicle,Date,Type,Center,Cost,Notes\n";
    const rows = allServices.map(s => {
      const vehicleName = `"${vehicleMap[s.vehicleId]}"`;
      const type = `"${s.serviceType}"`;
      const center = `"${s.serviceCenter || ""}"`;
      const notes = `"${(s.notes || "").replace(/"/g, '""')}"`; // Escape quotes
      return `${vehicleName},${s.serviceDate},${type},${center},${s.cost},${notes}`;
    }).join("\n");

    const csv = header + rows;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="services-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new Response("Error generating CSV", { status: 500 });
  }
}
