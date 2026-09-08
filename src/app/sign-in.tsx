import SocialButton from "@/components/SocialButton";
import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useSignIn } from "@clerk/expo";
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
  const { signIn, errors, fetchStatus } = useSignIn();

  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [verifyError, setVerifyError] = useState<string | undefined>();

  const isSubmitting = fetchStatus === "fetching";

  async function handleSignIn() {
    if (!email.trim()) return;
    setVerifyError(undefined);

    // Passwordless email OTP — sends a code and creates the sign-in attempt
    const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
    if (error) return; // errors.fields.identifier surfaces below

    setModalVisible(true);
  }

  async function handleVerify(code: string) {
    setVerifyError(undefined);
    const { error } = await signIn.emailCode.verifyCode({ code });
    if (error) {
      setVerifyError("That code didn't match. Try again.");
      return;
    }
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          setModalVisible(false);
          router.replace("/");
        },
      });
    }
  }

  async function handleResend() {
    setVerifyError(undefined);
    // Re-send without args — the sign-in attempt already exists
    await signIn.emailCode.sendCode({ emailAddress: email });
  }

  const emailError = errors?.fields?.identifier?.message;

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
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/onboarding")
            }
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
          <View style={[styles.inputWrap, !!emailError && styles.inputError]}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              className="appearance-none"
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              placeholderTextColor="#9AAAB3"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
              editable={!isSubmitting}
            />
          </View>
          {!!emailError && <Text style={styles.fieldError}>{emailError}</Text>}

          {/* ── Sign In button ───────────────────────────────── */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              isSubmitting && styles.primaryBtnDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleSignIn}
            disabled={isSubmitting}
          >
            <Text style={styles.primaryBtnText}>
              {isSubmitting ? "Sending code…" : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* ── Divider ──────────────────────────────────────── */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── Social buttons ───────────────────────────────── */}
          <SocialButton provider="oauth_google" label="Continue with Google" />
          <SocialButton provider="oauth_apple" label="Continue with Apple" />

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
        error={verifyError}
        onClose={() => setModalVisible(false)}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </SafeAreaView>
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
    borderColor: "transparent",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "rgba(90, 107, 117, 0.06)",
  },
  inputError: {
    borderColor: "#E53E3E",
  },
  inputLabel: {
    fontSize: 12,
    color: "#5A6B75",
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    fontSize: 16,
    color: "#14212B",
    padding: 0,
    outlineWidth: 0,
    outlineColor: "transparent",
    borderWidth: 0,
  },

  fieldError: {
    fontSize: 12,
    color: "#E53E3E",
    marginTop: 4,
    marginLeft: 4,
  },

  primaryBtn: {
    marginTop: 20,
    backgroundColor: "#0E4C5A",
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E2E8EC" },
  dividerText: { marginHorizontal: 12, fontSize: 13, color: "#5A6B75" },

  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 14, color: "#5A6B75" },
  footerLink: { fontSize: 14, color: "#0E4C5A", fontWeight: "600" },
});
