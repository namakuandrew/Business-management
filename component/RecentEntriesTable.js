export default function RecentEntriesTable() {
  const entries = [
    {
      id: 1,
      description: "Office Supplies Purchase",
      amount: -250.0,
      date: "2024-06-12",
      type: "Out",
    },
    {
      id: 2,
      description: "Client Payment - Project Alpha",
      amount: 5000.0,
      date: "2024-06-11",
      type: "In",
    },
    {
      id: 3,
      description: "Monthly Software Subscription",
      amount: -49.99,
      date: "2024-06-10",
      type: "Out",
    },
  ];

  return (
    // Container now matches the style of the StatCards
    <div className="table-container">
      <div className="table-header">
        <h3>Recent Entries</h3>
        {/* Button style updated to match the image */}
        <button className="add-entry-btn">Add New Entry</button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.description}</td>
                <td
                  className={
                    entry.type === "In" ? "text-green-500" : "text-red-500"
                  }
                >
                  {entry.type === "In" ? "+" : "-"}$
                  {Math.abs(entry.amount).toFixed(2)}
                </td>
                <td className="date-col">{entry.date}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
