-- ============================================
-- Complete Database Schema for Evid Project
-- ============================================
-- This file contains all database tables, policies, and initial data
-- Run this file in your Supabase SQL Editor to set up the complete database

-- ============================================
-- 1. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. TABLES
-- ============================================

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  linkedin_url TEXT,
  image_url TEXT,
  expertise_area TEXT,
  direct_contact_url TEXT,
  bio TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_tr TEXT,
  description TEXT NOT NULL,
  description_tr TEXT,
  icon_name TEXT DEFAULT 'Settings',
  link_url TEXT,
  video_url TEXT,
  pdf_url TEXT,
  show_quote_button BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Smart lead forms table
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
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'beklemede',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_lead_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_lead_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. POLICIES
-- ============================================

-- Employees policies
CREATE POLICY "Employees are viewable by everyone" ON employees
  FOR SELECT USING (true);

CREATE POLICY "Employees are insertable by authenticated users" ON employees
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Employees are updatable by authenticated users" ON employees
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Employees are deletable by authenticated users" ON employees
  FOR DELETE USING (auth.role() = 'authenticated');

-- Services policies
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (true);

CREATE POLICY "Services are insertable by authenticated users" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Services are updatable by authenticated users" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Services are deletable by authenticated users" ON services
  FOR DELETE USING (auth.role() = 'authenticated');

-- Settings policies
CREATE POLICY "Settings are viewable by everyone" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Settings are insertable by authenticated users" ON settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Settings are updatable by authenticated users" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Settings are deletable by authenticated users" ON settings
  FOR DELETE USING (auth.role() = 'authenticated');

-- Announcements policies
CREATE POLICY "Announcements are viewable by everyone" ON announcements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Announcements are manageable by authenticated users" ON announcements
  FOR ALL USING (auth.role() = 'authenticated');

-- Analytics policies
CREATE POLICY "Analytics are insertable by everyone" ON analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Analytics are viewable by authenticated users" ON analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Quote requests policies
CREATE POLICY "Quote requests are insertable by everyone" ON quote_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Quote requests are viewable by authenticated users" ON quote_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Case studies policies
CREATE POLICY "Case studies are viewable by everyone" ON case_studies
  FOR SELECT USING (true);

CREATE POLICY "Case studies are manageable by authenticated users" ON case_studies
  FOR ALL USING (auth.role() = 'authenticated');

-- Resources policies
CREATE POLICY "Public resources are viewable by everyone" ON resources
  FOR SELECT USING (is_public = true);

CREATE POLICY "Resources are manageable by authenticated users" ON resources
  FOR ALL USING (auth.role() = 'authenticated');

-- Smart lead forms policies
CREATE POLICY "Active smart lead forms are viewable by everyone" ON smart_lead_forms
  FOR SELECT USING (is_active = true);

CREATE POLICY "Smart lead forms are manageable by authenticated users" ON smart_lead_forms
  FOR ALL USING (auth.role() = 'authenticated');

-- Smart lead submissions policies
CREATE POLICY "Smart lead submissions are insertable by everyone" ON smart_lead_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Smart lead submissions are viewable by authenticated users" ON smart_lead_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Smart lead submissions are updatable by authenticated users" ON smart_lead_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Index for faster status queries
CREATE INDEX IF NOT EXISTS idx_smart_lead_submissions_status ON smart_lead_submissions(status);

-- ============================================
-- 5. STORAGE BUCKETS
-- ============================================

-- Create storage bucket for employee images
INSERT INTO storage.buckets (id, name, public)
VALUES ('employee-images', 'employee-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for employee-images bucket
CREATE POLICY "Employee images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'employee-images');

CREATE POLICY "Authenticated users can upload employee images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'employee-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update employee images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'employee-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete employee images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'employee-images' AND
  auth.role() = 'authenticated'
);

-- ============================================
-- 6. TRIGGERS (for updated_at)
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_lead_forms_updated_at BEFORE UPDATE ON smart_lead_forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. INITIAL DATA
-- ============================================

-- Insert default services
INSERT INTO services (title, title_tr, description, description_tr, icon_name, order_index, show_quote_button) VALUES
('Cloud Hosting Solutions', 'Bulut Barındırma Çözümleri', 'Scalable and secure cloud infrastructure solutions for your business needs', 'İşletmenizin ihtiyaçlarına yönelik ölçeklenebilir ve güvenli bulut altyapı çözümleri', 'Cloud', 1, true),
('Communications', 'İletişim Çözümleri', 'Unified communication solutions to connect your team and customers seamlessly', 'Ekibinizi ve müşterilerinizi sorunsuz bir şekilde bağlayan birleşik iletişim çözümleri', 'Phone', 2, true),
('Cyber Security', 'Siber Güvenlik', 'Comprehensive cybersecurity services to protect your digital assets and data', 'Dijital varlıklarınızı ve verilerinizi korumak için kapsamlı siber güvenlik hizmetleri', 'Shield', 3, true),
('IT Support', 'IT Destek', '24/7 IT support services to keep your systems running smoothly', 'Sistemlerinizin sorunsuz çalışması için 7/24 IT destek hizmetleri', 'Headphones', 4, true),
('Professional Services', 'Profesyonel Hizmetler', 'Expert consulting and professional services tailored to your business', 'İşletmenize özel uzman danışmanlık ve profesyonel hizmetler', 'Briefcase', 5, true),
('Software Development', 'Yazılım Geliştirme', 'Custom software development solutions to transform your business processes', 'İş süreçlerinizi dönüştürmek için özel yazılım geliştirme çözümleri', 'Code', 6, true),
('IoT Solutions', 'IoT Çözümleri', 'Internet of Things solutions to connect and automate your operations', 'Operasyonlarınızı bağlamak ve otomatikleştirmek için Nesnelerin İnterneti çözümleri', 'Wifi', 7, true),
('360° IT Infrastructure Management', '360° IT Altyapı Yönetimi', 'Complete end-to-end IT infrastructure management and monitoring', 'Uçtan uca IT altyapı yönetimi ve izleme', 'Settings', 8, true),
('Break Fix', 'Arıza Giderme', 'Rapid response break-fix services to minimize downtime and restore operations', 'Kesinti süresini en aza indirmek ve operasyonları geri yüklemek için hızlı yanıt arıza giderme hizmetleri', 'Wrench', 9, true),
('Hardware Vendor', 'Donanım Tedarikçisi', 'Comprehensive hardware procurement and vendor management services', 'Kapsamlı donanım tedariki ve satıcı yönetimi hizmetleri', 'Server', 10, true),
('On Site Support', 'Sahada Destek', 'On-site technical support and maintenance services at your location', 'Konumunuzda saha teknik destek ve bakım hizmetleri', 'MapPin', 11, true),
('Rollouts Migrations', 'Yayılım ve Geçişler', 'Seamless system rollouts and migrations with minimal business disruption', 'Minimal iş kesintisi ile sorunsuz sistem yayılımları ve geçişleri', 'ArrowRight', 12, true),
('Storage Management', 'Depolama Yönetimi', 'Efficient storage solutions and data management services', 'Verimli depolama çözümleri ve veri yönetimi hizmetleri', 'HardDrive', 13, true),
('Ticket Management', 'Bilet Yönetimi', 'Professional IT ticket management and tracking systems', 'Profesyonel IT bilet yönetimi ve takip sistemleri', 'Ticket', 14, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- END OF SCHEMA
-- ============================================

