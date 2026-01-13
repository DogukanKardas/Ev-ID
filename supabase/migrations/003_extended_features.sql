-- Extend employees table
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS expertise_area TEXT,
ADD COLUMN IF NOT EXISTS direct_contact_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Extend services table
ALTER TABLE services
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS show_quote_button BOOLEAN DEFAULT false;

-- Extend settings table (add email, website, address)
-- These will be added via admin panel, no schema change needed

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_interest TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Policies for announcements
CREATE POLICY "Announcements are viewable by everyone" ON announcements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Announcements are manageable by authenticated users" ON announcements
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for analytics (insert only for public, full access for authenticated)
CREATE POLICY "Analytics are insertable by everyone" ON analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Analytics are viewable by authenticated users" ON analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for quote_requests
CREATE POLICY "Quote requests are insertable by everyone" ON quote_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Quote requests are viewable by authenticated users" ON quote_requests
  FOR SELECT USING (auth.role() = 'authenticated');


