import { images } from "@/constants/images";
import { Language } from "@/types/language";
import { Feather } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface LanguageRowProps {
  language: Language;
  selected: boolean;
  onPress: () => void;
}

export default function LanguageRow({
  language,
  selected,
  onPress,
}: LanguageRowProps) {
  const available = language.available ?? true;
  const flagSource = images.flags[language.flag];

  return (
    <TouchableOpacity
      activeOpacity={available ? 0.7 : 1}
      onPress={available ? onPress : undefined}
      disabled={!available}
      className="rounded-2xl bg-surface"
      style={{
        minHeight: 72,
        borderWidth: selected ? 1.5 : 1,
        borderColor: selected ? "#0E4C5A" : "rgba(90, 107, 117, 0.10)",
      }}
    >
      <View className="flex-row items-center px-4 py-4 gap-3.5">
        {flagSource ? (
          <Image
            source={flagSource}
            style={{ width: 44, height: 44 }}
            resizeMode="contain"
          />
        ) : (
          <View
            className="items-center justify-center rounded-full"
            style={{ width: 44, height: 44, backgroundColor: "rgba(14, 76, 90, 0.08)" }}
          >
            <Text className="text-xs font-semibold" style={{ color: "#0E4C5A" }}>
              {language.code.split("-")[0].toUpperCase()}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text
            className="text-base font-semibold"
            style={{ color: "#14212B", opacity: available ? 1 : 0.45 }}
            numberOfLines={1}
          >
            {language.englishName}
          </Text>
          <Text
            className="text-sm mt-0.5"
            style={{
              color: "#5A6B75",
              opacity: available ? 1 : 0.45,
              textAlign: "left",
              writingDirection: "ltr",
            }}
            numberOfLines={1}
          >
            {available ? language.endonym : "Not yet available"}
          </Text>
        </View>

        {selected && (
          <View
            className="items-center justify-center rounded-full"
            style={{ width: 26, height: 26, backgroundColor: "#0E4C5A" }}
          >
            <Feather name="check" size={15} color="#FFFFFF" />
          </View>
        )}
        {!selected && available && (
          <Feather name="chevron-right" size={20} color="#9AAAB3" />
        )}
      </View>
    </TouchableOpacity>
  );
}
