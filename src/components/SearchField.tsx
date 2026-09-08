import { Feather } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchField({
  value,
  onChangeText,
  placeholder = "Search",
}: SearchFieldProps) {
  return (
    <View
      className="flex-row items-center rounded-full px-4 gap-2.5"
      style={{ height: 48, backgroundColor: "rgba(14, 76, 90, 0.06)" }}
    >
      <Feather name="search" size={19} color="#5A6B75" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#5A6B75"
        className="flex-1 text-ink text-base appearance-none"
        style={{
          paddingVertical: 0,
          outlineWidth: 0,
          outlineColor: "transparent",
          borderWidth: 0,
        }}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="x-circle" size={18} color="#5A6B75" />
        </TouchableOpacity>
      )}
    </View>
  );
}
