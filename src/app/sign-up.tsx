import SocialButton from "@/components/SocialButton";
import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useSignUp } from "@clerk/expo";
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
  const { signUp, errors, fetchStatus } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [verifyError, setVerifyError] = useState<string | undefined>();

  const isSubmitting = fetchStatus === "fetching";

  async function handleSignUp() {
    if (!email.trim() || !password.trim()) return;
    setVerifyError(undefined);

    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return; // errors.fields surfaces in the UI below

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) return;

    setModalVisible(true);
  }

  async function handleVerify(code: string) {
    setVerifyError(undefined);
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      setVerifyError("That code didn't match. Try again.");
      return;
    }
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return; // handle session tasks if any
        setModalVisible(false);
        router.replace("/");
      },
    });
  }

  async function handleResend() {
    setVerifyError(undefined);
    await signUp.verifications.sendEmailCode();
  }

  const emailError = errors?.fields?.emailAddress?.message;
  const passwordError = errors?.fields?.password?.message;

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
              returnKeyType="next"
              editable={!isSubmitting}
            />
          </View>
          {!!emailError && <Text style={styles.fieldError}>{emailError}</Text>}

          {/* ── Password field ───────────────────────────────── */}
          <View
            style={[
              styles.inputWrap,
              { marginTop: 12 },
              !!passwordError && styles.inputError,
            ]}
          >
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                className="appearance-none"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••"
                placeholderTextColor="#9AAAB3"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
                editable={!isSubmitting}
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
          {!!passwordError && (
            <Text style={styles.fieldError}>{passwordError}</Text>
          )}

          {/* ── Sign Up button ───────────────────────────────── */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              isSubmitting && styles.primaryBtnDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            <Text style={styles.primaryBtnText}>
              {isSubmitting ? "Creating account…" : "Sign Up"}
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

          {/* ── Log in link ──────────────────────────────────── */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text style={styles.footerLink}>Log in</Text>
            </TouchableOpacity>
          </View>

          {/* Required for Clerk bot-protection on sign-up flows */}
          <View nativeID="clerk-captcha" />
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
  passwordRow: { flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1 },
  eyeBtn: { paddingLeft: 8 },
  eyeIcon: { fontSize: 18 },

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
