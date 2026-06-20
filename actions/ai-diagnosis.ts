"use server";

import { db } from "@/db";
import { aiReports, vehicles } from "@/db/schema";
import { getCurrentUser } from "@/actions/users";
import { eq, and, desc, inArray } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type DiagnosisResult = {
  possibleCauses: string[];
  urgency: "Low" | "Medium" | "High";
  estimatedCostMin: number;
  estimatedCostMax: number;
  recommendation: string;
};

export async function runDiagnosis(
  vehicleId: string,
  symptoms: string
): Promise<DiagnosisResult> {
  const user = await getCurrentUser();
  const vehicle = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)))
    .limit(1);
  if (!vehicle.length) throw new Error("Vehicle not found");

  const v = vehicle[0];
  const prompt = `You are an experienced automotive mechanic. A vehicle owner describes the following symptoms for their ${v.year} ${v.brand} ${v.model} (${v.fuelType} fuel type, odometer: ${v.mileage} km):

"${symptoms}"

Provide a diagnosis in JSON format with these exact fields:
- possibleCauses: array of strings listing the most likely causes (2-5 items)
- urgency: one of "Low", "Medium", or "High"
- estimatedCostMin: minimum estimated repair cost in INR (Indian Rupees) as a number
- estimatedCostMax: maximum estimated repair cost in INR (Indian Rupees) as a number  
- recommendation: a short actionable suggestion (1-2 sentences)

Respond ONLY with valid JSON, no markdown formatting or code blocks.`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Parse the JSON response
  let diagnosis: DiagnosisResult;
  try {
    // Try to extract JSON from the response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    diagnosis = JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch {
    diagnosis = {
      possibleCauses: ["Unable to parse AI response"],
      urgency: "Medium",
      estimatedCostMin: 0,
      estimatedCostMax: 0,
      recommendation: "Please consult a mechanic for an in-person diagnosis.",
    };
  }

  // Save to database
  await db.insert(aiReports).values({
    vehicleId,
    symptoms,
    diagnosis,
  });

  revalidatePath("/ai-diagnosis");
  revalidatePath(`/vehicles/${vehicleId}`);
  return diagnosis;
}

export async function getDiagnosisHistory(vehicleId?: string) {
  const user = await getCurrentUser();
  const userVehicles = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.userId, user.id));

  if (!userVehicles.length) return [];

  const vehicleIds = userVehicles.map((v) => v.id);

  if (vehicleId) {
    if (!vehicleIds.includes(vehicleId)) return [];
    return db
      .select()
      .from(aiReports)
      .where(eq(aiReports.vehicleId, vehicleId))
      .orderBy(desc(aiReports.createdAt));
  }

  return db
    .select()
    .from(aiReports)
    .where(inArray(aiReports.vehicleId, vehicleIds))
    .orderBy(desc(aiReports.createdAt));
}
