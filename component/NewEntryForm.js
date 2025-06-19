"use client";

import { createEntry } from "@/lib/action";
import Link from "next/link";

export default function NewEntryForm() {
  return (
    <form action={createEntry} className="form-container">
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <input type="text" id="description" name="description" required />
        </div>

        <div className="form-field">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            step={0.01}
            required
            placeholder="0.00"
          />
        </div>

        <div className="form-field">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" required>
            <option value="In">In (Income)</option>
            <option value="Out">Out (Expense)</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <Link href="/" className="cancel-btn">
          Cancel
        </Link>
        <button type="submit" className="save-btn">
          Save Entry
        </button>
      </div>
    </form>
  );
}
