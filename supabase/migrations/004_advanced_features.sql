-- Case studies table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_logo_url TEXT,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  project_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  category TEXT,
  is_public BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Smart lead forms table (for form configuration)
CREATE TABLE IF NOT EXISTS smart_lead_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_name TEXT NOT NULL,
  form_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Smart lead submissions table
CREATE TABLE IF NOT EXISTS smart_lead_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_data JSONB NOT NULL,
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_lead_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_lead_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for case_studies
CREATE POLICY "Case studies are viewable by everyone" ON case_studies
  FOR SELECT USING (true);

CREATE POLICY "Case studies are manageable by authenticated users" ON case_studies
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for resources
CREATE POLICY "Public resources are viewable by everyone" ON resources
  FOR SELECT USING (is_public = true);

CREATE POLICY "Resources are manageable by authenticated users" ON resources
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for smart_lead_forms
CREATE POLICY "Active smart lead forms are viewable by everyone" ON smart_lead_forms
  FOR SELECT USING (is_active = true);

CREATE POLICY "Smart lead forms are manageable by authenticated users" ON smart_lead_forms
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for smart_lead_submissions
CREATE POLICY "Smart lead submissions are insertable by everyone" ON smart_lead_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Smart lead submissions are viewable by authenticated users" ON smart_lead_submissions
  FOR SELECT USING (auth.role() = 'authenticated');


