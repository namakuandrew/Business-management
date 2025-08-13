import { createSupabaseServerClient } from "@/lib/supabase/utils";
import { cookies } from "next/headers";
import EditJournalEntryForm from "@/component/EditJournalEntryForm";
import { notfound } from "next/navigation";

export default async function EditEntryPage({ params }) {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  const { data: entry, error: entryError } = await supabase
    .from("journal_entries")
    .select("*, journal_entry_items(*)")
    .eq("id", id)
    .single();

  const { data: companies, error: companiesError } = await supabase
    .from("contacts")
    .select("id, name, reference_prefix");

  if (entryError || !entry) {
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
      <EditJournalEntryForm entry={entry} companies={companies || []} />
    </>
  );
}
