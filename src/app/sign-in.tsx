import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  function handleSignIn() {
    if (!email.trim()) return;
    setModalVisible(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Back arrow ───────────────────────────────────── */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          {/* ── Headline ─────────────────────────────────────── */}
          <Text className="text-ink text-3xl font-bold text-center mt-4">
            Welcome back
          </Text>
          <Text className="text-ink-muted text-base text-center mt-2 leading-relaxed px-4">
            Sign in to continue listening where you left off.
          </Text>

          {/* ── Hero illustration ────────────────────────────── */}
          <View className="items-center mt-6 mb-6">
            <Image
              source={images.onboardHero}
              style={styles.hero}
              resizeMode="contain"
            />
          </View>

          {/* ── Email field ──────────────────────────────────── */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              placeholderTextColor="#9AAAB3"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />
          </View>

          {/* ── Sign In button ───────────────────────────────── */}
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={handleSignIn}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </TouchableOpacity>

          {/* ── Divider ──────────────────────────────────────── */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── Social buttons ───────────────────────────────── */}
          <SocialButton label="Continue with Google" />
          <SocialButton label="Continue with Facebook" isFacebook />
          <SocialButton label="Continue with Apple" isApple />

          {/* ── Sign up link ─────────────────────────────────── */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/sign-up")}>
              <Text style={styles.footerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Verification modal ───────────────────────────────── */}
      <VerificationModal
        visible={modalVisible}
        email={email}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

// ── Social button (identical visual style to sign-up) ────────────────────────
function SocialButton({
  label,
  isFacebook,
  isApple,
}: {
  label: string;
  isFacebook?: boolean;
  isApple?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
      {isApple ? (
        <Text style={styles.appleIcon}></Text>
      ) : isFacebook ? (
        <View style={[styles.socialIconCircle, { backgroundColor: "#1877F2" }]}>
          <Text style={styles.socialIconText}>f</Text>
        </View>
      ) : (
        <View style={styles.googleIconWrap}>
          <Text style={styles.googleG}>
            <Text style={{ color: "#EA4335" }}>G</Text>
          </Text>
        </View>
      )}
      <Text style={styles.socialBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  kav: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },

  backBtn: { marginTop: 8, alignSelf: "flex-start" },
  backArrow: {
    fontSize: 36,
    color: "#14212B",
    lineHeight: 40,
    fontWeight: "300",
  },

  hero: { width: 220, height: 220 },

  inputWrap: {
    borderWidth: 1,
    borderColor: "#D1D9DF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  inputLabel: {
    fontSize: 12,
    color: "#5A6B75",
    marginBottom: 4,
    fontWeight: "500",
  },
  input: { fontSize: 16, color: "#14212B", padding: 0 },

  primaryBtn: {
    marginTop: 20,
    backgroundColor: "#0E4C5A",
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E2E8EC" },
  dividerText: { marginHorizontal: 12, fontSize: 13, color: "#5A6B75" },

  socialBtn: {
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
  socialBtnText: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
    color: "#14212B",
  },

  googleIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8EC",
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: { fontSize: 15, fontWeight: "700" },
  socialIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIconText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  appleIcon: { fontSize: 22, color: "#000000", lineHeight: 26 },

  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 14, color: "#5A6B75" },
  footerLink: { fontSize: 14, color: "#0E4C5A", fontWeight: "600" },
});
