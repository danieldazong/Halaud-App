import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────
interface VerificationModalProps {
  visible: boolean;
  email: string;
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function VerificationModal({
  visible,
  email,
  onClose,
}: VerificationModalProps) {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const hasNavigated = useRef(false);

  // Reset state whenever the modal opens
  useEffect(() => {
    if (visible) {
      setCode(["", "", "", "", "", ""]);
      hasNavigated.current = false;
    }
  }, [visible]);

  // Auto-navigate when all 6 digits are filled
  useEffect(() => {
    if (code.every((d) => d !== "") && !hasNavigated.current) {
      hasNavigated.current = true;
      setTimeout(() => {
        onClose();
        router.replace("/");
      }, 150); // brief pause so user sees the last digit
    }
  }, [code, onClose, router]);

  // ── Numpad press handler ──────────────────────────────────────────────────
  function handleKey(key: string) {
    setCode((prev) => {
      const next = [...prev];
      if (key === "⌫") {
        // Find rightmost filled slot and clear it
        for (let i = 5; i >= 0; i--) {
          if (next[i] !== "") {
            next[i] = "";
            break;
          }
        }
      } else {
        // Fill leftmost empty slot
        for (let i = 0; i < 6; i++) {
          if (next[i] === "") {
            next[i] = key;
            break;
          }
        }
      }
      return next;
    });
  }

  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "⌫"],
  ];

  const maskedEmail =
    email.length > 4
      ? email.slice(0, 2) + "***" + email.slice(email.indexOf("@"))
      : email;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={Keyboard.dismiss}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : "height"}
        style={styles.kavWrapper}
        keyboardVerticalOffset={0}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.handle} />

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{" "}
            <Text style={styles.emailHighlight}>{maskedEmail}</Text>
          </Text>

          {/* Code dots display */}
          <View style={styles.dotsRow}>
            {code.map((digit, i) => (
              <View
                key={i}
                style={[styles.dotBox, digit !== "" && styles.dotBoxFilled]}
              >
                <Text style={styles.dotText}>{digit !== "" ? digit : ""}</Text>
                {digit === "" && <View style={styles.dot} />}
              </View>
            ))}
          </View>

          {/* Custom numpad — keeps modal above system keyboard */}
          <View style={styles.numpad}>
            {rows.map((row, ri) => (
              <View key={ri} style={styles.numpadRow}>
                {row.map((key, ki) =>
                  key === "" ? (
                    <View key={ki} style={styles.numpadKeyEmpty} />
                  ) : (
                    <TouchableOpacity
                      key={ki}
                      style={[
                        styles.numpadKey,
                        key === "⌫" && styles.numpadKeyBackspace,
                      ]}
                      activeOpacity={0.65}
                      onPress={() => handleKey(key)}
                    >
                      <Text
                        style={[
                          styles.numpadKeyText,
                          key === "⌫" && styles.backspaceText,
                        ]}
                      >
                        {key}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={onClose} style={styles.cancelRow}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  kavWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    paddingTop: 16,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D9DF",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#14212B",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#5A6B75",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  emailHighlight: {
    color: "#0E4C5A",
    fontWeight: "600",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 36,
  },
  dotBox: {
    width: 44,
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D1D9DF",
    backgroundColor: "#F4F7F9",
    alignItems: "center",
    justifyContent: "center",
  },
  dotBoxFilled: {
    borderColor: "#0E4C5A",
    backgroundColor: "#E8F2F4",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#9AAAB3",
  },
  dotText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0E4C5A",
  },
  numpad: {
    width: "100%",
    gap: 8,
  },
  numpadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  numpadKey: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F4F7F9",
    alignItems: "center",
    justifyContent: "center",
  },
  numpadKeyEmpty: {
    flex: 1,
    height: 56,
  },
  numpadKeyBackspace: {
    backgroundColor: "#EEF1F3",
  },
  numpadKeyText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#14212B",
  },
  backspaceText: {
    fontSize: 18,
    color: "#5A6B75",
  },
  cancelRow: {
    marginTop: 20,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    color: "#5A6B75",
    textDecorationLine: "underline",
  },
});
