import { createSupabaseServerClient } from "@/lib/supabase/utils";
import { cookies } from "next/headers";
import CompanyReferenceClient from "@/component/CompanyReferenceClient";
import Search from "@/component/Search";

export default async function CompanyReferencePage({ searchParams }) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const query = searchParams.query || "";

  let queryBuilder = supabase.from("contacts").select("*");

  if (query) {
    queryBuilder = queryBuilder.ilike("name", `%${query}%`);
  }

  const { data: companies, error } = await queryBuilder.order("name", {
    ascending: true,
  });

  if (error) {
    console.error("Error fetching companies:", error);
  }

  return (
    <div>
      <header className="page-header">
        <div className="page-header-title">
          <h1>Company reference</h1>
          <p>mengurus company dan reference Id</p>
        </div>
      </header>
      <CompanyReferenceClient companies={companies || []}>
        <Search placeholder={"Search companies..."} />
      </CompanyReferenceClient>
    </div>
  );
}
