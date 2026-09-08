import { getDocumentIcon } from "@/lib/documentIcon";
import { formatFileSize, formatImportedDate } from "@/lib/formatDocumentMeta";
import { Document } from "@/types/document";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface DocumentRowProps {
  document: Document;
  onPress?: () => void;
}

// onPress is a no-op until the Reader screen exists to navigate to.
export default function DocumentRow({ document, onPress }: DocumentRowProps) {
  const progressPercent = Math.round(
    Math.min(1, Math.max(0, document.progress)) * 100,
  );

  return (
    <View
      className="rounded-2xl bg-surface"
      style={{
        borderWidth: 1,
        borderColor: "rgba(90, 107, 117, 0.12)",
        shadowColor: "#14212B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <TouchableOpacity
        activeOpacity={onPress ? 0.7 : 1}
        onPress={onPress}
        disabled={!onPress}
        className="rounded-2xl overflow-hidden"
      >
        <View className="flex-row items-center px-4 pt-4 pb-3.5 gap-3">
          <View className="w-14 h-14 rounded-xl bg-surfaceRaised items-center justify-center">
            <Image
              source={getDocumentIcon(document.title)}
              style={{ width: 44, height: 44 }}
              resizeMode="contain"
            />
          </View>
          <View className="flex-1">
            <Text
              className="text-ink text-base font-semibold"
              numberOfLines={1}
            >
              {document.title}
            </Text>
            <Text className="text-inkMuted text-sm mt-0.5">
              {formatFileSize(document.fileSize)} ·{" "}
              {formatImportedDate(document.importedAt)}
            </Text>
          </View>
        </View>
        {progressPercent > 0 && (
          <View className="h-1 bg-surfaceRaised w-full">
            <View
              className="h-1 bg-accent rounded-r-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
