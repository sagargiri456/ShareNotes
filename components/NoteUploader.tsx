"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

interface Props {
  setFileUrl: (ufsUrl: string) => void;
}

export default function NoteUploader({ setFileUrl }: Props) {
  return (
    <UploadButton<OurFileRouter, "noteUpload">
      endpoint="noteUpload"
      onClientUploadComplete={(res) => {
        if (res && res[0]?.ufsUrl) {
          setFileUrl(res[0].ufsUrl);
          alert("✅ Upload complete");
        }
      }}
      onUploadError={(error) => {
        alert(`❌ Upload error: ${error.message}`);
      }}
    />
  );
}
