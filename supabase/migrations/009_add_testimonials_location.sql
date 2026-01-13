-- Add location column to testimonials table
ALTER TABLE testimonials
ADD COLUMN IF NOT EXISTS location TEXT;

