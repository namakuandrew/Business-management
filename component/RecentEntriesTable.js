import { format } from "date-fns";
import Link from "next/link";

const formatToRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

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
              <th>Description</th>
              <th>Amount</th>
              <th className="date-col">Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {/* We now map over the 'entries' prop */}
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
                  {/* We format the date from the database */}
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
              // This is shown if there are no entries
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
  );
}
