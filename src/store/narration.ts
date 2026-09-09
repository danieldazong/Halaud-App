import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Persisted via AsyncStorage (not expo-sqlite) so this store keeps working
// in Expo Go — expo-sqlite is a native module Expo Go cannot load. Revisit
// once the app moves to a development build full-time (see AGENTS.md's
// Native Modules Rule).
interface NarrationState {
  languageCode: string | null;
  voiceId: string | null;
  recentLanguageCodes: string[];
  hasHydrated: boolean;
  setLanguageAndVoice: (languageCode: string, voiceId: string) => void;
  clearLanguageAndVoice: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useNarrationStore = create<NarrationState>()(
  persist(
    (set, get) => ({
      languageCode: null,
      voiceId: null,
      recentLanguageCodes: [],
      hasHydrated: false,
      setLanguageAndVoice: (languageCode, voiceId) => {
        const recentLanguageCodes = [
          languageCode,
          ...get().recentLanguageCodes.filter((code) => code !== languageCode),
        ].slice(0, 3);
        set({ languageCode, voiceId, recentLanguageCodes });
      },
      clearLanguageAndVoice: () => {
        set({ languageCode: null, voiceId: null, recentLanguageCodes: [] });
      },
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "narration-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // languageCode starts null until AsyncStorage finishes loading, so the
      // root layout must wait for hasHydrated before deciding whether to
      // gate a returning user into Language Selection — otherwise every
      // cold start would flash the picker before snapping back to Library.
      partialize: (state) => ({
        languageCode: state.languageCode,
        voiceId: state.voiceId,
        recentLanguageCodes: state.recentLanguageCodes,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("narration-storage: failed to rehydrate from AsyncStorage:", error);
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
