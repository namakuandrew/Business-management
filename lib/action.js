"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./supabase/client";

export async function createJournalEntry(formData) {
  try {
    const postingDateValue = formData.get("posting_date");
    const entryTypeValue = formData.get("entry_type");

    const mainEntry = {
      posting_date: postingDateValue
        ? postingDateValue
        : new Date().toISOString().substring(0, 10),
      entry_type: entryTypeValue || "Journal Entry",
      company: formData.get("company"),
      cash_type: formData.get("cash_type"),
      reference_no: formData.get("reference_no"),
    };

    // This line can cause an error if 'items' is not valid JSON
    const itemsData = JSON.parse(formData.get("items"));

    // Step 1: Insert the main journal entry.
    const { data: journalEntry, error: mainError } = await supabase
      .from("journal_entries")
      .insert(mainEntry)
      .select()
      .single();

    if (mainError) {
      console.error("Error creating journal entry:", mainError);
      return { error: `Database Error: ${mainError.message}` };
    }

    // Step 2: Prepare line items.
    const itemsToInsert = itemsData.map((item) => ({
      journal_entry_id: journalEntry.id,
      account: item.account,
      description: item.description,
      amount: parseFloat(item.amount) || 0,
    }));

    // Step 3: Insert line items.
    const { error: itemsError } = await supabase
      .from("journal_entry_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Error creating journal entry items:", itemsError);
      return { error: `Database Error: ${itemsError.message}` };
    }

    revalidatePath("/");
    revalidatePath("/entries");

    return { success: "Journal entry created successfully!" };
  } catch (e) {
    // Catch any other unexpected errors (like the JSON.parse failing)
    console.error("An unexpected error occurred:", e);
    return {
      error: "An unexpected error occurred. Please check the form data.",
    };
  }
}

export async function deletejournalEntry(id) {
  if (!entryId) {
    return { error: "Entry ID is required." };
  }
  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", entryId);

  if (error) {
    console.log("error deleting journal entry:", error);
    return { error: "Database Error: Tidak bisa menghapus data." };
  }
}

export async function updateJournalEntry(entryId, formData) {
  if (!entryId) {
    return { error: "Entry ID diperlukan." };
  }
  const mainEntry = {
    posting_date: formData.get("posting_date"),
    entry_type: formData.get("entry_type"),
    company: formData.get("company"),
    cash_type: formData.get("cash_type"),
    reference_no: formData.get("reference_no"),
  };

  const { error: mainError } = await supabase
    .from("journal_entries")
    .update(mainEntry)
    .eq("id", entryId);

  if (mainError) {
    console.error("Error updating journal entry:", mainError);
    return { error: "Gagal untuk meng-update journal." };
  }

  const { error: deleteError } = await supabase
    .from("journal_entry_items")
    .delete()
    .eq("journal_entry_id", entryId);

  if (deleteError) {
    console.error("Error deleting old journal entry items:", deleteError);
    return { error: "Gagal meng-update item didalam journal." };
  }

  const itemsData = JSON.parse(formData.get("items"));
  const itemsToInsert = itemsData.map((item) => ({
    journal_entry_id: entryId,
    account: item.account,
    description: item.description,
    amount: parseFloat(item.amount) || 0,
  }));

  const { error: inserError } = await supabase
    .from("journal_entry_items")
    .insert(itemsToInsert);

  if (insertError) {
    console.error("Error inserting new journal entry items:", insertError);
    return { error: "Gagal meng-update item didalam journal." };
  }

  revalidatePath("/");
  revalidatePath("/entries");
  redirect("/entries");
}
