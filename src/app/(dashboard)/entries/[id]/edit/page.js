import { supabase } from "@/lib/supabase/client";
import EditJournalEntryForm from "@/component/EditJournalEntryForm";
import { notfound } from "next/navigation";

export default async function EditEntryPage({ params }) {
  const { id } = params;

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .select("*, journal_entry_items(*)")
    .eq("id", id)
    .single();

  if (error || !entry) {
    notfound();
  }

  return (
    <>
      <header className="page-header">
        <div className="page-header-title">
          <h1>Edit Journal Entry</h1>
          <p>Update isi didalam journal</p>
        </div>
      </header>
      <EditJournalEntryForm entry={entry} />
    </>
  );
}
