import { format } from "date-fns";
import Link from "next/link";
import { formatToRupiah } from "@/lib/supabase/utils";

// This component receives data via the 'entries' prop
export default function RecentEntriesTable({ entries }) {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Recent Entries</h3>
        {/* The button is now a Link that goes to the new entry page */}
        <Link href="/entries/new" className="add-entry-btn">
          Add New Entry
        </Link>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th className="date-col">Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {/* We now map over the 'entries' prop */}
            {entries && entries.length > 0 ? (
              entries.map((entry) => {
                const description = entry.journal_entry_items
                  .map((item) => item.Description || entry.entry_type)
                  .join(",");
                const totalAmount = entry.journal_entry_items.reduce(
                  (sum, item) => sum + item.amount,
                  0
                );
                return (
                  <tr key={entry.id}>
                    <td>
                      {format(new Date(entry.posting_date), "yyyy-MM-dd")}
                    </td>
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
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  No recent entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
