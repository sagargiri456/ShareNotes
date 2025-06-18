import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getUserIdFromToken } from "@/lib/auth"; // This is imported but not used

const f = createUploadthing();

export const ourFileRouter = {
  noteUpload: f({ pdf: { maxFileSize: "8MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete", file.ufsUrl);
      // You can log or process the file here
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;