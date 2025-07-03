import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import Link from "next/link";
import DeleteEntryButton from "@/component/DeleteEntryButton";

const formatToRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export default async function EntriesPage() {
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
              <th>Entry Type</th>
              <th>Reference</th>
              <th>Company</th>
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
                  <td>{description}</td>
                  <td
                    className={
                      totalAmount >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {totalAmount >= 0 ? "+" : ""}
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
                  {/* New Actions Cell */}
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
