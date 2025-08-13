// lib/actions.js
"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- SIGN OUT ACTION ---
export async function signOut() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

// --- CREATE ACTION ---
export async function createJournalEntry(formData) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to create an entry." };

  try {
    const cashType = formData.get("cash_type");
    const mainEntry = {
      posting_date:
        formData.get("posting_date") ||
        new Date().toISOString().substring(0, 10),
      entry_type: formData.get("entry_type") || "Journal Entry",
      contact_id: formData.get("contact_id"),
      cash_type: cashType,
      reference_no: formData.get("reference_no"),
      user_id: user.id,
    };

    const itemsData = JSON.parse(formData.get("items"));
    const { data: journalEntry, error: mainError } = await supabase
      .from("journal_entries")
      .insert(mainEntry)
      .select()
      .single();
    if (mainError) throw mainError;

    const itemsToInsert = itemsData.map((item) => {
      const amount = parseFloat(item.amount) || 0;
      return {
        journal_entry_id: journalEntry.id,
        account: item.account,
        description: item.description,
        amount: cashType === "Out" ? -Math.abs(amount) : Math.abs(amount),
        user_id: user.id,
      };
    });

    const { error: itemsError } = await supabase
      .from("journal_entry_items")
      .insert(itemsToInsert);
    if (itemsError) throw itemsError;

    revalidatePath("/");
    revalidatePath("/entries");
    return { success: "Journal entry created successfully!" };
  } catch (error) {
    console.error("Error in createJournalEntry:", error);
    return { error: error.message };
  }
}

// --- DELETE ACTION ---
export async function deleteJournalEntry(entryId) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  if (!entryId) return { error: "Invalid entry ID." };

  try {
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", entryId);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/entries");
    return { success: "Entry deleted successfully." };
  } catch (error) {
    console.error("Error in deleteJournalEntry:", error);
    return { error: `Database Error: ${error.message}` };
  }
}

export async function companyReference(formData) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda harus login terlebih dahulu." };

  const newCompany = {
    name: formData.get("name"),
    reference_prefix: formData.get("reference_prefix"),
    user_id: user.id,
  };

  try {
    const { error } = await supabase.from("contacts").insert(newCompany);
    if (error) throw error;
    revalidatePath("/company-reference"); // Refresh the new page
    revalidatePath("/entries/new");
    return { success: "Company created!" };
  } catch (error) {
    return { error: error.message };
  }
}

// --- NEW: DELETE COMPANY ACTION ---
export async function deleteCompany(companyId) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  if (!companyId) return { error: "Invalid Company ID." };

  try {
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", companyId);
    if (error) throw error;
    revalidatePath("/company-reference");
    return { success: "Company deleted!" };
  } catch (error) {
    return { error: error.message };
  }
}

// --- UPDATE ACTION ---
export async function updateJournalEntry(entryId, formData) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to update an entry." };

  if (!entryId) return { error: "Invalid entry ID." };

  try {
    const cashType = formData.get("cash_type");
    const mainEntry = {
      posting_date: formData.get("posting_date"),
      entry_type: formData.get("entry_type"),
      contact_id: formData.get("contact_id"),
      cash_type: cashType,
      reference_no: formData.get("reference_no"),
    };

    const { error: mainError } = await supabase
      .from("journal_entries")
      .update(mainEntry)
      .eq("id", entryId);
    if (mainError) throw mainError;

    const { error: deleteError } = await supabase
      .from("journal_entry_items")
      .delete()
      .eq("journal_entry_id", entryId);
    if (deleteError) throw deleteError;

    const itemsData = JSON.parse(formData.get("items"));
    const itemsToInsert = itemsData.map((item) => {
      const amount = parseFloat(item.amount) || 0;
      return {
        journal_entry_id: entryId,
        account: item.account,
        description: item.description,
        amount: cashType === "Out" ? -Math.abs(amount) : Math.abs(amount),
        user_id: user.id,
      };
    });

    const { error: insertError } = await supabase
      .from("journal_entry_items")
      .insert(itemsToInsert);
    if (insertError) throw insertError;

    revalidatePath("/");
    revalidatePath("/entries");
    return { success: "Entry updated successfully!" };
  } catch (error) {
    console.error("Error in updateJournalEntry:", error);
    return { error: error.message };
  }
}
