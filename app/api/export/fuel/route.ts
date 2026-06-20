import { db } from "@/db";
import { fuelLogs, vehicles } from "@/db/schema";
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

    const logs = await db
      .select()
      .from(fuelLogs)
      .where(inArray(fuelLogs.vehicleId, vehicleIds))
      .orderBy(desc(fuelLogs.date));

    // Generate CSV
    const header = "Vehicle,Date,Odometer,Litres,Amount\n";
    const rows = logs.map(log => {
      const vehicleName = `"${vehicleMap[log.vehicleId]}"`;
      return `${vehicleName},${log.date},${log.odometer},${log.litres},${log.amount}`;
    }).join("\n");

    const csv = header + rows;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="fuel-logs-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new Response("Error generating CSV", { status: 500 });
  }
}
