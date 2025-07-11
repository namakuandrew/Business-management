"use client";

import { useState } from "react";
import { deletejournalEntry } from "@/lib/action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

export default function DeleteEntryButton({ entryId }) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletejournalEntry(entryId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Entry journal berhasil dihapus");
      router.refresh();
    }
    setIsDeleting(false);
    setShowModal(false);
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
