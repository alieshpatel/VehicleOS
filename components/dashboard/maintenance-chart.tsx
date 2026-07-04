"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wrench } from "lucide-react";

interface MaintenanceChartProps {
  data: { month: string; total: number }[];
}

export function MaintenanceChart({ data }: MaintenanceChartProps) {
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
      <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 to-amber-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Wrench className="h-3.5 w-3.5 text-white" />
          </div>
          Maintenance Costs
        </CardTitle>
        <CardDescription>Monthly service and repair expenses.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {formattedData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            No maintenance data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData}>
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
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                  boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Maintenance"]}
              />
              <defs>
                <linearGradient id="maintenanceGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="total"
                stroke="url(#maintenanceGradient)"
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, fill: "hsl(var(--background))", stroke: "#f97316" }}
                activeDot={{ r: 7, strokeWidth: 0, fill: "#f97316" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
