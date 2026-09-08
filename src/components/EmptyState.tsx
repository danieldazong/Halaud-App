import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-10 gap-3">
      <View className="w-16 h-16 rounded-full bg-surfaceRaised items-center justify-center mb-2">
        <Feather name="file-plus" size={28} color="#0E4C5A" />
      </View>
      <Text className="text-ink text-lg font-semibold text-center">
        Your library is empty
      </Text>
      <Text className="text-inkMuted text-base text-center leading-relaxed">
        Import a PDF, DOCX, or TXT file to start listening.
      </Text>
    </View>
  );
}
