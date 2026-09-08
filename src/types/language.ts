// Supported ElevenLabs models for narration synthesis.
// See AGENTS.md's Narration Language Rules — this list must be verified
// against live ElevenLabs docs before any language ships.
export type ModelId = "multilingual_v2" | "flash_v2_5" | "eleven_v3";

export interface Language {
  code: string; // BCP 47, e.g. "es-ES", "pt-BR", "ja"
  englishName: string; // "Spanish (Spain)"
  endonym: string; // "Español (España)"
  supportedModels: ModelId[];
  defaultVoiceId: string; // used for auto-assignment after Language Selection
  flag: string; // key into images.flags
  rtl?: boolean;
  available?: boolean; // default true — false shows the disabled "Not yet available" state
}
