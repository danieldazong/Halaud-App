import { languages } from "@/data/languages";
import { Language } from "@/types/language";

const FALLBACK_CODE = "en-US";

// Best-effort device locale via the built-in Intl API (Hermes ships this —
// no expo-localization dependency needed). Falls back to English when the
// device locale isn't in the supported list, per AGENTS.md's Required State
// Handling: "device locale not in the supported language list → fall back
// to English and pre-select it, do not show an error."
export function resolveDeviceLanguage(): Language {
  let deviceLocale = FALLBACK_CODE;
  try {
    deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    // Intl unavailable — fall back to English below.
  }

  const exactMatch = languages.find(
    (language) => language.code.toLowerCase() === deviceLocale.toLowerCase(),
  );
  if (exactMatch && (exactMatch.available ?? true)) return exactMatch;

  const languagePrefix = deviceLocale.split("-")[0].toLowerCase();
  const prefixMatch = languages.find(
    (language) =>
      language.code.split("-")[0].toLowerCase() === languagePrefix &&
      (language.available ?? true),
  );
  if (prefixMatch) return prefixMatch;

  const fallback = languages.find((language) => language.code === FALLBACK_CODE);
  if (!fallback) {
    throw new Error("English fallback language missing from data/languages.ts");
  }
  return fallback;
}
