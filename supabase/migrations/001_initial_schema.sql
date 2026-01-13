-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  linkedin_url TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Settings',
  link_url TEXT,
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

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policies for employees (public read, admin write)
CREATE POLICY "Employees are viewable by everyone" ON employees
  FOR SELECT USING (true);

CREATE POLICY "Employees are insertable by authenticated users" ON employees
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Employees are updatable by authenticated users" ON employees
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Employees are deletable by authenticated users" ON employees
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for services (public read, admin write)
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (true);

CREATE POLICY "Services are insertable by authenticated users" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Services are updatable by authenticated users" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Services are deletable by authenticated users" ON services
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for settings (public read, admin write)
CREATE POLICY "Settings are viewable by everyone" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Settings are insertable by authenticated users" ON settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Settings are updatable by authenticated users" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Settings are deletable by authenticated users" ON settings
  FOR DELETE USING (auth.role() = 'authenticated');


