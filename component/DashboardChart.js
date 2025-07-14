"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatToRupiah } from "@/lib/utils";

export default function DashboardChart({ data }) {
  //custome tooltip
  const Customtooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="intro-in">{`in ${formatToRupiah(payload[0].value)}`}</p>
          <p className="intro-out">{`out ${formatToRupiah(
            payload[1].value
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Monthly Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray={"3 3"} stroke="#e5e7eb" />
          <XAxis dataKey={"name"} stroke="#6b7280" />
          <YAxis
            stroke="#6b7280"
            tickFormatter={(value) => formatToRupiah(value)}
          />
          <Tooltip content={<Customtooltip />} cursor={{ fill: "#f3f4f6" }} />
          <Legend />
          <Bar
            dataKey={"in"}
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
          <Bar
            dataKey={"out"}
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
