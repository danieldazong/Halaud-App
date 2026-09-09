import { Document } from "@/types/document";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LibraryState {
  documents: Document[];
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
}

// Persisted via AsyncStorage (not expo-sqlite) so this store keeps working in
// Expo Go — expo-sqlite is a native module Expo Go cannot load. See the same
// exception documented in store/narration.ts and AGENTS.md's store/ section;
// this moves to the SQLite `documents` table once the extraction/reader
// pipeline lands and the app runs full-time on a development build.
export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "library-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
