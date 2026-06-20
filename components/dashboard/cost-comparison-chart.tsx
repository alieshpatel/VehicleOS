"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CostComparisonChartProps {
  data: { name: string; maintenance: number; fuel: number; total: number }[];
}

export function CostComparisonChart({ data }: CostComparisonChartProps) {
  return (
    <Card className="col-span-full border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle>Vehicle Cost Comparison</CardTitle>
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
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                formatter={(value: number) => `₹${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="fuel" name="Fuel Cost" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="maintenance" name="Maintenance Cost" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
