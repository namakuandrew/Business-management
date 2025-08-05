// app/(dashboard)/layout.js
import DashboardClientLayout from "@/component/DashboardClientLayout";
import { createSupabaseServerClient } from "@/lib/supabase/utils";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DashboardClientLayout userEmail={user?.email}>
      {children}
    </DashboardClientLayout>
  );
}
