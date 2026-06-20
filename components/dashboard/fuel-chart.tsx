"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <Card className="col-span-full md:col-span-1 border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle>Fuel Expenses</CardTitle>
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
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Bar
                dataKey="total"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
