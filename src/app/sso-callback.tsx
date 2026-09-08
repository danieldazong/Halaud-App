import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

// Landing spot for the browser-based OAuth redirect (Google/Facebook/Apple).
// Clerk's ClerkProvider resolves the pending SSO session from the URL as soon
// as this route mounts; RootLayout's isSignedIn check then takes over and
// routes to the signed-in stack. This route only needs to exist so the
// redirect doesn't 404 — if the handshake doesn't complete, bounce back.
export default function SSOCallback() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (router.canGoBack()) router.back();
      else router.replace("/sign-in");
    }, 8000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0E4C5A" />
    </View>
  );
}
