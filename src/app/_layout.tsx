import "../../global.css";

import { useNarrationStore } from "@/store/narration";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { ActivityIndicator, LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Expected in development: EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is a pk_test_
// key until a production Clerk instance is wired up at deploy time.
LogBox.ignoreLogs([/Clerk has been loaded with development keys/]);

// Required by expo-web-browser so a pending OAuth session (opened via
// WebBrowser.openAuthSessionAsync in useSSO) resolves in place and closes
// the browser tab, instead of the redirect falling through to the OS and
// relaunching the app fresh at /sso-callback with no session state.
WebBrowser.maybeCompleteAuthSession();

// Take explicit control of the splash screen instead of relying on the
// plugin's implicit auto-hide, which can leave it stuck on iOS.
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <RootNavigator />
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}

// ─── Auth-aware navigator ────────────────────────────────────────────────────
// Clerk needs a moment to restore the cached session. We wait for isLoaded
// before making any redirect decisions to avoid the sign-in flash on cold start.

function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();
  // Presence of a saved language is this session's "completed Language
  // Selection" signal. Persisted via AsyncStorage (see store/narration.ts),
  // which loads asynchronously — narrationHasHydrated must be true before
  // trusting languageCode, or a returning user would flash the language
  // picker on every cold start while AsyncStorage is still loading.
  const hasSelectedLanguage = useNarrationStore((state) => state.languageCode !== null);
  const narrationHasHydrated = useNarrationStore((state) => state.hasHydrated);
  const isReady = isLoaded && narrationHasHydrated;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0E4C5A" />
      </View>
    );
  }

  const signedInAndReady = isSignedIn && hasSelectedLanguage;

  return (
    <Stack>
      {/* Protected tab group (Library, Settings) — only reachable once
          signed in AND language selection is complete. */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
        redirect={!signedInAndReady}
      />
      {/* First-run language picker — reached right after sign-in, before
          Library, per AGENTS.md's Onboarding → Language Selection → Library
          flow. Redirect away once signed out or already completed. */}
      <Stack.Screen
        name="language"
        options={{ headerShown: false }}
        redirect={!isSignedIn || hasSelectedLanguage}
      />
      {/* Auth screens — redirect to home when already signed in */}
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false }}
        redirect={isSignedIn}
      />
      <Stack.Screen
        name="sign-up"
        options={{ headerShown: false }}
        redirect={isSignedIn}
      />
      <Stack.Screen
        name="sign-in"
        options={{ headerShown: false }}
        redirect={isSignedIn}
      />
    </Stack>
  );
}
