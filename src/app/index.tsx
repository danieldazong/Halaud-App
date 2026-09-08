import { useAuth, useUser } from "@clerk/expo";
import { Redirect } from "expo-router";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ─── Home / Library screen ───────────────────────────────────────────────────
// This is the protected landing screen after sign-in.
// Replace the body with the real DocumentList when the library feature is built.

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0E4C5A" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>
        {user?.firstName ? `Hey, ${user.firstName} 👋` : "You're signed in!"}
      </Text>
      <Text style={styles.sub}>Your library will appear here soon.</Text>

      {/* Sign Out */}
      <TouchableOpacity
        style={styles.signOutBtn}
        activeOpacity={0.82}
        onPress={() => signOut()}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    gap: 12,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#14212B",
    textAlign: "center",
  },
  sub: {
    fontSize: 15,
    color: "#5A6B75",
    textAlign: "center",
    marginBottom: 24,
  },
  signOutBtn: {
    backgroundColor: "#0E4C5A",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: "center",
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
