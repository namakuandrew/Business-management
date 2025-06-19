import NewEntryForm from "@/component/NewEntryForm";

export default function NewEntryPage() {
  return (
    <div>
      <header className="page-header">
        <div className="page-header-title">
          <h1>New Journal Entry</h1>
          <p>Create a new entry to record a transaction.</p>
        </div>
      </header>
      <NewEntryForm />
    </div>
  );
}
