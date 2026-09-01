-- SQL Script to create the 'team' table in Supabase
-- Copy and paste this into the Supabase SQL Editor and run it

CREATE TABLE IF NOT EXISTS public.team (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('MANAGEMENT', 'EMPLOYEE')),
    image TEXT NOT NULL,
    highlight_badge TEXT,
    tagline TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since the CMS is standalone/open right now)
-- In a production environment with auth, you would restrict these
CREATE POLICY "Allow public read access on team"
    ON public.team FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert on team"
    ON public.team FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on team"
    ON public.team FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete on team"
    ON public.team FOR DELETE
    USING (true);
