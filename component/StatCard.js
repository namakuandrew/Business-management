export default function StatCard({ title, value, details, valueColor }) {
  return (
    <div className="stat-card">
      <h3 className="stat-card-title">{title}</h3>
      <p className={`stat-card-value ${valueColor}`}>{value}</p>
      <p className="stat-card-details">{details}</p>
    </div>
  );
}
