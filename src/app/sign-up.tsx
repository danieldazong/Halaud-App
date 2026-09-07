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

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  function handleSignUp() {
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
            Create your account
          </Text>
          <Text className="text-ink-muted text-base text-center mt-2 leading-relaxed px-4">
            Import a PDF or document and press play.
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
              returnKeyType="next"
            />
          </View>

          {/* ── Password field ───────────────────────────────── */}
          <View style={[styles.inputWrap, { marginTop: 12 }]}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••"
                placeholderTextColor="#9AAAB3"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Sign Up button ───────────────────────────────── */}
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={handleSignUp}
          >
            <Text style={styles.primaryBtnText}>Sign Up</Text>
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

          {/* ── Log in link ──────────────────────────────────── */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text style={styles.footerLink}>Log in</Text>
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

// ── Inline social button (reused only on these two screens) ──────────────────
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
          {/* Google G — coloured segments approximated with a styled text */}
          <Text style={[styles.googleG]}>
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
  passwordRow: { flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1 },
  eyeBtn: { paddingLeft: 8 },
  eyeIcon: { fontSize: 18 },

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
