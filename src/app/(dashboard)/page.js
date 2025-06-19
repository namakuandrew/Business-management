import StatCard from "@/component/StatCard";
import RecentEntriesTable from "@/component/RecentEntriesTable";
import { supabase } from "@/lib/supabase/client";

const formatToRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default async function DashboardPage() {
  const { data: entries, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching entries:", error);
    return <p>Error loading data. Please check your Supabase connection.</p>;
  }

  const totalIn = entries
    .filter((entry) => entry.type === "In")
    .reduce((acc, entry) => acc + entry.amount, 0);

  const totalOut = entries
    .filter((entry) => entry.type === "Out")
    .reduce((acc, entry) => acc + entry.amount, 0);

  const netBalance = totalIn + totalOut;
  const totalEntries = entries.length;

  return (
    <>
      <header className="page-header">
        <div className="page-header-title">
          <h1> Main Dashboard</h1>
          <p>Overview of all of your financial data.</p>
        </div>
        <div className="avatar">A</div>
      </header>
      <div className="stats-grid">
        <StatCard
          title="Total In"
          value={formatToRupiah(totalIn)}
          details="Last 30 days"
          valueColor="text-green-500"
        />
        <StatCard
          title="Total Out"
          value={formatToRupiah(Math.abs(totalOut))}
          details="Last 30 days"
          valueColor="text-red-500"
        />
        <StatCard
          title="Net Balance"
          value={formatToRupiah(netBalance)}
          details="As of today"
        />
        <StatCard
          title="Total Entries"
          value={totalEntries.toLocaleString("id-ID")}
          details="All time"
        />
      </div>
      <RecentEntriesTable entries={entries} />
    </>
  );
}
