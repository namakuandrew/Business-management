"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatToRupiah } from "@/lib/supabase/utils";
import { format, getYear, getMonth } from "date-fns";

export default function DashboardChart({ data }) {
  const [chartType, setChartType] = useState("inOut");

  const currentYear = getYear(new Date());
  const currentMonth = getMonth(new Date());

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const { years, filteredData } = useMemo(() => {
    if (!data || data.length === 0) {
      return { years: [], filteredData: [] };
    }

    // Get a unique list of years from the data
    const availableYears = [
      ...new Set(data.map((d) => getYear(new Date(d.name)))),
    ];

    // Filter the data based on the selected year and month
    const filtered = data.filter((d) => {
      const date = new Date(d.name);
      return getYear(date) === selectedYear && getMonth(date) === selectedMonth;
    });

    return { years: availableYears, filteredData: filtered };
  }, [data, selectedYear, selectedMonth]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  //custome tooltip
  const Customtooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {chartType === "inOut" ? (
            <>
              <p className="intro in">{`In: ${formatToRupiah(
                payload[0].value
              )}`}</p>
              <p className="intro out">{`Out: ${formatToRupiah(
                payload[1].value
              )}`}</p>
            </>
          ) : (
            <p className={`intro ${payload[0].value >= 0 ? "in" : "out"}`}>
              {`Net: ${formatToRupiah(payload[0].value)}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Monthly Overview</h3>
        <div className="chart-filters">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="chart-toggle">
          <button
            onClick={() => setChartType("inOut")}
            className={chartType === "inOut" ? "active" : ""}
          >
            In vs Out
          </button>
          <button
            onClick={() => setChartType("net")}
            className={chartType === "net" ? "active" : ""}
          >
            Net Balance
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={filteredData}
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
          {chartType === "inOut" ? (
            <>
              <Bar
                dataKey="In"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="Out"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </>
          ) : (
            <Bar dataKey="Net" radius={[4, 4, 0, 0]} barSize={30}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.Net >= 0 ? "#22c55e" : "#ef4444"}
                />
              ))}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
