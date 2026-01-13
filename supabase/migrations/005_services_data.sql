-- Add multilingual support columns to services table
ALTER TABLE services
ADD COLUMN IF NOT EXISTS title_tr TEXT,
ADD COLUMN IF NOT EXISTS description_tr TEXT;

-- Insert default services based on the provided images
-- First set of services (main categories)
INSERT INTO services (title, title_tr, description, description_tr, icon_name, order_index, show_quote_button) VALUES
('Cloud Hosting Solutions', 'Bulut Barındırma Çözümleri', 'Scalable and secure cloud infrastructure solutions for your business needs', 'İşletmenizin ihtiyaçlarına yönelik ölçeklenebilir ve güvenli bulut altyapı çözümleri', 'Cloud', 1, true),
('Communications', 'İletişim Çözümleri', 'Unified communication solutions to connect your team and customers seamlessly', 'Ekibinizi ve müşterilerinizi sorunsuz bir şekilde bağlayan birleşik iletişim çözümleri', 'Phone', 2, true),
('Cyber Security', 'Siber Güvenlik', 'Comprehensive cybersecurity services to protect your digital assets and data', 'Dijital varlıklarınızı ve verilerinizi korumak için kapsamlı siber güvenlik hizmetleri', 'Shield', 3, true),
('IT Support', 'IT Destek', '24/7 IT support services to keep your systems running smoothly', 'Sistemlerinizin sorunsuz çalışması için 7/24 IT destek hizmetleri', 'Headphones', 4, true),
('Professional Services', 'Profesyonel Hizmetler', 'Expert consulting and professional services tailored to your business', 'İşletmenize özel uzman danışmanlık ve profesyonel hizmetler', 'Briefcase', 5, true),
('Software Development', 'Yazılım Geliştirme', 'Custom software development solutions to transform your business processes', 'İş süreçlerinizi dönüştürmek için özel yazılım geliştirme çözümleri', 'Code', 6, true),
('IoT Solutions', 'IoT Çözümleri', 'Internet of Things solutions to connect and automate your operations', 'Operasyonlarınızı bağlamak ve otomatikleştirmek için Nesnelerin İnterneti çözümleri', 'Wifi', 7, true)
ON CONFLICT DO NOTHING;

-- Second set of services (IT Infrastructure Management)
INSERT INTO services (title, title_tr, description, description_tr, icon_name, order_index, show_quote_button) VALUES
('360° IT Infrastructure Management', '360° IT Altyapı Yönetimi', 'Complete end-to-end IT infrastructure management and monitoring', 'Uçtan uca IT altyapı yönetimi ve izleme', 'Settings', 8, true),
('Break Fix', 'Arıza Giderme', 'Rapid response break-fix services to minimize downtime and restore operations', 'Kesinti süresini en aza indirmek ve operasyonları geri yüklemek için hızlı yanıt arıza giderme hizmetleri', 'Wrench', 9, true),
('Hardware Vendor', 'Donanım Tedarikçisi', 'Comprehensive hardware procurement and vendor management services', 'Kapsamlı donanım tedariki ve satıcı yönetimi hizmetleri', 'Server', 10, true),
('On Site Support', 'Sahada Destek', 'On-site technical support and maintenance services at your location', 'Konumunuzda saha teknik destek ve bakım hizmetleri', 'MapPin', 11, true),
('Rollouts Migrations', 'Yayılım ve Geçişler', 'Seamless system rollouts and migrations with minimal business disruption', 'Minimal iş kesintisi ile sorunsuz sistem yayılımları ve geçişleri', 'ArrowRight', 12, true),
('Storage Management', 'Depolama Yönetimi', 'Efficient storage solutions and data management services', 'Verimli depolama çözümleri ve veri yönetimi hizmetleri', 'HardDrive', 13, true),
('Ticket Management', 'Bilet Yönetimi', 'Professional IT ticket management and tracking systems', 'Profesyonel IT bilet yönetimi ve takip sistemleri', 'Ticket', 14, true)
ON CONFLICT DO NOTHING;

