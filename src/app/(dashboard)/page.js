import StatCard from "@/component/StatCard";
import RecentEntriesTable from "@/component/RecentEntriesTable";
import { supabase } from "@/lib/supabase/client";

const formatToRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default async function DashboardPage() {
  const { data: items, error: itemsError } = await supabase
    .from("journal_entry_items")
    .select("*");
  const { count: entriesCount, error: countError } = await supabase
    .from("journal_entries")
    .select("*", { count: "exact", head: true });

  const { data: recentEntries, error: recentError } = await supabase
    .from("journal_entries")
    .select("*, journal_entry_items(description, amount)')")
    .order("posting_date", { ascending: false })
    .limit(5);

  if (itemsError || countError || recentError) {
    console.error(
      "Error fetching dashboard data:",
      itemsError || countError || recentError
    );
    return <p>Error loading data.</p>;
  }

  const totalIn = items
    .filter((item) => item.amount > 0)
    .reduce((acc, item) => acc + item.amount, 0);
  const totalOut = items
    .filter((item) => item.amount < 0)
    .reduce((acc, item) => acc + item.amount, 0);
  const netBalance = totalIn + totalOut;

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
          value={formatToRupiah(totalIn)}
          valueColor="text-green-500"
        />
        <StatCard
          title="Total Out"
          value={formatToRupiah(Math.abs(totalOut))}
          valueColor="text-red-500"
        />
        <StatCard title="Net Balance" value={formatToRupiah(netBalance)} />
        <StatCard title="Total Entries" value={entriesCount} />
      </div>
      <RecentEntriesTable entries={recentEntries} />
    </>
  );
}
