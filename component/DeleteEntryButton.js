"use client";

import { useState } from "react";
import { deletejournalEntry } from "@/lib/action";
import { toast } from "react-toastify";
import { set } from "date-fns";

export default function DeleteEntryButton({ entryid }) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletejournalEntry(entryid);
    if (result?.error) {
      toast.error("Gagal menghapus entry journal");
    } else {
      toast.success("Entry journal berhasil dihapus");
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} className="delete-btn">
        Delete
      </button>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Konfirmasi penghapusan</h2>
            <p>
              Apakah kamu yakin ingin menghapus journal ini ? journal yang sudah
              dihapus tidak bisa di kembalikan
            </p>
            <div className="modals-actions">
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="Confirm-delete-btn"
                disabled={isDeleting}
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
