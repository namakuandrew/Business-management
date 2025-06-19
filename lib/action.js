"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "./supabase/client";

export async function createEntry(formData) {
  const entry = {
    description: formData.get("description"),
    amount:
      formData.get("type") === "Out"
        ? -Math.abs(parseFloat(formData.get("amount")))
        : Math.abs(parseFloat(formData.get("amount"))),
    type: formData.get("type"),
  };

  const { error } = await supabase.from("entries").insert([entry]);
  if (error) {
    console.error("Error creating entry:", error);
    return;
  }

  revalidatePath("/");
  redirect("/");
}
