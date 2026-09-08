import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-ink text-2xl font-bold">Settings</Text>
        <Text className="text-inkMuted text-base text-center mt-2">
          Voice, speed, theme, and cache controls are coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
