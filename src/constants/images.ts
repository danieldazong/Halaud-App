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

export const images = {
  appLogo,
  onboardHero,
  googleIcon,
  facebookIcon,
  appleIcon,
};
