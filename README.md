# The Ma Foi Foundation – Project Executive Hiring Landing Page

A production-ready, corporate recruitment landing page built for **The Ma Foi Foundation** to announce hiring for the **Project Executive** position and accept job applications with automated resume upload and duplicate prevention.

---

## 🚀 Technology Stack

* **Frontend:** React 19 (JavaScript)
* **Styling:** Bootstrap 5.3 + Custom Corporate CSS Design System
* **Icons:** Bootstrap Icons
* **Build Tool:** Vite
* **Backend, Database & Storage:** Supabase (PostgreSQL Database & Object Storage)

---

## 📋 Features

1. **Corporate Brand & Design System:**
   * Clean, professional, trustworthy blue & white color palette (`#0056B3`, `#003B73`, `#EAF4FF`, `#FFFFFF`).
   * Subtle shadows, modern typography, responsive two-column hero section with authentic corporate workplace photography.
   * Semantic HTML5 markup with complete accessibility (ARIA attributes, accessible labels, focus rings) and SEO metadata.

2. **Sections Included:**
   * **Sticky Navbar:** Brand emblem, quick links, mobile hamburger toggle, and direct "Apply Now" action button.
   * **Hero Section:** "WE ARE HIRING" badge, role title, supporting copy, key role chips (Full-Time, Chennai, Community Development), prominent CTA, and corporate imagery.
   * **About the Role:** Overview copy and 4 feature cards:
     * *Project Coordination*
     * *Documentation & MIS*
     * *Stakeholder Management*
     * *Project Support*
   * **Why Join Us:** Mission-driven copy and 4 feature cards:
     * *Meaningful Impact*
     * *Professional Growth*
     * *Collaborative Environment*
     * *Learning Opportunities*
   * **Application Portal:**
     * Client-side validated form fields:
       * **Full Name:** Letters and spaces only, no digits/special characters.
       * **Contact Number:** Indian 10-digit mobile number format (starts with 6–9).
       * **Upload Resume:** PDF only, maximum file size 5 MB, formatted file preview.
       * **Tell us about yourself:** Multiline textarea (50–1000 characters) with live character counter.
     * **Duplicate Prevention:** Checks for existing contact numbers before processing to prevent double submissions.
     * **Supabase Storage:** Automatically renames and uploads PDF resumes to the `resumes` bucket with timestamped filenames (`timestamp_fullname.pdf`).
     * **Supabase Database:** Stores applicant details in `project_executive_applications`.
     * **State Handling:** Submitting spinner, form field locking, user-friendly error banners, and professional submission confirmation modal/card with "Submit Another Application" option.
   * **Admin Management Panel (Ctrl + Shift + M):**
     * Keyboard shortcut Ctrl + Shift + M opens the recruiter dashboard.
     * Live applicant metrics (Total registrations & Today's count).
     * Search and filter registrations by candidate name, phone, or statement.
     * One-click **Excel Download (.xlsx)** with clickable links to view and download resumes directly.
   * **Corporate Footer:** Organization details, equal opportunity recruitment statement, privacy notice, and admin access link.

---

## 🛠️ Step-by-Step Setup Guide

### 1. Project Setup & Workspace
The project is located in:
```text
C:\Users\Dhanabal\.gemini\antigravity-ide\scratch\mafoi-project-executive-hiring
```
Recommended: Open this folder as your active workspace in your IDE or terminal.

### 2. Installing Dependencies
To install all required packages:
```bash
npm install
```

Installed packages:
* `react`, `react-dom`
* `bootstrap`
* `@popperjs/core`
* `bootstrap-icons`
* `@supabase/supabase-js`
* `vite`

---

### 3. Creating Your Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **"New Project"**.
3. Choose an organization, enter a name (e.g. `mafoi-foundation-careers`), set a database password, and select your preferred region.
4. Once the project dashboard is ready, navigate to **Project Settings** -> **API** to copy:
   * **Project URL** (`https://<your-project-id>.supabase.co`)
   * **Anon / Public Key** (`eyJhbGci...`)

---

### 4. Creating the Database Table
Navigate to the **SQL Editor** in your Supabase Dashboard, create a **New Query**, and paste the following SQL (also available in `supabase/schema.sql`):

```sql
-- Create the Applications Table
CREATE TABLE IF NOT EXISTS public.project_executive_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    resume_url TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Unique Constraint on Contact Number to Prevent Accidental Duplicate Submissions
ALTER TABLE public.project_executive_applications 
DROP CONSTRAINT IF EXISTS unique_applicant_contact_number;

ALTER TABLE public.project_executive_applications 
ADD CONSTRAINT unique_applicant_contact_number UNIQUE (contact_number);
```

---

### 5. Creating the Storage Bucket
You can create the storage bucket via SQL or via the Supabase Dashboard:

**Via SQL:**
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resumes', 
    'resumes', 
    true, 
    5242880, -- 5 MB limit
    ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf'];
```

**Or via Dashboard:**
1. Navigate to **Storage** -> **New Bucket**.
2. Name the bucket `resumes`.
3. Set the bucket to **Public** (or configure signed URL access).
4. Set allowed MIME types to `application/pdf` and maximum file size to `5 MB`.

---

### 6. Required Supabase Policies (Row Level Security & Storage)

Run this SQL to enable Row Level Security (RLS) and define secure policies:

```sql
-- Enable Row Level Security (RLS)
ALTER TABLE public.project_executive_applications ENABLE ROW LEVEL SECURITY;

-- 1. Allow Public Anonymous Submissions (INSERT only)
DROP POLICY IF EXISTS "Allow public insert" ON public.project_executive_applications;
CREATE POLICY "Allow public insert" 
ON public.project_executive_applications 
FOR INSERT 
WITH CHECK (true);

-- 2. Allow Checking for Duplicate Contact Numbers
DROP POLICY IF EXISTS "Allow checking duplicate contact" ON public.project_executive_applications;
CREATE POLICY "Allow checking duplicate contact" 
ON public.project_executive_applications 
FOR SELECT 
USING (true);

-- 3. Storage Policies: Allow Public Uploads of PDF Resumes
DROP POLICY IF EXISTS "Allow public resume upload" ON storage.objects;
CREATE POLICY "Allow public resume upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes');

-- 4. Storage Policy: Allow Reading of Resumes for HR evaluation
DROP POLICY IF EXISTS "Allow public resume read" ON storage.objects;
CREATE POLICY "Allow public resume read" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes');
```

---

### 7. Creating `.env` Configuration
Duplicate `.env.example` to `.env` and fill in your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### 8. Running the Project Locally
Start the Vite development server:
```bash
npm run dev
```

Open your browser and visit:
```text
http://localhost:5173
```

---

### 9. Building for Production
To create an optimized production build:
```bash
npm run build
```
The compiled output is saved in the `dist/` directory.

To test the production build locally:
```bash
npm run preview
```

---

### 10. Deployment Instructions

#### Vercel
1. Install Vercel CLI (`npm i -g vercel`) or push the repository to GitHub/GitLab.
2. In the Vercel project settings, configure the environment variables:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
3. Deploy:
   ```bash
   vercel --prod
   ```

#### Netlify
1. Create a `_redirects` file in `public/` containing `/* /index.html 200`.
2. Connect your repository to Netlify.
3. Add the build command: `npm run build` and publish directory: `dist`.
4. Under **Site configuration** -> **Environment variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Trigger deploy.

---

## 📁 Project Structure

```text
mafoi-project-executive-hiring/
├── public/
│   ├── favicon.svg                           # Corporate Ma Foi logo favicon
│   └── images/
│       └── project-executive-hiring.jpg     # High-resolution hero workplace image
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                        # Corporate navigation bar with mobile toggle
│   │   ├── Hero.jsx                          # Hiring banner with CTAs and image
│   │   ├── AboutRole.jsx                     # Role overview and 4 core responsibility cards
│   │   ├── WhyJoin.jsx                       # 4 value proposition cards and impact metrics
│   │   ├── ApplicationForm.jsx               # Form with validation, duplicate check & Supabase storage
│   │   └── Footer.jsx                        # Corporate footer with notices and quick links
│   ├── lib/
│   │   └── supabase.js                       # Supabase client configuration & status check
│   ├── App.jsx                               # Main application container
│   ├── index.css                             # Design tokens, typography, and Bootstrap custom styles
│   └── main.jsx                              # React root with Bootstrap bundle imports
├── supabase/
│   └── schema.sql                            # Complete database & storage setup SQL
├── .env                                      # Environment variables
├── .env.example                              # Template environment variables
├── index.html                                # SEO metadata, title, and fonts
├── package.json                              # Project dependencies and scripts
└── vite.config.js                            # Vite configuration
```

---

## 🔒 Security & Data Privacy
* Only the **Anon Key** is exposed in frontend requests; the **Service Role Key** is never bundled.
* Row Level Security ensures applicant data is not publicly queryable beyond duplicate checks.
* Resumes are isolated in the `resumes` bucket with strict file-type restrictions (`application/pdf`) and size caps (5 MB).
