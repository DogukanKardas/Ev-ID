# 🚀 Deployment Guide - Vercel

Bu doküman, projeyi Vercel'e deploy etmek için adım adım talimatları içerir.

## 📋 Ön Gereksinimler

1. ✅ GitHub hesabı ve repository
2. ✅ Vercel hesabı (ücretsiz)
3. ✅ Supabase hesabı ve projesi

## 🔧 Adım 1: Supabase Projesi Hazırlama

1. [Supabase Dashboard](https://app.supabase.com) üzerinden yeni bir proje oluşturun
2. Proje oluşturulduktan sonra **Settings > API** bölümünden şu bilgileri alın:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 🗄️ Adım 2: Veritabanı Şemasını Oluşturma

1. Supabase Dashboard'da **SQL Editor**'ü açın
2. `database/complete_schema.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'e yapıştırın ve **Run** butonuna tıklayın
4. Tüm tablolar, politikalar ve başlangıç verileri oluşturulacaktır

✅ **Kontrol:** SQL Editor'de hata olmamalı. "Success. No rows returned" mesajı görünmelidir.

## 📦 Adım 3: GitHub'a Push

```bash
# Tüm değişiklikleri commit edin
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 🌐 Adım 4: Vercel'e Deploy

### 4.1. Vercel'e Giriş

1. [Vercel Dashboard](https://vercel.com/dashboard) üzerinden giriş yapın
2. **Add New Project** butonuna tıklayın

### 4.2. Repository Seçimi

1. GitHub hesabınızı bağlayın (ilk kez ise)
2. Repository'nizi seçin (`evid`)
3. **Import** butonuna tıklayın

### 4.3. Proje Ayarları

Vercel otomatik olarak Next.js'i algılayacaktır. Ayarlar:

- **Framework Preset:** Next.js (otomatik)
- **Root Directory:** `./` (varsayılan)
- **Build Command:** `npm run build` (otomatik)
- **Output Directory:** `.next` (otomatik)
- **Install Command:** `npm install` (otomatik)

### 4.4. Environment Variables

Vercel, Supabase entegrasyonu ile environment variables'ları otomatik olarak çeker. İki yöntem var:

#### Yöntem 1: Supabase Entegrasyonu (Önerilen) ⚡

1. Vercel Dashboard'da projenize gidin
2. **Settings** > **Integrations** bölümüne gidin
3. **Supabase** entegrasyonunu bulun ve **Add Integration** butonuna tıklayın
4. Supabase projenizi seçin ve bağlayın
5. Vercel otomatik olarak şu environment variables'ları ekleyecektir:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET`
   - Ve diğer Postgres bağlantı değişkenleri

✅ **Avantaj:** Otomatik senkronizasyon, güvenli yönetim, kolay güncelleme

#### Yöntem 2: Manuel Ekleme

Eğer Supabase entegrasyonunu kullanmak istemiyorsanız:

1. Vercel Dashboard'da projenize gidin
2. **Settings** > **Environment Variables** bölümüne gidin
3. Şu environment variables'ları manuel olarak ekleyin:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'iniz | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key'iniz | Production, Preview, Development |

**Not:** Supabase entegrasyonu kullanıyorsanız, sadece `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` yeterlidir. Diğer değişkenler otomatik olarak eklenir.

### 4.5. Deploy

1. **Deploy** butonuna tıklayın
2. Build işlemi başlayacak (2-3 dakika sürebilir)
3. Deploy tamamlandığında URL'iniz hazır olacak

## ✅ Adım 5: Kontrol ve Test

1. Vercel'den verilen URL'i açın
2. Site düzgün yükleniyor mu kontrol edin
3. Admin paneline giriş yapmayı deneyin (`/admin`)

## 🔄 Güncellemeler

Her `git push` işleminde Vercel otomatik olarak yeni bir deploy başlatır.

## 🐛 Sorun Giderme

### Build Hatası

- **Hata:** `Module not found`
- **Çözüm:** `package.json`'daki tüm bağımlılıkların yüklü olduğundan emin olun

### Environment Variables Hatası

- **Hata:** `NEXT_PUBLIC_SUPABASE_URL is not defined`
- **Çözüm:** Vercel dashboard'dan environment variables'ları kontrol edin

### Veritabanı Bağlantı Hatası

- **Hata:** Supabase bağlantı hatası
- **Çözüm:** 
  1. Supabase projenizin aktif olduğundan emin olun
  2. API keys'in doğru olduğunu kontrol edin
  3. RLS politikalarının doğru ayarlandığını kontrol edin

### Storage Bucket Hatası

- **Hata:** Image upload çalışmıyor
- **Çözüm:** `database/complete_schema.sql` dosyasının storage bucket kısmının çalıştırıldığından emin olun

## 📚 Ek Kaynaklar

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

## 🎉 Başarılı Deploy!

Projeniz artık canlıda! 🚀

