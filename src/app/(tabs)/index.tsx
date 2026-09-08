import ConfirmDialog from "@/components/ConfirmDialog";
import DocumentRow from "@/components/DocumentRow";
import EmptyState from "@/components/EmptyState";
import { images } from "@/constants/images";
import { pickDocument, UnsupportedFileTypeError } from "@/lib/importDocument";
import { useLibraryStore } from "@/store/libraryStore";
import { useAuth } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Library() {
  const router = useRouter();
  const { signOut } = useAuth();
  const documents = useLibraryStore((state) => state.documents);
  const addDocument = useLibraryStore((state) => state.addDocument);
  const removeDocument = useLibraryStore((state) => state.removeDocument);

  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  async function handleImport() {
    try {
      const document = await pickDocument();
      if (document) addDocument(document);
    } catch (error) {
      if (error instanceof UnsupportedFileTypeError) {
        setImportError(error.message);
      } else {
        setImportError("Something went wrong importing that file. Try again.");
      }
    }
  }

  function handleConfirmDelete() {
    if (pendingDelete) removeDocument(pendingDelete.id);
    setPendingDelete(null);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      {/* ── Top bar ──────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-surfaceRaised">
        <View className="flex-row items-center gap-2">
          <Image
            source={images.appLogo}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
          <Text className="text-ink text-base font-bold">Halaud</Text>
        </View>

        <TouchableOpacity
          onPress={() => signOut()}
          className="w-9 h-9 rounded-full bg-accent items-center justify-center"
        >
          <Feather name="user" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Page title ───────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <View className="w-8" />
        <Text className="text-ink text-2xl font-bold">Library</Text>
        <TouchableOpacity
          onPress={() => router.navigate("/settings")}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="settings" size={22} color="#14212B" />
        </TouchableOpacity>
      </View>

      {/* ── Document list ────────────────────────────────────── */}
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 120,
          gap: 12,
          flexGrow: 1,
        }}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <TouchableOpacity
                onPress={() => setPendingDelete({ id: item.id, title: item.title })}
                style={{ backgroundColor: "#E53E3E" }}
                className="justify-center items-center px-6 rounded-2xl ml-2"
              >
                <Feather name="trash-2" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          >
            <DocumentRow document={item} />
          </Swipeable>
        )}
      />

      {/* ── Floating add button ──────────────────────────────── */}
      <TouchableOpacity
        onPress={handleImport}
        className="absolute bottom-8 right-6 w-14 h-14 rounded-full bg-accent items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Feather name="plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* ── Delete confirmation ──────────────────────────────── */}
      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Delete document?"
        message={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from your library.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      {/* ── Import error ─────────────────────────────────────── */}
      <ConfirmDialog
        visible={importError !== null}
        title="Unsupported file"
        message={importError ?? ""}
        confirmLabel="OK"
        showCancel={false}
        onConfirm={() => setImportError(null)}
        onCancel={() => setImportError(null)}
      />
    </SafeAreaView>
  );
}
