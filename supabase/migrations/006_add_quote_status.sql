-- Add status column to smart_lead_submissions table
ALTER TABLE smart_lead_submissions
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'beklemede';

-- Add updated_at column for tracking status changes
ALTER TABLE smart_lead_submissions
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add notes column for admin notes/comments
ALTER TABLE smart_lead_submissions
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_smart_lead_submissions_status ON smart_lead_submissions(status);

-- Add policy for updating submissions (authenticated users only)
CREATE POLICY "Smart lead submissions are updatable by authenticated users" ON smart_lead_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

