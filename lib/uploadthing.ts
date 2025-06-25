import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  noteUpload: f({ pdf: { maxFileSize: "100MB" } })
    .onUploadComplete(async ({ file: _file }) => {
      
      // You can log or process the file here
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;