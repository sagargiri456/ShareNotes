"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

interface Props {
  setFileUrl: (ufsUrl: string) => void;
}

export default function NoteUploader({ setFileUrl }: Props) {
  const [uploaded, setUploaded] = useState(false);

  return (
    <UploadButton<OurFileRouter, "noteUpload">
      endpoint="noteUpload"
      onClientUploadComplete={(res) => {
        if (res && res[0]?.ufsUrl) {
          setFileUrl(res[0].ufsUrl);
          setUploaded(true);
          alert("✅ Upload complete");
        }
      }}
      onUploadError={(error) => {
        alert(`❌ Upload error: ${error.message}`);
      }}
      appearance={{
        button: {
          ...(uploaded && {
            background: "linear-gradient(90deg, #22c55e, #16a34a)",
            color: "#fff",
            cursor: "not-allowed",
            opacity: 0.7,
          }),
        },
      }}
      content={{
        button: uploaded ? "Uploaded" : "Choose File",
      }}
      disabled={uploaded}
    />
  );
}
