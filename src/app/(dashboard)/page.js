import StatCard from "@/component/StatCard";
import RecentEntriesTable from "@/component/RecentEntriesTable";
import { supabase } from "@/lib/supabase/client";
import { formatToRupiah } from "@/lib/utils";

export default async function DashboardPage() {
  const { data: allEntries, error } = await supabase
    .from("journal_entries")
    .select("*, journal_entry_items(amount)")
    .order("posting_date", { ascending: false });

  if (error) {
    console.error("Error fetching entries:", error);
    return <p>Error loading data.</p>;
  }

  //calculation
  let totalIn = 0;
  let totalOut = 0;
  allEntries.forEach((entry) => {
    // Calculate the total amount for this specific entry
    const entryTotal = entry.journal_entry_items.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // Use the parent entry's 'cash_type' to sort the total
    if (entry.cash_type === "In") {
      totalIn += entryTotal;
    } else {
      totalOut += entryTotal;
    }
  });

  // FIX: Ensure netBalance is calculated correctly here
  const netBalance = totalIn + totalOut; // Note: totalOut is already negative if amounts are stored correctly
  const entriesCount = allEntries.length;
  const netBalancecolor = netBalance > 0 ? "text-green-500" : "text-red-500";
  const recentEntries = allEntries.slice(0, 5);

  return (
    <>
      <header className="page-header">
        <div className="page-header-title">
          <h1>Dashboard</h1>
          <p>Overview of your financial data.</p>
        </div>
        <div className="avatar">S</div>
      </header>
      <div className="stats-grid">
        <StatCard
          title="Total In"
          value={`+ ${formatToRupiah(totalIn)}`}
          valueColor="text-green-500"
        />
        <StatCard
          title="Total Out"
          value={`- ${formatToRupiah(Math.abs(totalOut))}`}
          valueColor="text-red-500"
        />
        <StatCard
          title="Net Balance"
          value={`${netBalance < 0 ? "- " : ""}${formatToRupiah(
            Math.abs(netBalance)
          )}`}
          valueColor={netBalancecolor}
        />
        <StatCard title="Total Entries" value={entriesCount} />
      </div>
      <RecentEntriesTable entries={recentEntries} />
    </>
  );
}
