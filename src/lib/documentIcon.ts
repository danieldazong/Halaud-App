import { images } from "@/constants/images";

export function getDocumentIcon(title: string): number {
  const extension = title.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "doc":
    case "docx":
      return images.docxIcon;
    case "txt":
      return images.txtIcon;
    case "pdf":
    default:
      return images.pdfIcon;
  }
}
