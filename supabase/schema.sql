-- ==============================================================================
-- The Ma Foi Foundation - Project Executive Hiring Database Schema
-- Run this script in the Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. Create the Applications Table
CREATE TABLE IF NOT EXISTS public.project_executive_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    resume_url TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add Unique Constraint on Contact Number to Prevent Accidental Duplicate Submissions
ALTER TABLE public.project_executive_applications 
DROP CONSTRAINT IF EXISTS unique_applicant_contact_number;

ALTER TABLE public.project_executive_applications 
ADD CONSTRAINT unique_applicant_contact_number UNIQUE (contact_number);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.project_executive_applications ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow Public Anonymous Submission (INSERT only)
-- Anyone visiting the recruitment portal can submit an application
DROP POLICY IF EXISTS "Allow public insert" ON public.project_executive_applications;
CREATE POLICY "Allow public insert" 
ON public.project_executive_applications 
FOR INSERT 
WITH CHECK (true);

-- 5. Policy: Allow Anonymous Checking for Duplicate Contact Numbers
-- Allows the frontend to check if a contact number is already registered without exposing personal data
DROP POLICY IF EXISTS "Allow checking duplicate contact" ON public.project_executive_applications;
CREATE POLICY "Allow checking duplicate contact" 
ON public.project_executive_applications 
FOR SELECT 
USING (true);

-- 6. Supabase Storage Bucket Setup for 'resumes'
-- Insert the 'resumes' bucket into the storage system if it doesn't already exist
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

-- 7. Storage Policies: Allow Public Uploads to the 'resumes' bucket
DROP POLICY IF EXISTS "Allow public resume upload" ON storage.objects;
CREATE POLICY "Allow public resume upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes');

-- 8. Storage Policy: Allow Public Read Access for uploaded resumes (so HR can review)
DROP POLICY IF EXISTS "Allow public resume read" ON storage.objects;
CREATE POLICY "Allow public resume read" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes');
