import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-surface px-6">
      <Text className="text-ink text-2xl font-bold text-center mb-2">
        Halaud
      </Text>
      <Text className="text-ink-muted text-base text-center mb-10">
        Your AI reading companion
      </Text>

      <TouchableOpacity
        style={styles.onboardingLink}
        activeOpacity={0.8}
        onPress={() => router.push("/onboarding")}
      >
        <Text className="text-white text-sm font-semibold">
          View Onboarding
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  onboardingLink: {
    backgroundColor: "#0E4C5A",
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0E4C5A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
