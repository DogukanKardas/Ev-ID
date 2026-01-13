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


