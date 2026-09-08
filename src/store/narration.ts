import { create } from "zustand";

// Persistence is behind this interface so the real expo-sqlite `preferences`
// table can be dropped in later without touching any screen that reads from
// the store.
interface NarrationPreferences {
  getLanguageCode: () => string | null;
  getVoiceId: () => string | null;
  getRecentLanguageCodes: () => string[];
  save: (languageCode: string, voiceId: string) => void;
}

function createInMemoryPreferences(): NarrationPreferences {
  let languageCode: string | null = null;
  let voiceId: string | null = null;
  let recentLanguageCodes: string[] = [];

  return {
    getLanguageCode: () => languageCode,
    getVoiceId: () => voiceId,
    getRecentLanguageCodes: () => recentLanguageCodes,
    save: (nextLanguageCode, nextVoiceId) => {
      languageCode = nextLanguageCode;
      voiceId = nextVoiceId;
      recentLanguageCodes = [
        nextLanguageCode,
        ...recentLanguageCodes.filter((code) => code !== nextLanguageCode),
      ].slice(0, 3);
    },
  };
}

const preferences = createInMemoryPreferences();

interface NarrationState {
  languageCode: string | null;
  voiceId: string | null;
  recentLanguageCodes: string[];
  setLanguageAndVoice: (languageCode: string, voiceId: string) => void;
}

export const useNarrationStore = create<NarrationState>((set) => ({
  languageCode: preferences.getLanguageCode(),
  voiceId: preferences.getVoiceId(),
  recentLanguageCodes: preferences.getRecentLanguageCodes(),
  setLanguageAndVoice: (languageCode, voiceId) => {
    preferences.save(languageCode, voiceId);
    set({
      languageCode,
      voiceId,
      recentLanguageCodes: preferences.getRecentLanguageCodes(),
    });
  },
}));
