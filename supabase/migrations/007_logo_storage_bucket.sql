-- Create storage bucket for company logo
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logo', 'company-logo', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for company-logo bucket
CREATE POLICY "Company logo is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logo');

CREATE POLICY "Authenticated users can upload company logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company-logo' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update company logo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'company-logo' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete company logo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'company-logo' AND
  auth.role() = 'authenticated'
);

