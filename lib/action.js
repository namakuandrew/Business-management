"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./supabase/client";

export async function createJournalEntry(formData) {
  const postingDateValue = formData.get("posting_date");
  const entryTypeValue = formData.get("entry_type");

  const mainEntry = {
    posting_date: postingDateValue
      ? postingDateValue
      : new Date().toISOString().substring(0, 10),
    entry_type: entryTypeValue || "Journal Entry",
    company: formData.get("company"),
    cash_type: formData.get("cash type"),
    reference_no: formData.get("reference_no"),
  };

  const itemsData = JSON.parse(formData.get("items"));

  const { data: journalEntry, error: mainError } = await supabase
    .from("journal_entries")
    .insert([mainEntry])
    .select()
    .single();

  if (mainError) {
    console.error("error creating journal entry:", mainError);
    return { error: mainError.message };
  }

  const itemToInsert = itemsData.map((item) => ({
    journal_entry_id: journalEntry.id,
    account: item.account,
    description: item.description,
    amount: parseFloat(item.amount) || 0,
  }));

  const { error: itemsError } = await supabase
    .from("journal_entry_items")
    .insert(itemToInsert);

  if (itemsError) {
    console.error("Error creating journal entry items:", itemsError);
    return { error: itemsError.message };
  }

  const { error } = await supabase.from("entries").insert([entry]);
  if (error) {
    console.error("Error creating entry:", error);
    return;
  }

  revalidatePath("/");
  revalidatePath("/entries");
  return { success: "Journal entry created successfully!" };
}
