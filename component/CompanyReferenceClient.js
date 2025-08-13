"use client";

import { companyReference } from "@/lib/action";
import { toast } from "react-toastify";
import DeleteCompanyButton from "./DeleteCompanyButton";
import { Children } from "react";

export default function CompanyReferenceClient({ companies, children }) {
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = await companyReference(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success);
      event.target.reset(); // Reset the form after successful submission
    }
  };

  return (
    <div className="reference-layout">
      {/* form to add new company */}
      <div className="form-container">
        <h2 className="form-title">Tambahkan company reference baru</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-field">
            <label htmlFor="name">Company name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g., PT Bca"
            />
          </div>
          <div className="form-field">
            <label htmlFor="reference_prefix">
              Reference Prefix (optional)
            </label>
            <input
              type="text"
              id="reference_prefix"
              name="reference_prefix"
              placeholder="e.g., GC-INV"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save Company
            </button>
          </div>
        </form>
      </div>
      {/* list of companies */}
      <div className="table-container">
        <div className="table-header">
          <h3>Your companies</h3>
          {children}
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Reference Prefix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies && companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.name}</td>
                    <td>{company.reference_prefix || "-"}</td>
                    <td className="actions-cell">
                      <DeleteCompanyButton companyId={company.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center">
                    {" "}
                    Anda belum menambahkan perusahaan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
