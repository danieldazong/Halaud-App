import LanguageRow from "@/components/LanguageRow";
import SearchField from "@/components/SearchField";
import { languages } from "@/data/languages";
import { resolveDeviceLanguage } from "@/lib/resolveLocale";
import { useNarrationStore } from "@/store/narration";
import { Language } from "@/types/language";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const availableLanguages = languages.filter((language) => language.available ?? true);

const SUGGESTED_CODES = ["es-ES", "en-US", "fr-FR"];

export default function LanguageSelection() {
  const router = useRouter();
  const languageCode = useNarrationStore((state) => state.languageCode);
  const setLanguageAndVoice = useNarrationStore((state) => state.setLanguageAndVoice);

  const deviceLanguage = useMemo(() => resolveDeviceLanguage(), []);
  const [selectedCode, setSelectedCode] = useState(languageCode ?? deviceLanguage.code);
  const [query, setQuery] = useState("");

  const suggested = useMemo(() => {
    return SUGGESTED_CODES
      .map((code) => languages.find((language) => language.code === code))
      .filter((language): language is Language => language !== undefined);
  }, []);

  const allLanguagesSorted = useMemo(() => {
    const suggestedCodes = new Set(suggested.map((language) => language.code));
    return languages
      .filter((language) => !suggestedCodes.has(language.code))
      .sort((a, b) => a.englishName.localeCompare(b.englishName));
  }, [suggested]);

  const normalizedQuery = query.trim().toLowerCase();
  const filterLanguage = (language: Language) =>
    normalizedQuery.length === 0 ||
    language.englishName.toLowerCase().includes(normalizedQuery) ||
    language.endonym.toLowerCase().includes(normalizedQuery);

  const suggestedFiltered = suggested.filter(filterLanguage);
  const allFiltered = allLanguagesSorted.filter(filterLanguage);
  const noResults = suggestedFiltered.length === 0 && allFiltered.length === 0;

  function commitSelection(code: string) {
    const language = languages.find((l) => l.code === code);
    if (!language || !(language.available ?? true)) return;
    setLanguageAndVoice(language.code, language.defaultVoiceId);
    router.replace("/");
  }

  function handleContinue() {
    commitSelection(selectedCode);
  }

  function handleSkip() {
    commitSelection(deviceLanguage.code);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      {/* ── Header ───────────────────────────────────────────── */}
      <View className="flex-row items-center px-4 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/onboarding"))}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" }}
        >
          <Feather name="chevron-left" size={28} color="#14212B" />
        </TouchableOpacity>
        <Text
          className="flex-1 text-ink text-xl font-bold text-center"
          style={{ marginRight: 40 }}
        >
          Choose a language
        </Text>
      </View>

      {/* ── Search ───────────────────────────────────────────── */}
      <View className="px-4">
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Search languages"
        />
        <Text className="text-inkMuted text-sm mt-3">
          {availableLanguages.length} languages available
        </Text>
      </View>

      {/* ── List ─────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {noResults && (
          <View className="items-center justify-center py-12">
            <Text className="text-ink text-base font-semibold">No languages found</Text>
            <Text className="text-inkMuted text-sm mt-1 text-center">
              Try a different search term.
            </Text>
          </View>
        )}

        {suggestedFiltered.length > 0 && (
          <View>
            <Text
              className="text-inkMuted text-xs font-bold mb-3"
              style={{ letterSpacing: 0.6 }}
            >
              SUGGESTED
            </Text>
            <View style={{ gap: 12 }}>
              {suggestedFiltered.map((language) => (
                <LanguageRow
                  key={language.code}
                  language={language}
                  selected={language.code === selectedCode}
                  onPress={() => setSelectedCode(language.code)}
                />
              ))}
            </View>
          </View>
        )}

        {allFiltered.length > 0 && (
          <View style={{ marginTop: suggestedFiltered.length > 0 ? 28 : 0 }}>
            <Text
              className="text-inkMuted text-xs font-bold mb-3"
              style={{ letterSpacing: 0.6 }}
            >
              ALL LANGUAGES
            </Text>
            <View style={{ gap: 12 }}>
              {allFiltered.map((language) => (
                <LanguageRow
                  key={language.code}
                  language={language}
                  selected={language.code === selectedCode}
                  onPress={() => setSelectedCode(language.code)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Bottom actions ───────────────────────────────────── */}
      <View className="px-4 pb-6 pt-2">
        <TouchableOpacity
          onPress={handleContinue}
          className="bg-accent rounded-full items-center justify-center"
          style={{ height: 52 }}
        >
          <Text className="text-white text-base font-bold">Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSkip}
          className="items-center justify-center mt-3"
          style={{ minHeight: 44 }}
        >
          <Text className="text-inkMuted text-base font-medium">Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
