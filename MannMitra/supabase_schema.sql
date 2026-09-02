-- ==============================================================================
-- Campus-Mitra & MannMitra Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Users & Accounts Table (Students, Counselors, Admins)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'counselor', 'admin')),
    title TEXT,
    department TEXT,
    student_id TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Students Risk & Profile Table
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    student_id TEXT UNIQUE,
    name TEXT NOT NULL,
    department TEXT,
    year TEXT DEFAULT '1st Year',
    priority_score NUMERIC DEFAULT 2.0,
    priority_level TEXT DEFAULT 'stable' CHECK (priority_level IN ('urgent', 'moderate', 'stable')),
    mood_trend TEXT DEFAULT 'stable' CHECK (mood_trend IN ('improving', 'stable', 'declining')),
    stress_score INT DEFAULT 3,
    sleep_hours NUMERIC DEFAULT 7.5,
    counselor_assigned TEXT DEFAULT 'Dr. Ananya Sharma',
    last_activity TEXT DEFAULT 'Just now',
    summary_note TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Multi-Turn Chatbot Conversation History Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id TEXT,
    user_name TEXT,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'mannmitra')),
    text TEXT NOT NULL,
    tier TEXT DEFAULT 'GREEN',
    emotion TEXT,
    rag_used BOOLEAN DEFAULT FALSE,
    is_crisis BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Daily Student Check-ins Table
CREATE TABLE IF NOT EXISTS public.checkins (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT,
    mood TEXT NOT NULL,
    stress INT NOT NULL,
    sleep NUMERIC NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Counselor Interventions Table
CREATE TABLE IF NOT EXISTS public.interventions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id TEXT NOT NULL,
    type TEXT NOT NULL,
    notes TEXT,
    scheduled_by TEXT,
    status TEXT DEFAULT 'Scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Policies for Demo/API Access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update students" ON public.students FOR UPDATE USING (true);

CREATE POLICY "Allow public read chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read checkins" ON public.checkins FOR SELECT USING (true);
CREATE POLICY "Allow public insert checkins" ON public.checkins FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read interventions" ON public.interventions FOR SELECT USING (true);
CREATE POLICY "Allow public insert interventions" ON public.interventions FOR INSERT WITH CHECK (true);

-- Insert Default Seed Users
INSERT INTO public.users (id, email, password, name, role, title, department, student_id, avatar)
VALUES
  ('usr-student-1', 'aarohi@campus.edu', 'student123', 'Aarohi Verma', 'student', 'Student', 'Computer Science & Engineering', 'CS2023-042', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('usr-counselor-1', 'ananya@campus.edu', 'counselor123', 'Dr. Ananya Sharma', 'counselor', 'Senior Clinical Psychologist', 'University Student Health Center', NULL, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
  ('usr-admin-1', 'dean.mehta@campus.edu', 'admin123', 'Dean Mehta', 'admin', 'Dean of Student Welfare', 'Executive Administration', NULL, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150')
ON CONFLICT (email) DO NOTHING;
