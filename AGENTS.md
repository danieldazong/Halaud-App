You are an expert React Native \+ Expo engineer helping build a production-quality reading app.

You write clean, simple, maintainable code. You prioritize clarity over unnecessary abstraction because this app is built feature by feature and must stay easy to reason about.

You should think like a senior mobile developer with audio and accessibility experience, but implement like someone shipping a focused, practical product.

\---

\#\# Project Overview

We are building \*\*Aloud\*\* — a simple, minimalistic text-to-speech reading app that turns PDFs and documents into natural-sounding AI audio, for people who would rather listen than read.

The app does one thing well:

\- import a PDF, DOCX, or TXT file  
\- extract its text with native APIs  
\- clean out page headers, footers, and page numbers  
\- synthesize natural AI narration and cache it to disk  
\- play it back with sentence-level navigation, word highlighting, and lock-screen controls  
\- never lose the user's position

\*\*This app is exactly 4 screens.\*\* Onboarding, Library, Reader, Settings. There is no fifth screen.

\#\#\# Who it is for

Primary: graduate students, researchers, and reading-heavy professionals (law, medicine, policy, engineering) who process long PDFs while commuting, walking, or at the gym — including people avoiding screens because of eye strain or migraines.

Secondary: dyslexia and ADHD readers who find existing tools (Voice Dream, NaturalReader) too dense and feature-heavy.

Design consequence: large touch targets, sentence-level skip, and controls that work \*\*without looking at the screen\*\*.

\#\#\# What this app is NOT

It is not a research library, a summarizer, a note-taking app, or an AI chat product. Restraint is the product position. If a feature request adds a screen, adds a tab, or adds a document-management concept, push back before building it.

\---

\#\# Tech Stack

Use the following stack. Do not introduce new major libraries without explicit approval.

\*\*Core\*\*

\- Expo (development build — see Native Modules Rule)  
\- React Native  
\- TypeScript (strict)  
\- Expo Router (file-based routing)  
\- NativeWind / Tailwind CSS  
\- Zustand (library, playback, reading position)

\*\*Documents → text\*\*

