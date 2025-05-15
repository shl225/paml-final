"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

const data = [
  { price: 9.99, revenue: 15000, units: 1500 },
  { price: 14.99, revenue: 22000, units: 1467 },
  { price: 19.99, revenue: 28000, units: 1400 },
  { price: 24.99, revenue: 25000, units: 1000 },
  { price: 29.99, revenue: 21000, units: 700 },
  { price: 34.99, revenue: 17000, units: 486 },
  { price: 39.99, revenue: 12000, units: 300 },
]

export function RecommendationChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="price" label={{ value: "Price ($)", position: "insideBottom", offset: -5 }} />
        <YAxis yAxisId="left" label={{ value: "Revenue ($)", angle: -90, position: "insideLeft" }} />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Units Sold", angle: 90, position: "insideRight" }}
        />
        <Tooltip
          formatter={(value, name) => [
            name === "revenue" ? `$${value}` : value,
            name === "revenue" ? "Revenue" : "Units Sold",
          ]}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorRevenue)"
          yAxisId="left"
          name="Revenue"
        />
        <Area
          type="monotone"
          dataKey="units"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorUnits)"
          yAxisId="right"
          name="Units Sold"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
