"use client";

import { useState, useEffect } from "react";
import { runDiagnosis, getDiagnosisHistory } from "@/actions/ai-diagnosis";
import { getVehicles } from "@/actions/vehicles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Stethoscope, AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AiDiagnosisPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    async function loadData() {
      const v = await getVehicles();
      setVehicles(v);
      const h = await getDiagnosisHistory();
      setHistory(h);
    }
    loadData();
  }, []);

  async function handleDiagnose() {
    if (!selectedVehicle) {
      toast.error("Please select a vehicle");
      return;
    }
    if (!symptoms || symptoms.length < 10) {
      toast.error("Please describe the symptoms in more detail");
      return;
    }

    setIsPending(true);
    try {
      const res = await runDiagnosis(selectedVehicle, symptoms);
      setResult(res);
      // Refresh history
      const h = await getDiagnosisHistory();
      setHistory(h);
      toast.success("Diagnosis complete!");
    } catch (err: any) {
      toast.error(err.message || "Failed to run diagnosis");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Diagnosis</h1>
        <p className="text-muted-foreground">
          Describe the issue with your vehicle and let our AI assistant suggest possible causes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                New Diagnosis
              </CardTitle>
              <CardDescription>
                Provide detailed symptoms like strange noises, dashboard lights, or performance issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Vehicle</label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.vehicleNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Symptoms</label>
                <Textarea
                  placeholder="e.g. There is a squeaking noise when I apply the brakes, and the steering wheel vibrates slightly..."
                  className="min-h-[120px]"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleDiagnose} 
                disabled={isPending || !selectedVehicle || !symptoms}
                className="w-full"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Run AI Diagnosis"
                )}
              </Button>
            </CardFooter>
          </Card>

          {result && (
            <Card className="border-primary/50 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Diagnosis Results</CardTitle>
                  <Badge 
                    variant={
                      result.urgency === "High" ? "destructive" : 
                      result.urgency === "Medium" ? "default" : "secondary"
                    }
                  >
                    {result.urgency} Urgency
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Possible Causes</h4>
                  <ul className="space-y-2">
                    {result.possibleCauses.map((cause: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-muted p-3 rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Estimated Cost</h4>
                    <p className="text-lg font-bold">
                      ₹{result.estimatedCostMin.toLocaleString()} - ₹{result.estimatedCostMax.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                      <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                      Estimate only, generated by AI — not a quote. Actual cost depends on your location, garage, and vehicle condition. Confirm with a mechanic before paying.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Recommendation</h4>
                  <p className="text-sm">{result.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Diagnosis History</h3>
          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
              No previous AI diagnoses found.
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
              {history.map((h) => {
                const vehicle = vehicles.find((v) => v.id === h.vehicleId);
                return (
                  <Card key={h.id} className="text-sm">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">
                          {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Unknown Vehicle"}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs font-normal">
                          {format(new Date(h.createdAt), "MMM d, yyyy")}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-1">
                        "{h.symptoms}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center gap-2 mt-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {h.diagnosis.possibleCauses[0]}
                          {h.diagnosis.possibleCauses.length > 1 ? ` (+${h.diagnosis.possibleCauses.length - 1} more)` : ""}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
