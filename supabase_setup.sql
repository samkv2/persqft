-- SQL Script to create the 'team' table in Supabase
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

-- Allow public access for now
CREATE POLICY "Allow public read access on team" ON public.team FOR SELECT USING (true);
CREATE POLICY "Allow public insert on team" ON public.team FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on team" ON public.team FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on team" ON public.team FOR DELETE USING (true);

-- Insert Dummy Initial Team Data (if the table is empty)
INSERT INTO public.team (id, name, role, category, image, highlight_badge, tagline)
VALUES 
(1, 'Tony Stark', 'Founder & CEO', 'MANAGEMENT', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', 'FOUNDER & CEO', 'Architectural visionary guiding PERSQFT standards & futuristic designs.'),
(2, 'Steve Rogers', 'Co-Founder & Director', 'MANAGEMENT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', 'CO-FOUNDER', 'Directing structural integrity, ethics & project execution.'),
(3, 'Nick Fury', 'Co-Founder & Operations', 'MANAGEMENT', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop', 'CO-FOUNDER', 'Leading strategic operations and turnkey execution.'),
(4, 'Bruce Banner', 'Lead Structural Engineer', 'EMPLOYEE', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop', NULL, 'Specialist in heavy RCC foundations & load-bearing analysis.'),
(5, 'Peter Parker', 'Junior Civil Engineer', 'EMPLOYEE', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop', NULL, 'Managing site execution & high-precision structural blueprints.'),
(6, 'Natasha Romanoff', 'Project Head & Safety', 'EMPLOYEE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop', NULL, 'Overseeing site safety, compliance, and quality control.'),
(7, 'Thor Odinson', 'Heavy Machinery Head', 'EMPLOYEE', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop', NULL, 'Driving heavy site excavation, steel structures & piling.'),
(8, 'Wanda Maximoff', 'Chief Interior Architect', 'EMPLOYEE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', NULL, 'Crafting bespoke luxury interior aesthetics & spatial design.'),
(9, 'Stephen Strange', 'Spatial Design Consultant', 'EMPLOYEE', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=800&auto=format&fit=crop', NULL, 'Elevating 3D walkthroughs, lighting & dimension planning.')
ON CONFLICT (id) DO NOTHING;
