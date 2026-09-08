import { Document } from "@/types/document";
import * as DocumentPicker from "expo-document-picker";

const SUPPORTED_EXTENSIONS = ["pdf", "docx", "doc", "txt"];

export class UnsupportedFileTypeError extends Error {
  constructor(fileName: string) {
    super(`"${fileName}" isn't a supported file type. Import a PDF, DOCX, or TXT file.`);
    this.name = "UnsupportedFileTypeError";
  }
}

// Opens the native file picker with no MIME filter — a multi-MIME-type filter
// makes Android's own system picker noticeably slower to search/filter on
// some devices. We validate the extension ourselves after selection instead.
// Returns null if the user cancels.
export async function pickDocument(): Promise<Document | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*",
    copyToCacheDirectory: true,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  const extension = asset.name.split(".").pop()?.toLowerCase();

  if (!extension || !SUPPORTED_EXTENSIONS.includes(extension)) {
    throw new UnsupportedFileTypeError(asset.name);
  }

  return {
    id: `${Date.now()}-${asset.name}`,
    title: asset.name,
    uri: asset.uri,
    fileSize: asset.size ?? 0,
    importedAt: Date.now(),
    progress: 0,
  };
}
