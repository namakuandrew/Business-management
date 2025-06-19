import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import Link from "next/link";

export default async function EntriesPage() {
  // Fetch all entries from the database, ordered by the most recent first
  const { data: entries, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching entries:", error);
    return <p>Error loading data. Please check your Supabase connection.</p>;
  }

  return (
    <div>
      <header className="page-header">
        <div className="page-header-title">
          <h1>Journal Entries</h1>
          <p>A complete list of all recorded entries.</p>
        </div>
        <Link href="/entries/new" className="add-entry-btn">
          Add New Entry
        </Link>
      </header>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th className="date-col">Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {entries && entries.length > 0 ? (
                entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.description}</td>
                    <td
                      className={
                        entry.type === "In" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {entry.amount > 0 ? "+" : ""}$
                      {Math.abs(entry.amount).toFixed(2)}
                    </td>
                    <td className="date-col">
                      {format(new Date(entry.created_at), "yyyy-MM-dd")}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          entry.type === "In" ? "badge-in" : "badge-out"
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
