"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createJournalEntry } from "@/lib/action";

export default function NewJournalEntryForm() {
  const [items, setItems] = useState([
    { account: "", description: "", amount: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAddItem = () => {
    setItems([...items, { account: "", description: "", amount: "" }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    const result = await createJournalEntry(formData);

    if (result.error) {
      toast.error(result.error); // Show error toast
    } else {
      toast.success(result.success); // Show success toast
      // Redirect to the entries page after a short delay
      setTimeout(() => {
        router.push("/entries");
      }, 1500);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Hidden input to pass the items array as a JSON string */}
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      {/* Main Entry Fields */}
      <div className="form-grid-col-3">
        <div className="form-field">
          <label htmlFor="entry_type">Entry Type</label>
          <select
            id="entry_type"
            name="entry_type"
            defaultValue="Journal Entry"
          >
            <option>Journal Entry</option>
            <option>Cash Bank Entry</option>
            <option>Credit Note</option>
            <option>Debit Note</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="posting_date">Posting Date</label>
          <input
            type="date"
            id="posting_date"
            name="posting_date"
            required
            defaultValue={new Date().toISOString().substring(0, 10)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="e.g., my company"
          />
        </div>
        <div className="form-field">
          <label htmlFor="cash_type">Cash Type</label>
          <select id="cash_type" name="cash_type">
            <option value="Out">Out</option>
            <option value="In">In</option>
          </select>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="line-items-container">
        <h3 className="line-items-title">Items</h3>
        <div className="table-wrapper">
          <table className="line-items-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.account}
                      onChange={(e) =>
                        handleItemChange(index, "account", e.target.value)
                      }
                      required
                      placeholder="e.g., Restock supplies"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      placeholder="Enter a description"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        handleItemChange(index, "amount", e.target.value)
                      }
                      required
                      step="0.01"
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={handleAddItem} className="add-row-btn">
          Add Row
        </button>
      </div>

      {/* Reference & Actions */}
      <div className="form-field">
        <label htmlFor="reference_no">Reference No</label>
        <input
          type="text"
          id="reference_no"
          name="reference_no"
          placeholder="e.g., INV-12345"
        />
      </div>

      <div className="form-actions">
        <Link href="/" className="cancel-btn">
          Cancel
        </Link>
        <button type="submit" className="save-btn">
          Save
        </button>
      </div>
    </form>
  );
}
