Read AGENTS.md first and follow it strictly.

Implement the Language Selection screen UI based on the attached design. Use hardcoded languages from `data/languages.ts` and the existing NativeWind / global.css design utilities.

Create or update these files:

- `types/language.ts` — `Language` and `ModelId` types
- `data/languages.ts` — hardcoded language list
- `constants/images.ts` — centralized image and flag imports
- `store/narration.ts` — Zustand store for selected language and voice
- `components/LanguageRow.tsx`
- `components/SearchField.tsx`
- `app/language.tsx` — the screen
- `app/(tabs)/index.tsx` — add a temporary link to `/language`

DATA
`Language` has: `code` (BCP 47), `englishName`, `endonym`, `supportedModels`, `defaultVoiceId`, `flag`, optional `rtl`, optional `available` (default true). Hardcode roughly 12 languages including Spanish (Spain), English (US), French (France), German (Germany), Japanese, Portuguese (Brazil), Arabic (Egypt), plus one entry with `available: false` to exercise the disabled state. Add a short comment at the top of the file stating that this list must be regenerated from live ElevenLabs documentation before release and is placeholder data only.

LAYOUT
Header: back chevron on the left, centered title "Choose a language". No logo, no account avatar, no "Library" title.

Below the header: a pill-shaped search field with placeholder "Search languages", background `surfaceRaised`, no persistent clear button — show the clear "×" only when the field has text. Filter rows live on both `englishName` and `endonym`.

Directly under the search field: one line of `inkMuted` text reading "{n} languages available", where n is computed from the available entries in `data/languages.ts`. Never hardcode the number inside a string.

Two sections, "Suggested" and "All languages", with plain `inkMuted` uppercase section labels. Do NOT add per-section counts — the attached Stitch output shows "3 options" and "4 voices" and both are wrong and must be removed. Suggested holds the device locale first, then recently used, three rows maximum. All languages is alphabetical by `englishName`.

Each row follows the List Card Style in AGENTS.md: `surface` background, hairline border `rgba(90, 107, 117, 0.12)`, the specified soft shadow, `rounded-2xl`, minimum height 72pt. Inside: a circular flag image on the left, `englishName` in medium-weight `ink`, `endonym` beneath in `inkMuted`.

Remove the chevrons shown on the unselected rows in the reference. Tapping a row selects it in place; it does not navigate anywhere, so a chevron is misleading. Unselected rows show nothing on the right. The selected row shows a thin `accent` border and an `accent` circular checkmark on the right — never a filled background.

Disabled rows keep the hairline, drop the shadow, render text at reduced opacity, show a plain `inkMuted` "Not yet available" note, and are not tappable.

Bottom: a full-width `accent` "Continue" button with fully rounded corners, and a muted text-only "Skip" link beneath it. Both must be reachable without scrolling — pin them below the scrolling list, not at the end of it.

Do not add the earth illustration from the reference. It belongs to the playful tutorial design; AGENTS.md specifies a calm, minimal, no-mascot visual language for this app.

BEHAVIOUR
Continue and Skip do the same thing: resolve `defaultVoiceId` for the selected language (Skip uses the device-locale language, falling back to English), write both to the narration store, and `router.replace` to Library. Voice Selection is not in this flow.

Put persistence behind a tiny `NarrationPreferences` interface in `store/narration.ts` with an in-memory implementation for now, so the `expo-sqlite` `preferences` table can be dropped in later without touching the screen. Do not build SQLite, Supabase, or any ElevenLabs call in this task.

FLAGS
Add real flag PNGs to `assets/images/flags/` named by language code and export them through `constants/images.ts` as a `flags` map. Resolve with `images.flags[language.code]`. No emoji flags. No dynamic `require`. If an asset is missing, render a neutral `surfaceRaised` circle placeholder rather than crashing.

STATES TO HANDLE
Search returns no matches; device locale not in the list (fall back to English, pre-selected, no error); a language marked unavailable; a language whose script the reader font lacks (still selectable, but note it in a code comment for the font-fallback work).

CODE STANDARDS
Strict TypeScript, no `any`, all promises handled. NativeWind classes only, except the documented exceptions (SafeAreaView, ScrollView `contentContainerStyle`, shadows, pressed states, and any runtime-calculated values). Use the NativeWind version already in `package.json`. Minimum touch target 44×44pt on rows, the back chevron, the clear button, Continue and Skip. Light and dark mode both. No emoji, no gradients.

Development build only, not Expo Go.

When finished, list the changed files and give test steps: open `/language` from the home link, search and clear, select several languages, confirm only one checkmark at a time, tap the disabled row and confirm nothing happens, press Continue and confirm it lands on Library with the language and its default voice in the store, relaunch and confirm Skip applies the locale default.

C:\Users\PC\Desktop\PDF-Reader\refrences\Language-selcetor.png
