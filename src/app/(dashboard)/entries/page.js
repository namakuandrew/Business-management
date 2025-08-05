// app/(dashboard)/entries/page.js
import { createSupabaseServerClient } from "@/lib/supabase/utils"; // Correct import
import { cookies } from "next/headers"; // Needed to create the server client
import { format } from "date-fns";
import Link from "next/link";
import DeleteEntryButton from "@/component/DeleteEntryButton";
import { formatToRupiah } from "@/lib/supabase/utils";

export default async function EntriesPage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore); // Correct client creation

  const { data: entries, error } = await supabase
    .from("journal_entries")
    .select("*, journal_entry_items(description, amount)")
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
              <th>Company</th>
              <th>Description</th>
              <th>Total Amount</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const description = entry.journal_entry_items
                .map((item) => item.description || entry.entry_type)
                .join(", ");
              const totalAmount = entry.journal_entry_items.reduce(
                (sum, item) => sum + item.amount,
                0
              );

              return (
                <tr key={entry.id}>
                  <td>{format(new Date(entry.posting_date), "yyyy-MM-dd")}</td>
                  <td>{entry.company || "-"}</td>
                  <td>{description}</td>
                  <td
                    className={
                      totalAmount >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {totalAmount >= 0 ? "+" : "- "}
                    {formatToRupiah(Math.abs(totalAmount))}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        entry.cash_type === "In" ? "badge-in" : "badge-out"
                      }`}
                    >
                      {entry.cash_type || "N/A"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link
                      href={`/entries/${entry.id}/edit`}
                      className="edit-btn"
                    >
                      Edit
                    </Link>
                    <DeleteEntryButton entryId={entry.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
