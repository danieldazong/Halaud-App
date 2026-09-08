// Images are loaded via require() so Metro can bundle them correctly.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const appLogo = require("../../assets/Images/app-logo.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardHero = require("../../assets/Images/onboard-hero.jpeg") as number;

// ── Social auth icons ─────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-require-imports
const googleIcon =
  require("../../assets/Images/icons/google-icon.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const facebookIcon =
  require("../../assets/Images/icons/Facebook-icon.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const appleIcon = require("../../assets/Images/icons/Apple-icon.png") as number;

// ── Document type icons ───────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-require-imports
const docxIcon = require("../../assets/Images/icons/DOCX-icon.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfIcon = require("../../assets/Images/icons/PDF-icon.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const txtIcon = require("../../assets/Images/icons/TXT-icon.png") as number;

// ── Language flags ────────────────────────────────────────────────────────────
// Real licensed circular flag PNGs. Any language code not listed here falls
// back to a neutral placeholder circle in LanguageRow rather than crashing.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagEnUS = require("../../assets/Images/flags/en-US.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagEsES = require("../../assets/Images/flags/es-ES.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagFrFR = require("../../assets/Images/flags/fr-FR.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagDeDE = require("../../assets/Images/flags/de-DE.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagJa = require("../../assets/Images/flags/ja.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagPtBR = require("../../assets/Images/flags/pt-BR.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagArEG = require("../../assets/Images/flags/ar-EG.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagItIT = require("../../assets/Images/flags/it-IT.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagKo = require("../../assets/Images/flags/ko.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagHi = require("../../assets/Images/flags/hi.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flagZhCN = require("../../assets/Images/flags/zh-CN.png") as number;

export const flags: Partial<Record<string, number>> = {
  "en-US": flagEnUS,
  "es-ES": flagEsES,
  "fr-FR": flagFrFR,
  "de-DE": flagDeDE,
  ja: flagJa,
  "pt-BR": flagPtBR,
  "ar-EG": flagArEG,
  "it-IT": flagItIT,
  ko: flagKo,
  hi: flagHi,
  "zh-CN": flagZhCN,
};

export const images = {
  appLogo,
  onboardHero,
  googleIcon,
  facebookIcon,
  appleIcon,
  docxIcon,
  pdfIcon,
  txtIcon,
  flags,
};
