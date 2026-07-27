"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export function WaitDistributionChart({ data }: { data: { wait: number, count: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No statistics data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
        <XAxis 
          dataKey="wait" 
          stroke="#9ca3af" 
          tick={{ fill: '#9ca3af' }}
          label={{ value: 'Phases Waiting', position: 'insideBottom', offset: -10, fill: '#9ca3af' }}
        />
        <YAxis 
          stroke="#9ca3af" 
          tick={{ fill: '#9ca3af' }}
          label={{ value: 'Characters', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          allowDecimals={false}
        />
        <Tooltip 
          cursor={{ fill: '#ffffff1a' }}
          contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
          formatter={(value: any) => [`${value} Characters`, 'Count']}
          labelFormatter={(label: any) => `Waiting ${label} phases`}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
