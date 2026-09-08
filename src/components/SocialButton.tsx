import { images } from "@/constants/images";
import { useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────
type OAuthStrategy = "oauth_google" | "oauth_facebook" | "oauth_apple";

interface SocialButtonProps {
  provider: OAuthStrategy;
  label: string;
}

const PROVIDER_ICONS: Record<OAuthStrategy, number> = {
  oauth_google: images.googleIcon,
  oauth_facebook: images.facebookIcon,
  oauth_apple: images.appleIcon,
};

// ─── Component ───────────────────────────────────────────────────────────────
// Browser-based SSO via useSSO() — works in Expo Go and emulators without a
// dev build. Opens a browser session then returns to the app via the deep-link
// scheme ("pdfreader://") configured in app.json.

export default function SocialButton({ provider, label }: SocialButtonProps) {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(false);

  async function handlePress() {
    if (loading) return;
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: provider,
        // redirectUrl is derived automatically from the app scheme by Clerk
      });

      if (createdSessionId && setActive) {
        // Session created — activate it and navigate home
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
      // If no createdSessionId: user cancelled the browser — do nothing
    } catch (err) {
      // Surface real errors to the console; don't crash the app
      console.error("SSO error:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity
      style={styles.btn}
      activeOpacity={0.75}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#0E4C5A" style={styles.icon} />
      ) : (
        <Image
          source={PROVIDER_ICONS[provider]}
          style={styles.icon}
          resizeMode="contain"
        />
      )}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D9DF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
    color: "#14212B",
  },
});
