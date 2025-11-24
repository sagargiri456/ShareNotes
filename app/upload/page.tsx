// ✅ Upload Page
'use client';
import { useState } from "react";
import NoteUploader from "@/components/NoteUploader";
import { useRouter } from "next/navigation";

const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
const branchOptions = [
  "ALL Branch 1st Year", "CSE", "AIDS (AD)", "AIML (AL)", "AI", "AUTO", 
  "Auto & Robo", "CHEMICAL", "CIVIL", "CSBS (CB)", "CSE-DS (CD)", 
  "CSE-IOT", "CSIT", "3DAG", "IOT", "IS ( IOT-CS)", "CY", "EC", "EE", 
  "EEE", "EX", "FT", "IT", "ME", "MINING (MI)", "MM", "Robo & Mech", 
  "OTHERS", "TX"
];
const yearOptions = ["1", "2", "3", "4"];

export default function UploadPage() {
  const router = useRouter();
  const [note, setNote] = useState({ title: "", subject: "", semester: "", branch: "", year: "" });
  const [fileUrl, setFileUrl] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!fileUrl || Object.values(note).some(val => val.trim() === "")) {
      alert("Please fill all fields and upload a file before submitting.");
      return;
    }

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
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
        <input name="title" onChange={handleChange} placeholder="Title" className="border p-2 w-full" required />
        <input name="subject" onChange={handleChange} placeholder="Subject" className="border p-2 w-full" required />

        <select name="semester" onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select Semester</option>
          {semesterOptions.map(sem => <option key={sem} value={sem}>{sem}</option>)}
        </select>

        <select name="branch" onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select Branch</option>
          {branchOptions.map(branch => <option key={branch} value={branch}>{branch}</option>)}
        </select>

        <select name="year" onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select Year</option>
          {yearOptions.map(yr => <option key={yr} value={yr}>{yr}</option>)}
        </select>

        <NoteUploader setFileUrl={(url: string) => { setFileUrl(url); setFileUploaded(true); }} />

        <p className="text-sm text-green-600">{fileUploaded ? "File Uploaded ✅" : "No file uploaded yet"}</p>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          Submit
        </button>
      </form>
    </div>
  );
}
