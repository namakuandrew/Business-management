"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { updateJournalEntry } from "@/lib/action";

export default function EditJournalEntryForm({ entry }) {
  // Initialize the line items state with the data passed from the server
  const [items, setItems] = useState(
    entry.journal_entry_items || [{ account: "", description: "", amount: "" }]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddItem = () =>
    setItems([...items, { account: "", description: "", amount: "" }]);
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  const handleRemoveItem = (index) =>
    setItems(items.filter((_, i) => i !== index));

  // We bind the entry.id to the server action
  const updateEntryWithId = updateJournalEntry.bind(null, entry.id);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);
    const result = await updateEntryWithId(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Entry updated successfully!");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <div className="form-grid-col-3">
        <div className="form-field">
          <label htmlFor="entry_type">Entry Type</label>
          <select
            id="entry_type"
            name="entry_type"
            defaultValue={entry.entry_type}
          >
            <option>Journal Entry</option>
            <option>Cash Bank Entry</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="posting_date">Posting Date</label>
          <input
            type="date"
            id="posting_date"
            name="posting_date"
            required
            defaultValue={entry.posting_date}
          />
        </div>
        <div className="form-field">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="e.g., My Company"
            defaultValue={entry.company}
          />
        </div>
        <div className="form-field">
          <label htmlFor="cash_type">Cash Type</label>
          <select
            id="cash_type"
            name="cash_type"
            defaultValue={entry.cash_type}
          >
            <option value="Out">Out</option>
            <option value="In">In</option>
          </select>
        </div>
      </div>
      <div className="line-items-container">
        <h3 className="line-items-title">Items</h3>
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
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
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
        <button type="button" onClick={handleAddItem} className="add-row-btn">
          Add Row
        </button>
      </div>
      <div className="form-field">
        <label htmlFor="reference_no">Reference No</label>
        <input
          type="text"
          id="reference_no"
          name="reference_no"
          placeholder="e.g., INV-001"
          defaultValue={entry.reference_no}
        />
      </div>
      <div className="form-actions">
        <Link href="/entries" className="cancel-btn">
          Cancel
        </Link>
        <button type="submit" className="save-btn" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
