import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Top bar ────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-5 pt-2">
        {/* Logo + App name */}
        <View className="flex-row items-center gap-2">
          <Image
            source={images.appLogo}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text className="text-ink text-base font-semibold">Halaud</Text>
        </View>

        {/* Headphone badge */}
        <View style={styles.headphoneBadge}>
          {/* Headphone SVG-like icon using unicode / RN Text */}
          <Text style={styles.headphoneIcon}>🎧</Text>
        </View>
      </View>

      {/* ── Headline & Subhead ──────────────────────────────── */}
      <View className="px-6 mt-6">
        <Text className="text-ink text-3xl font-bold text-center leading-tight">
          Listen to anything you'd rather not read.
        </Text>
        <Text className="text-ink-muted text-base text-center mt-3 leading-relaxed">
          Import a PDF or document and press play.
        </Text>
      </View>

      {/* ── Hero Illustration ───────────────────────────────── */}
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={images.onboardHero}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* ── CTA Button ─────────────────────────────────────── */}
      <View className="px-5 pb-6">
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={() => router.replace("/")}
        >
          <Text className="text-white text-base font-semibold text-center">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  headphoneBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EDF4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headphoneIcon: {
    fontSize: 22,
  },
  heroImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    maxWidth: 340,
    maxHeight: 340,
  },
  ctaButton: {
    backgroundColor: "#0E4C5A",
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
