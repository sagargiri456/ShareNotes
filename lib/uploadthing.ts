import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  noteUpload: f({ pdf: { maxFileSize: "8MB" } })
    .onUploadComplete(async ({ file }) => {
      
      // You can log or process the file here
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;