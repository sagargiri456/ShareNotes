# 📚 ShareNotes

> A community-driven platform to upload, explore, and share academic notes tailored for university students.

![ShareNotes Banner](public/banner.png) <!-- Optional: Add a banner image here -->

---

## 🌐 Live Website

👉 [https://sharenotes.store](https://sharenotes.store)

---

## ✨ Features

- 🔐 **Authentication** – Secure login and logout with JWT.
- 📤 **Note Upload** – Users can upload notes categorized by Title, Subject, Semester, Branch, and Year.
- 🔍 **Explore Notes** – Browse and filter notes by course and category.
- ❤️ **Like and Comment** – Engage with notes by liking and commenting.
- 🧾 **PDF Previews** – Embedded document previews before download.
- 🧑‍🎓 **User Dashboard** – View and manage your uploaded notes.
- 🧭 **Navbar Sync** – Live update of the navbar after login/logout.
- 📁 **Categorization** – Dropdown filters for consistent data (like Branch, Year, etc.).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Auth**: JWT + Cookies
- **Database**: PostgreSQL (via Neon)
- **Upload**: UploadThing
- **PDF Preview**: Google Docs viewer (iframe)
- **Deployment**: Vercel

---
## Setup Project
1. Clone the Repository

git clone https://github.com/yourusername/sharenotes.git
cd sharenotes

2. Install Dependencies
npm install

4. Configure Environment Variables
Create a .env file in the root directory and add the following:

env

DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
📝 Replace the values with your actual credentials.

4. Run Prisma Migrations & Generate Client
npx prisma migrate dev --name init

5. Start the Development Server
npm run dev

Your app will now be running at http://localhost:3000 🎉
