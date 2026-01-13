# Evrentek Teknoloji - Digital Interaction Hub

Next.js 14 tabanlı, Supabase entegrasyonlu modern bir dijital etkileşim merkezi.

## 🚀 Özellikler

### Ana Özellikler
- ✅ **Responsive Design**: Mobil-first yaklaşım ile tüm cihazlarda mükemmel görünüm
- ✅ **Dark Theme**: Modern karanlık tema tasarımı
- ✅ **Glassmorphism**: Cam efekti ile modern UI bileşenleri
- ✅ **Framer Motion**: Yumuşak animasyonlar ve geçişler
- ✅ **Supabase Integration**: Auth, Database ve Storage entegrasyonu

### İleri Düzey Özellikler
1. **Add to Wallet**: Apple & Google Wallet kartı ekleme
2. **AI Chatbot**: Şirket verilerinizle çalışan yapay zeka asistanı
3. **Smart Lead Forms**: Dinamik, koşullu formlar
4. **Multi-Language & Geofencing**: Çoklu dil ve konum tabanlı içerik
5. **Case Studies**: İnteraktif referans logowall ve proje özetleri
6. **Resource Center**: Güvenli dosya paylaşım merkezi
7. **Analytics**: Kullanıcı etkileşim takibi

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı

### Yerel Geliştirme

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Environment değişkenlerini ayarlayın:**
`.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Veritabanı şemasını oluşturun:**
Supabase Dashboard'da SQL Editor'ü açın ve `database/complete_schema.sql` dosyasının içeriğini çalıştırın. Bu tek dosya tüm tabloları, politikaları ve başlangıç verilerini oluşturur.

4. **Development server'ı başlatın:**
```bash
npm run dev
```

5. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 🚀 Vercel'e Deploy

### Hazırlık

1. **GitHub'a push edin:**
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. **Vercel'e bağlayın:**
   - [Vercel Dashboard](https://vercel.com/dashboard) üzerinden yeni proje oluşturun
   - GitHub repository'nizi seçin
   - Framework Preset: **Next.js** olarak ayarlanmalı

3. **Environment Variables ekleyin:**
   
   **Yöntem 1 (Önerilen - Otomatik):** 
   - Vercel Dashboard'da projenize gidin
   - **Settings > Integrations** bölümünden **Supabase** entegrasyonunu ekleyin
   - Supabase projenizi seçin ve bağlayın
   - Vercel otomatik olarak tüm gerekli environment variables'ları ekler:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
     - Ve diğer Supabase/Postgres değişkenleri
   
   **Yöntem 2 (Manuel):** 
   - **Settings > Environment Variables** bölümünden manuel olarak ekleyin:
     - `NEXT_PUBLIC_SUPABASE_URL`: Supabase proje URL'iniz
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key'iniz

4. **Deploy:**
Vercel otomatik olarak deploy edecektir. İlk deploy'dan sonra:
   - Supabase Dashboard'da SQL Editor'ü açın
   - `database/complete_schema.sql` dosyasının içeriğini çalıştırın
   - Bu işlem tüm veritabanı şemasını oluşturacaktır

### Vercel Konfigürasyonu

Proje `vercel.json` dosyası ile yapılandırılmıştır:
- Framework: Next.js
- Build Command: `npm run build`
- Region: `iad1` (US East)

### Önemli Notlar

- ✅ Vercel otomatik olarak Next.js'i algılar ve build eder
- ✅ Environment variables Vercel dashboard'dan yönetilir
- ✅ Supabase veritabanı şeması manuel olarak çalıştırılmalıdır (ilk kez)
- ✅ Storage bucket'ları otomatik oluşturulur (migration içinde)

## 🗄️ Veritabanı Şeması

Tüm veritabanı şeması `database/complete_schema.sql` dosyasında bulunmaktadır. Bu dosya:
- ✅ Tüm tabloları oluşturur
- ✅ Row Level Security (RLS) politikalarını ayarlar
- ✅ Storage bucket'larını oluşturur
- ✅ Trigger'ları ekler (updated_at için)
- ✅ Başlangıç verilerini ekler (14 hizmet)

### Ana Tablolar
- `employees`: Çalışan bilgileri
- `services`: Hizmet bilgileri (Türkçe/İngilizce destekli)
- `settings`: Site ayarları

### İleri Düzey Tablolar
- `announcements`: Duyurular
- `analytics`: Analitik veriler
- `quote_requests`: Teklif talepleri
- `case_studies`: Proje referansları
- `resources`: Kaynak dosyaları
- `smart_lead_forms`: Akıllı form konfigürasyonları
- `smart_lead_submissions`: Form gönderimleri

### Storage Buckets
- `employee-images`: Çalışan fotoğrafları için public bucket

## 🔐 Admin Paneli

Admin paneline erişim: `/admin`

1. Supabase Auth ile giriş yapın
2. Dashboard'dan tüm özellikleri yönetin:
   - Çalışan yönetimi
   - Hizmet yönetimi
   - Ayarlar
   - Analitik
   - Duyurular
   - Teklif talepleri
   - Proje yönetimi
   - Kaynak yönetimi

## 🎨 Tasarım

- **Primary Color**: #002D5B (Navy Blue)
- **Secondary Color**: #00A3FF (Bright Blue)
- **Background**: #0A0A0A (Dark)
- **Glassmorphism**: backdrop-blur-md ile cam efekti

## 📱 Bileşenler

### Landing Page Bileşenleri
- `Header`: Üst navigasyon ve hızlı iletişim
- `HeroSection`: Ana hero bölümü
- `QuickLinksSection`: Hızlı erişim butonları
- `ServicesSection`: Hizmet kartları
- `TeamSection`: Ekip üyeleri
- `TestimonialsSection`: Müşteri yorumları
- `FAQSection`: Sık sorulan sorular
- `ContactFormSection`: İletişim formu
- `AppointmentSection`: Randevu bölümü
- `ActionBar`: Alt sabit aksiyon çubuğu
- `AnnouncementsSection`: Duyurular
- `LocationSection`: Konum bilgisi
- `WalletCard`: Cüzdan kartı modal
- `AIChatbot`: AI asistan
- `CaseStudiesSection`: Proje referansları
- `ResourceCenter`: Kaynak merkezi
- `SmartLeadForm`: Akıllı form

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Backend**: Supabase (Auth + PostgreSQL + Storage)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Type Safety**: TypeScript

## 📝 Notlar

- PowerShell execution policy sorunu yaşıyorsanız, CMD veya Git Bash kullanın
- `@radix-ui/react-dialog` ve `@radix-ui/react-label` paketlerini yüklemeyi unutmayın
- Supabase Storage bucket'larını oluşturduğunuzdan emin olun
- RLS (Row Level Security) politikaları migration dosyalarında tanımlıdır

## 📄 Lisans

Bu proje özel bir projedir.


# Ev-ID
