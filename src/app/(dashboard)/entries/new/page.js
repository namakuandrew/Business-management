import NewEntryForm from "@/component/NewEntryForm";
import { createSupabaseServerClient } from "@/lib/supabase/utils";
import { cookies } from "next/headers";

export default async function NewEntryPage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const { data: companies } = await supabase
    .from("contacts")
    .select("id, name, reference_prefix");

  return (
    <div>
      <header className="page-header">
        <div className="page-header-title">
          <h1>New Journal Entry</h1>
          <p>Create a new entry to record a transaction.</p>
        </div>
      </header>
      <NewEntryForm companies={companies || []} />
    </div>
  );
}
