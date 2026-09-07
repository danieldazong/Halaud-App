// Images are resolved via the @/assets/* path alias (→ ./assets/*) in tsconfig.json
// eslint-disable-next-line @typescript-eslint/no-require-imports
const appLogo = require("../assets/Images/app-logo.png") as number;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const onboardHero = require("../assets/Images/onboard-hero.jpeg") as number;

export const images = {
  appLogo,
  onboardHero,
};
