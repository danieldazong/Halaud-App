import { Document } from "@/types/document";
import { create } from "zustand";

interface LibraryState {
  documents: Document[];
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
}

// In-memory for this first pass — recency-ordered, newest import first.
// Persistence moves to SQLite once the extraction/reader pipeline lands.
export const useLibraryStore = create<LibraryState>((set) => ({
  documents: [],
  addDocument: (document) =>
    set((state) => ({
      documents: [document, ...state.documents].sort(
        (a, b) => b.importedAt - a.importedAt,
      ),
    })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
}));
