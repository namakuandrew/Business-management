import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import Link from "next/link";

export default async function EntriesPage() {
  const { data: entries, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("posting_date", { ascending: false });

  if (error) return <p>Could not load entries.</p>;

  return (
    <div>
      <header className="page-header">
        <div className="page-header-title">
          <h1>Journal Entries</h1>
          <p>A complete list of all recorded entries.</p>
        </div>
        <Link href="/entries/new" className="add-entry-btn">
          New Journal Entry
        </Link>
      </header>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Entry Type</th>
              <th>Reference</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{format(new Date(entry.posting_date), "yyyy-MM-dd")}</td>
                <td>{entry.entry_type}</td>
                <td>{entry.reference_no || "-"}</td>
                <td>{entry.company}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
