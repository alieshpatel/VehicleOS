"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface CostComparisonChartProps {
  data: { name: string; maintenance: number; fuel: number; total: number }[];
}

export function CostComparisonChart({ data }: CostComparisonChartProps) {
  return (
    <Card className="col-span-full border-border/50 shadow-sm overflow-hidden">
      <div className="h-0.5 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <BarChart3 className="h-3.5 w-3.5 text-white" />
          </div>
          Vehicle Cost Comparison
        </CardTitle>
        <CardDescription>Compare total lifetime maintenance and fuel costs across your garage.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            No cost data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} layout="vertical" margin={{ left: 50, right: 20 }}>
              <XAxis type="number" tickFormatter={(value) => `₹${value}`} />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                  boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: any) => `₹${Number(value || 0).toLocaleString()}`}
              />
              <Legend />
              <defs>
                <linearGradient id="fuelCostGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="maintCostGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <Bar dataKey="fuel" name="Fuel Cost" stackId="a" fill="url(#fuelCostGrad)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="maintenance" name="Maintenance Cost" stackId="a" fill="url(#maintCostGrad)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