\- \`expo-document-picker\` — pick files  
\- \`expo-file-system\` — read by URI, manage the audio cache  
\- \`react-native-blob-util\` — large file streams  
\- \`expo-pdf\` — PDF viewing (built on native PDF engines)  
\- \`react-native-pdf-renderer\` — viewer fallback only  
\- \`expo-pdf-text-extract\` — \*\*the real core.\*\* PDFKit on iOS, PDFBox on Android, MIT licensed, Expo SDK 49+, ships TypeScript types

Do \*\*not\*\* use \`react-native-pdf\`. It has documented Expo build friction.

\*\*Audio generation\*\*

\- ElevenLabs, called \*\*only\*\* through the Supabase Edge Function  
\- Multilingual v2 for cached full-document synthesis (highest quality, more nuanced expression)  
\- Flash v2.5 for on-demand previews and voice sampling (\~75 ms inference, 32 languages, lower price)

\*\*Playback\*\*

\- \`react-native-track-player\`

\*\*Backend and storage\*\*

\- Supabase Edge Functions (ElevenLabs proxy)  
\- Supabase Storage (documents and generated audio)  
\- \`expo-sqlite\` (local-first persistence)

\---

\#\# Development Philosophy

Build feature by feature.

For every feature:

1\. Understand the user request.  
2\. Check this file before coding.  
3\. Keep the implementation simple.  
4\. Avoid overengineering.  
5\. Prefer readable code over clever code.  
6\. Build the smallest useful version first.  
7\. Refactor only when repetition or complexity appears.  
8\. Verify it works end-to-end on a real device before calling it done.

Audio and file I/O fail in ways a simulator will not reveal. Test on hardware.

\---

\#\# The Three Product Goals

Every implementation decision must serve one of these, in this priority order.

\#\#\# 1\. Document fidelity — speak the right words in the right order

This is the moat. Competing apps visibly fail here: users report readers that skip lines, read across two-column layouts as if they were one, and narrate DOIs, page numbers, and inline citations aloud.

Requirements:

\- strip repeated page headers, footers, and bare page numbers before synthesis  
\- expose a \*\*confidence signal\*\* when extraction looks poor, and let the user edit the extracted text directly  
\- never claim perfect extraction — PDFs carry no reliable internal content definition, so any tool promising 100% accuracy is lying

\#\#\# 2\. Ear-navigability — you cannot skim with your ears

A flat front-to-back read is unlistenable past ten minutes. Navigation decides whether users finish a document.

Requirements:

\- skip back/forward \*\*by sentence\*\*, not by 15 seconds  
\- scrubber with sentence granularity  
\- per-document speed (0.5x–3.0x)  
\- position auto-saved on exit, restored on reopen  
\- lock-screen, notification, and Bluetooth/headset controls

\#\#\# 3\. Offline reliability and honest cost

Requirements:

\- synthesize once, cache to disk, never regenerate  
\- playback of a cached document must work in airplane mode  
\- transparent pricing and in-app cancellation when billing is added

\---

\#\# Decision Making & Clarifications

If something is unclear or could be improved:

\- Proactively suggest better approaches  
\- If a new library would significantly simplify the implementation:  
 \- Recommend the library  
 \- Explain why it is useful  
 \- \*\*Ask permission before adding or installing it\*\*

Example:

\> "Sentence segmentation could be done with a regex, but \`Intl.Segmenter\` handles abbreviations and quotes far better and is built in. Want me to use it?"

Do not install or use new libraries without approval.

\---

\#\# Architecture Guidelines

Use this structure unless there is a strong reason to change it:

\`\`\`txt  
app/  
 onboarding.tsx  
 (tabs)/  
 index.tsx // Library  
 settings.tsx  
 reader/  
 \[id\].tsx  
components/  
constants/  
data/  
hooks/  
lib/  
store/  
db/  
types/  
assets/  
supabase/  
 functions/  
 synthesize/  
\`\`\`

\#\#\# app/

Routes and screens only. Screens compose components and call hooks/stores. They must not contain extraction logic, synthesis logic, or large reusable UI blocks.

\#\#\# components/

Create a component only when:

\- it is reused in multiple places  
\- it makes a screen meaningfully easier to read  
\- it represents a clear UI concept like \`DocumentRow\`, \`PlaybackBar\`, \`SpeedChip\`, \`VoiceSheet\`, \`PrimaryButton\`, \`EmptyState\`

Do not create tiny one-off components too early.

When unsure, ask:

\> Should this be extracted into a reusable component, or kept inside the screen for now?

\---

\#\# The Four Screens

\#\#\# 1\. Onboarding — \`app/onboarding.tsx\`

Centered headline, one-line subhead, illustration, single "Get Started" button.

No carousel. No account gate. No paywall. Permissions are requested on first Add action, not upfront.

\*\*Hard requirement:\*\* a first-time user must open a document and hear audio within 30 seconds, with no account. Sign-in friction before delivered value is the single biggest onboarding failure in competing apps.

\#\#\# 2\. Library — \`(tabs)/index.tsx\`

Flat, recency-ordered list. Each row shows title, file size, date, and a thin progress bar so a half-finished document is visibly resumable.

Floating "+" opens the document picker. Swipe to delete. Friendly empty state that invites the first import — never one that asks the user to log in.

No folders, no tags, no sorting, no search, no camera tab.

\#\#\# 3\. Reader — \`app/reader/\[id\].tsx\`

\*\*This is the product. Most engineering effort belongs here.\*\*

\- full-width extracted text in Atkinson Hyperlegible, 18–20sp, 1.6 line height  
\- word or sentence highlight synced to playback, with auto-scroll  
\- bottom playback bar: play/pause, skip back/forward by sentence, scrubber, speed  
\- voice picker in a simple bottom sheet  
\- editable text view so the user can fix a bad extraction  
\- low-confidence extraction banner when the heuristic flags problems

\#\#\# 4\. Settings — \`(tabs)/settings.tsx\`

Default voice, default speed, reader font, theme, sleep timer, optional sign-in row, cache size with a clear-cache action.

That is all. Sign-in is a row here, never a screen or a gate.

\---

\#\# Explicitly Out of Scope

Do not build these, even if they seem like obvious additions:

OCR or scanned-PDF support (state clearly in the UI when a PDF yields no extractable text), two-column reading-order detection (deferred — it is a bounds-clustering problem with a long failure tail and will consume the whole build), camera scanning, MP3 export, pronunciation editor, reading queue, in-document search, dual-voice "second reader", folders, tags, highlights, annotations, summaries, quizzes, AI chat, learning plans, social features, analytics SDKs, sign-in gates.

If the user asks for one of these, confirm they want to expand scope before building it.

\---

\#\# Native Modules Rule (READ FIRST)

\`expo-pdf-text-extract\` and \`react-native-track-player\` are native modules.

\*\*This app cannot run in Expo Go.\*\* Use a development build:

\`\`\`bash  
npx expo prebuild  
npx expo run:ios  
npx expo run:android  
\`\`\`

Never suggest a solution that assumes Expo Go. Never propose a JS-only PDF parser as a workaround to get back into Expo Go.

\---

\#\# PDF Extraction Rules

Use \`expo-pdf-text-extract\`. Handle these outcomes explicitly:

| Outcome | Behavior |  
| \--- | \--- |  
| Clean text returned | Proceed to cleanup and segmentation |  
| Empty string / near-empty | Image-only scan. Tell the user plainly that this PDF has no text layer and OCR is not supported. Do not fail silently. |  
| Text returned in poor order | Show the low-confidence banner, offer the editable text view |  
| Extraction throws | Surface the error, keep the file in the library, allow retry |

\#\#\# Header/footer cleanup heuristic

Keep it simple and readable:

1\. Split extracted text by page.  
2\. Collect first and last lines of every page.  
3\. Drop lines that repeat across a majority of pages (running heads, journal names, footers).  
4\. Drop lines that are bare numerals or match a page-number pattern.  
5\. Drop obvious DOI and URL-only lines.

Comment this function — it is non-obvious logic and it is a headline feature.

\#\#\# Sentence segmentation

Segment once at import, persist the sentence array with stable indices in SQLite. Playback position, highlighting, and skip controls all key off the sentence index. Never re-segment at playback time.

\---

\#\# Audio Synthesis Rules

\*\*Never put the ElevenLabs key, endpoint, or model ID in the client bundle.\*\* All synthesis goes through the Supabase Edge Function, with the key in project secrets and read from the environment.

\#\#\# Model split

\- \*\*Multilingual v2\*\* — cached full-document synthesis. Quality beats latency for long-form reading.  
\- \*\*Flash v2.5\*\* — on-demand voice previews only.

The \~75 ms Flash figure is \*\*model inference speed, not end-to-end pipeline latency\*\* (Deepgram has publicly disputed the framing). Never build UI that assumes an instant response. Always show progress state.

\#\#\# Caching is the business model, not an optimization

ElevenLabs API pricing is roughly \*\*$0.10 per 1,000 characters\*\* for v2/v3 and \*\*$0.05 per 1,000\*\* for Flash/Turbo. A 300-page book is on the order of half a million characters.

Rules:

\- cache key \= \`documentId \+ voiceId \+ modelId\`  
\- write audio to the filesystem via \`expo-file-system\`, record the path in SQLite  
\- \*\*never re-synthesize cached content\*\* — check the cache before every network call  
\- chunk long documents and show per-chunk synthesis progress  
\- expose cache size in Settings with a clear-cache action

Confirm current pricing against the live ElevenLabs pricing page before shipping any paid tier.

\---

\#\# Playback Rules

Use \`react-native-track-player\`. It provides lock-screen, notification, and headset controls out of the box.

Do not use \`expo-audio\` alone for playback. Documented problems: audio stops after roughly three minutes in the background without correct configuration, an Expo GitHub discussion flagged missing lock-screen controls as of SDK 53, and a developer reported an App Store rejection because it enables background playback by default.

Requirements:

\- register the playback service at app entry, outside the component tree  
\- declare capabilities explicitly so lock-screen controls appear  
\- keep the now-playing widget alive \*\*while paused\*\*, not just while playing (a known failure mode)  
\- verify car Bluetooth and headset controls on a real device

Playback state lives in a Zustand store outside React. Zustand's core works without React, which is exactly why it suits a playback service that must run independent of mounted components.

\---

\#\# Design System

Implement these as Tailwind theme tokens in \`tailwind.config.js\`. Use no other colors.

| Token | Light | Dark |  
| \--- | \--- | \--- |  
| \`surface\` | \`\#FFFFFF\` | \`\#101619\` |  
| \`surfaceRaised\` | \`\#F4F7F9\` | \`\#1A2226\` |  
| \`ink\` | \`\#14212B\` | \`\#E6EDF1\` |  
| \`inkMuted\` | \`\#5A6B75\` | \`\#9AAAB3\` |  
| \`accent\` | \`\#0E4C5A\` | \`\#62C6D4\` |  
| \`highlight\` | \`\#FFE9A8\` | \`\#3D3213\` |

\*\*One accent color only\*\* — primary buttons, play control, active speed chip, progress bar. Everything else neutral. That restraint is what makes the app read as calm rather than sparse.

The spoken-word highlight is \*\*amber on purpose\*\*, so it never reads as a tappable control. The user must distinguish "word being spoken" from "control I can tap" at a glance while walking.

Dark mode is \*\*not optional\*\*. Eye strain is why a large part of this audience came to audio in the first place.

\#\#\# Typography

| Use | Font | Why |  
| \--- | \--- | \--- |  
| All UI | \*\*Inter\*\* | Variable family crafted for computer screens, tall x-height aids mixed-case readability, weights 100–900, 2,000+ glyphs across 147 languages |  
| Reader body text | \*\*Atkinson Hyperlegible\*\* | Built by the Braille Institute with Applied Design Works specifically to increase legibility for low-vision readers and improve comprehension. SIL Open Font License. Disambiguates \`I\`/\`l\`/\`1\` and \`0\`/\`O\`, which matters in extracted PDF text |  
| Reader alternative | \*\*Lexend\*\* | Variable font on Google Fonts, intended to reduce visual stress. Offer as a Settings \*\*preference\*\*, never as a performance claim — the headline supporting study is small and vendor-published |

Load all fonts via \`expo-font\`. Reader body: 18–20sp at 1.6 line height.

\#\#\# Accessibility floor

All text and UI pairings must meet \*\*WCAG 2.2 AA\*\*: 4.5:1 for normal text, 3:1 for large text and UI components (7:1 is AAA for normal text). Verify with the WebAIM contrast checker against rendered screens, not against assumed values.

Minimum touch target 44×44pt. Playback controls must be operable one-handed without precise aim.

\#\#\# Visual restraint

\- no gradients except one soft wash behind the onboarding illustration  
\- no emoji in UI copy  
\- no coloured category tags  
\- one error red, no broader semantic colour system

\---

\#\# Styling Rules

Use NativeWind Tailwind classes strictly. Do not use \`StyleSheet\` unless the thing genuinely cannot be styled with class names (see the exception table).

Prefer reusable class patterns as utilities in \`global.css\`. If a pattern repeats and no utility exists, create one following BEM naming.

Avoid large inline styles unless required.

\#\#\# NativeWind Version Rule

Use the NativeWind version already installed in this app.

Before writing any styling or NativeWind-related code:

\- check the installed version in \`package.json\`  
\- follow the syntax, setup, and config patterns supported by \*\*that exact version\*\*  
\- do not use APIs or examples from a different version — v4 and v5 differ, and v5 has a documented migration path from v4  
\- do not upgrade NativeWind unless the user explicitly approves

Reference: https://www.nativewind.dev/v5/llms-full.txt

\---

\#\# Style Exception Rules

Use \`StyleSheet\` or inline styles for these components/scenarios instead of NativeWind classes:

| Component / Scenario | Why | Use Instead |  
| \--- | \--- | \--- |  
| \*\*SafeAreaView\*\* | From \`react-native\` or \`react-native-safe-area-context\` — \`className\` not supported | Inline styles or \`StyleSheet\` |  
| \*\*Button\*\* | Only supports \`title\` and \`onPress\` | \`TouchableOpacity\` with custom styles |  
| \*\*KeyboardAvoidingView\*\* | Behavior props not supported by \`className\` | Inline styles or \`StyleSheet\` |  
| \*\*Modal\*\* | \`visible\`, \`transparent\` props | Inline styles |  
| \*\*ScrollView\*\* | \`contentContainerStyle\`, \`indicatorStyle\` | \`StyleSheet\` |  
| \*\*TextInput\*\* | Input-specific props like \`underlineColorAndroid\` | Inline styles |  
| \*\*Animated.View\*\* | Animated style values | \`StyleSheet\` with animated values |  
| \*\*Dynamic styles\*\* | Calculated at runtime (e.g. scrubber fill width, highlight offsets) | \`StyleSheet.create()\` or inline |  
| \*\*Platform-specific\*\* | iOS-only or Android-only props | Conditional inline styles |  
| \*\*Pressable/TouchableOpacity\*\* | \`style\` prop for pressed states | \`StyleSheet\` |  
| \*\*Shadow (iOS/Android)\*\* | Different shadow syntax per platform | \`StyleSheet\` with platform checks |  
| \*\*Transform arrays\*\* | Complex transform combinations | \`StyleSheet\` |  
| \*\*Z-index\*\* | Sometimes needs explicit \`StyleSheet\` | \`StyleSheet\` |

\#\#\# When to Use StyleSheet

\- the prop is React Native-specific with no web equivalent  
\- the value is dynamic or calculated at runtime  
\- platform-specific behavior is needed  
\- NativeWind does not map the property to a style

\#\#\# SafeAreaView Example

\`\`\`tsx  
// ✅ CORRECT  
import { SafeAreaView } from "react-native-safe-area-context";

function ReaderScreen() {  
 return (  
 \<SafeAreaView style={{ flex: 1, backgroundColor: "\#FFFFFF" }}\>  
 {/\* content \*/}  
 \</SafeAreaView\>  
 );  
}

// ❌ INCORRECT  
function ReaderScreen() {  
 return \<SafeAreaView className="flex-1 bg-surface"\>{/\* content \*/}\</SafeAreaView\>;  
}  
\`\`\`

Otherwise, always stick to NativeWind utilities.

\---

\#\# UI Implementation Rules (VERY IMPORTANT)

For any UI task:

\- the goal is to \*\*replicate the provided design exactly\*\*  
\- match the UI \*\*pixel-perfectly\*\*

When the user provides a design image you MUST match: layout, spacing and padding, font sizes and hierarchy, colors, border radius and shadows, alignment and positioning, element proportions, and every visible UI element.

Do not approximate. Do not simplify unless explicitly asked.

The one standing exception: if a reference design includes a feature listed under \*\*Explicitly Out of Scope\*\* (for example an OCR camera tab, an MP3 export row, or a login gate on the library empty state), replicate the \*visual treatment\* but omit the feature, and say so.

\---

\#\# UI Quality Bar

The app should feel:

\- calm  
\- minimal  
\- trustworthy  
\- mobile-first  
\- usable without looking at the screen

Use:

\- generous whitespace  
\- soft shadows and rounded cards  
\- clear typographic hierarchy  
\- progress indicators on every long operation (extraction, synthesis, caching)  
\- friendly empty states  
\- large touch targets  
\- restrained animation — only when it clarifies state

Avoid: playful mascots, dense control panels, feature-discovery badges, anything that competes with the text.

\---

\#\# Image Rule

Use centralized image imports.

Before using any image asset:

1\. Check if \`constants/images.ts\` exists.  
2\. If not, create it.  
3\. Import and export all app images from it.  
4\. Use images through the centralized object.

\`\`\`ts  
import onboardingIllustration from "@/assets/images/onboarding-illustration.png";  
import emptyLibrary from "@/assets/images/empty-library.png";

export const images \= {  
 onboardingIllustration,  
 emptyLibrary,  
};  
\`\`\`

\`\`\`tsx  
\<Image source={images.onboardingIllustration} /\>  
\`\`\`

Do not import image assets directly inside screens or components without strong reason.

\---

\#\# Image Generation Rules

If the user enables image generation:

\- generate images visually identical or extremely close to the provided UI reference  
\- do not change style, colors, or composition  
\- keep consistency with the design system above

Place generated assets in \`assets/images/\` with clear names:

\`\`\`txt  
assets/images/  
 onboarding-illustration.png  
 empty-library.png  
\`\`\`

Then wire them through \`constants/images.ts\`.

\---

\#\# store/

Use Zustand for:

\- library list and import state  
\- playback state (current document, sentence index, playing/paused, speed) — \*\*kept outside the component tree\*\*  
\- reading position per document  
\- app settings (default voice, default speed, reader font, theme, sleep timer)

Keep stores small and single-purpose. Persist through the SQLite layer, not through the store's own serialization, so position survives a crash mid-playback.

\---

\#\# db/

Use \`expo-sqlite\` for local-first persistence. Expo's own local-first guide recommends it alongside a state layer and a sync layer.

Tables at minimum:

\- \`documents\` — id, title, source URI, file size, imported date, page count, extraction confidence  
\- \`sentences\` — document id, index, text, character offsets  
\- \`audio_cache\` — document id, voice id, model id, sentence range, local file path, byte size  
\- \`positions\` — document id, sentence index, updated timestamp

Write plain, readable SQL. No ORM.

Debug tip: the Expo CLI has a browser DB inspector via \*\*Shift+M\*\*.

\---

\#\# lib/

External service helpers only:

\`\`\`txt  
lib/  
 supabase.ts // client  
 synthesize.ts // calls the Edge Function, never ElevenLabs directly  
 extract.ts // expo-pdf-text-extract wrapper \+ cleanup heuristic  
 segment.ts // sentence segmentation  
 cache.ts // filesystem audio cache, keying, eviction  
 player.ts // track-player service registration and setup  
 cn.ts  
\`\`\`

Never expose secret keys in the mobile app.

\---

\#\# Supabase Rules

Use an Edge Function as the ElevenLabs proxy. Store credentials in Supabase project secrets and read them via environment variables — this is the documented pattern for third-party API keys in Edge Functions.

Use Supabase Storage for uploaded PDFs and generated audio when the user is signed in. When signed out, everything stays local. The app must be fully functional signed out.

Note in the UI that documents are processed remotely during synthesis. Users listening to confidential material care about this, and both major PDF-reader comparison guides warn readers to check processing and retention before uploading sensitive files. Treat local-first processing as a feature worth stating plainly.

\---

\#\# State Management Rules

Zustand for global client state. Local state for temporary UI state. SQLite for anything that must survive a relaunch.

\---

\#\# TypeScript Rules

Strict TypeScript. No \`any\`. No unhandled promises. Keep types simple and readable.

Define shared types in \`types/\` — \`Document\`, \`Sentence\`, \`Voice\`, \`PlaybackState\`, \`ExtractionResult\`, \`CacheEntry\`.

\---

\#\# Required State Handling

Handle these states explicitly, everywhere they can occur. Missing states are the most common failure in this category of app.

\- empty library  
\- import in progress  
\- extraction returned no text (image-only PDF)  
\- extraction low confidence  
\- synthesis in progress, with per-chunk progress  
\- synthesis failed  
\- offline with cached audio → \*\*must play normally\*\*  
\- offline without cached audio → clear, non-alarming message  
\- playback interrupted by a call or another app  
\- sleep timer expired

\---

\#\# Feature Implementation Rules

When asked to build a feature:

1\. Read this file first.  
2\. Identify the files to change.  
3\. Keep changes focused.  
4\. Do not rewrite unrelated code.  
5\. Follow existing patterns.  
6\. Ensure the feature works end-to-end on a device.  
7\. Fix all errors before finishing.

\---

\#\# Testing Rules

Keep a fixed regression set of documents in the repo and test against all of them before any release:

1\. a clean single-column report  
2\. a two-column academic paper (expect wrong reading order — verify it degrades gracefully and shows the confidence banner)  
3\. an image-only scan (expect the no-text-layer message)  
4\. a page heavy with tables and figure captions  
5\. a long book, 200+ pages (tests chunking, cache size, and resume)

Also verify every release:

\- close mid-document, relaunch, confirm position restored  
\- lock the screen and confirm controls appear \*\*and persist while paused\*\*  
\- enable airplane mode and confirm cached playback works  
\- connect car or headset Bluetooth and confirm transport controls

Track first-session completion rate, not minutes played. Minutes played rewards a slow, unnavigable read.

\---

\#\# Linting and Validation

Run:

\`\`\`bash  
npm run lint  
npm run typecheck  
\`\`\`

Fix all errors before finishing.

\---

\#\# Communication Style

Be concise. State what changed, which files, and how to test it on a device.

No marketing language. No feature suggestions beyond defined scope.

\---

\#\# Important Constraints

\- \*\*4 screens.\*\* Onboarding, Library, Reader, Settings. No fifth screen.  
\- No account required before first value.  
\- No ElevenLabs credentials in the client.  
\- Synthesize once, cache forever.  
\- Cached documents must play offline.  
\- Development build only — never Expo Go.  
\- Pin and respect the installed NativeWind version.

\---

\#\# Verify Before Shipping

These must be checked against live documentation, never assumed:

\- package version compatibility across \`expo-pdf\`, \`expo-pdf-text-extract\`, and \`react-native-track-player\` against the chosen Expo SDK — this is the most likely source of a day-one build failure  
\- current ElevenLabs pricing and model availability  
\- font licensing terms for commercial distribution (Atkinson Hyperlegible is SIL OFL; confirm Inter and Lexend terms for your distribution)  
\- contrast ratios measured on rendered screens with the WebAIM checker  
\- App Store and Play Store background-audio declaration requirements

\---

\#\# Final Reminder

Before every feature implementation:

\- read this file  
\- follow it strictly  
\- build clean, simple, maintainable code  
\- replicate provided designs exactly  
\- protect the four-screen scope — saying no is part of the product  
\`\`\`
