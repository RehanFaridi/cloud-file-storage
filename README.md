# CloudVault: Cloud-Based File Storage System

A secure, full-stack cloud storage application built with React, Node.js/Express, Supabase, and AWS S3.

## Features
- **OAuth 2.0 Authentication**: Seamless login via Supabase Google OAuth.
- **Direct S3 Uploads**: Uses AWS S3 Pre-signed URLs for high-speed, secure uploads without straining the backend server.
- **File Versioning**: Lists and allows downloads of previous S3 object versions.
- **File Sharing**: Granular collaborator access tracking.
- **Row Level Security**: Database-enforced isolation of user assets.

## Tech Stack
- **Frontend**: React (Vite), Axios, Lucide React
- **Backend**: Node.js, Express.js, AWS SDK v3
- **Database & Auth**: Supabase (PostgreSQL + OAuth 2.0)
- **Object Storage**: Amazon Web Services (AWS S3)

## Setup Instructions

### 1. Database Setup (Supabase)
Run the SQL migration queries in the Supabase SQL editor:
\`\`\`sql
CREATE TABLE public.files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    s3_key TEXT NOT NULL,
    mime_type TEXT,
    size_bytes BIGINT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.file_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_id UUID REFERENCES public.files(id) ON DELETE CASCADE NOT NULL,
    shared_with_email TEXT NOT NULL,
    permission TEXT CHECK (permission IN ('view', 'download')) DEFAULT 'view',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
# Create .env and provide your AWS credentials & Supabase keys
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd client
npm install
# Create .env with VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_API_BASE_URL
npm run dev
\`\`\`
