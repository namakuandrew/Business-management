import StatCard from "@/component/StatCard";
import RecentEntriesTable from "@/component/RecentEntriesTable";

export default function DashboardPage() {
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
          value="$57,465.90"
          details="Last 30 days"
          valueColor="text-green-500"
        />
        <StatCard
          title="Total Out"
          value="$12,234.01"
          details="Last 30 days"
          valueColor="text-red-500"
        />
        <StatCard
          title="Net Balance"
          value="$45,231.89"
          details="As of today"
        />
        <StatCard title="Total Entries" value="1,254" details="Last 30 days" />
      </div>
      <RecentEntriesTable />
    </>
  );
}
