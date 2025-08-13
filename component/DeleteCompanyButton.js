"use client";

import { deleteCompany } from "@/lib/action";
import Swal from "sweetalert2";

export default function DeleteCompanyButton({ companyId }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteCompany(companyId);
      if (deleteResult?.error) {
        Swal.fire("Error!", deleteResult.error, "error");
      } else {
        Swal.fire("Deleted!", "The company has been deleted.", "success");
      }
    }
  };

  return (
    <button onClick={handleDelete} className="delete-btn">
      Delete Company
    </button>
  );
}
