// app/(dashboard)/page.js
import StatCard from "@/component/StatCard";
import RecentEntriesTable from "@/component/RecentEntriesTable";
import DashboardChart from "@/component/DashboardChart";
import { format } from "date-fns";
import { createSupabaseServerClient } from "@/lib/supabase/utils";
import { cookies } from "next/headers";
import { formatToRupiah } from "@/lib/supabase/utils";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  const { data: allEntries, error } = await supabase
    .from("journal_entries")
    .select("*, journal_entry_items(amount)")
    .order("posting_date", { ascending: false });

  if (error) {
    console.error("Error fetching entries:", error);
    return <p>Error loading data.</p>;
  }

  // --- Calculations ---
  let totalIn = 0;
  let totalOut = 0;

  allEntries.forEach((entry) => {
    const entryTotal = entry.journal_entry_items.reduce(
      (sum, item) => sum + Math.abs(item.amount),
      0
    );

    if (entry.cash_type === "In") {
      totalIn += entryTotal;
    } else {
      totalOut += entryTotal;
    }
  });

  const netBalance = totalIn - totalOut;
  const entriesCount = allEntries.length;
  const netBalanceColor = netBalance < 0 ? "text-red-500" : "text-green-500";

  // --- Chart Data Processing ---
  const monthlyData = {};
  allEntries.forEach((entry) => {
    const month = format(new Date(entry.posting_date), "MMM yyyy");
    const entryTotal = entry.journal_entry_items.reduce(
      (sum, item) => sum + Math.abs(item.amount),
      0
    );
    if (!monthlyData[month]) {
      monthlyData[month] = { name: month, In: 0, Out: 0 };
    }
    if (entry.cash_type === "In") {
      monthlyData[month].In += entryTotal;
    } else {
      monthlyData[month].Out += entryTotal;
    }
  });
  const chartData = Object.values(monthlyData).sort(
    (a, b) => new Date(a.name) - new Date(b.name)
  );

  const recentEntries = allEntries.slice(0, 5);

  return (
    <>
      <header className="page-header">
        <div className="page-header-title">
          <h1>Dashboard</h1>
          <p>Overview of your financial data.</p>
        </div>
        <div className="avatar">A</div>
      </header>
      <div className="stats-grid">
        <StatCard
          title="Total In"
          value={`+ ${formatToRupiah(totalIn)}`}
          valueColor="text-green-500"
        />
        <StatCard
          title="Total Out"
          value={`- ${formatToRupiah(totalOut)}`}
          valueColor="text-red-500"
        />
        <StatCard
          title="Net Balance"
          value={formatToRupiah(netBalance)}
          valueColor={netBalanceColor}
        />
        <StatCard title="Total Entries" value={entriesCount} />
      </div>
      <DashboardChart data={chartData} />
      <RecentEntriesTable entries={recentEntries} />
    </>
  );
}
