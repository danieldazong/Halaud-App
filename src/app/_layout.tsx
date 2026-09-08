import "../../global.css";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { ActivityIndicator, LogBox, View } from "react-native";

// Expected in development: EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is a pk_test_
// key until a production Clerk instance is wired up at deploy time.
LogBox.ignoreLogs([/Clerk has been loaded with development keys/]);

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootNavigator />
    </ClerkProvider>
  );
}

// ─── Auth-aware navigator ────────────────────────────────────────────────────
// Clerk needs a moment to restore the cached session. We wait for isLoaded
// before making any redirect decisions to avoid the sign-in flash on cold start.

function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0E4C5A" />
      </View>
    );
  }

  return (
    <Stack>
      {/* Protected home screen — redirect to onboarding when signed out */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
        redirect={!isSignedIn}
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
