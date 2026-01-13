-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  text TEXT NOT NULL,
  language TEXT DEFAULT 'tr', -- 'tr' or 'en'
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policies for testimonials (public read, admin write)
CREATE POLICY "Testimonials are viewable by everyone" ON testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Testimonials are insertable by authenticated users" ON testimonials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Testimonials are updatable by authenticated users" ON testimonials
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Testimonials are deletable by authenticated users" ON testimonials
  FOR DELETE USING (auth.role() = 'authenticated');

-- Allow authenticated users to see all testimonials (including inactive) for admin panel
CREATE POLICY "Authenticated users can view all testimonials" ON testimonials
  FOR SELECT USING (auth.role() = 'authenticated');

