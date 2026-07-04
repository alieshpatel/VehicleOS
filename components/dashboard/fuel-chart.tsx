"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Fuel } from "lucide-react";

interface FuelChartProps {
  data: { month: string; total: number }[];
}

export function FuelChart({ data }: FuelChartProps) {
  // Format data for display: convert YYYY-MM to MMM
  const formattedData = data.map((d) => {
    const [year, month] = d.month.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      name: date.toLocaleString("default", { month: "short" }),
      total: d.total,
    };
  });

  return (
    <Card className="col-span-full md:col-span-1 border-border/50 shadow-sm overflow-hidden">
      {/* Top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Fuel className="h-3.5 w-3.5 text-white" />
          </div>
          Fuel Expenses
        </CardTitle>
        <CardDescription>Monthly fuel spending across all vehicles.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {formattedData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            No fuel data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedData}>
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                  boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Fuel"]}
              />
              <Bar
                dataKey="total"
                fill="url(#fuelGradient)"
                radius={[6, 6, 0, 0]}
              />
              <defs>
                <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
