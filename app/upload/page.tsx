'use client';

import { useState } from "react";
import NoteUploader from "@/components/NoteUploader";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [note, setNote] = useState({
    title: "",
    subject: "",
    semester: "",
    branch: "",
    year: "",
  });

  const [fileUrl, setFileUrl] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({ ...note, fileUrl }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Note uploaded");
      router.push("/my-notes");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
        <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSave();
  }}
  className="space-y-4"
>
      <input name="title" onChange={handleChange} placeholder="Title" className="border p-2 w-full" />
      <input name="subject" onChange={handleChange} placeholder="Subject" className="border p-2 w-full" />
      <input name="semester" onChange={handleChange} placeholder="Semester" className="border p-2 w-full" />
      <input name="branch" onChange={handleChange} placeholder="Branch" className="border p-2 w-full" />
      <input name="year" onChange={handleChange} placeholder="Year" className="border p-2 w-full" />

      <NoteUploader setFileUrl={setFileUrl} />

      <button
    type="submit"
    onClick={handleSave}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Submit
  </button>
  </form>
    </div>
  );
}
