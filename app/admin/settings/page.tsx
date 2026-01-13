"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push("/admin/login")
          return
        }
      }
    }
    checkUser()
    fetchSettings()
  }, [router])

  async function fetchSettings() {
    const { data } = await supabase.from("settings").select("key, value")
    if (data) {
      const settingsMap: Record<string, string> = {}
      data.forEach((item) => {
        settingsMap[item.key] = item.value
      })
      setSettings(settingsMap)
      // Set logo preview if logo_url exists
      if (settingsMap.logo_url) {
        setLogoPreview(settingsMap.logo_url)
      }
    }
  }

  const handleSave = async (key: string, value: string) => {
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .eq("key", key)
      .single()

    if (existing) {
      await supabase.from("settings").update({ value }).eq("key", key)
    } else {
      await supabase.from("settings").insert([{ key, value }])
    }

    setSettings({ ...settings, [key]: value })
    alert("Ayarlar kaydedildi!")
  }

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Lütfen bir resim dosyası seçin")
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan küçük olmalıdır")
        return
      }
      setLogoFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUpload = async () => {
    if (!logoFile) {
      alert("Lütfen bir logo dosyası seçin")
      return
    }

    setUploading(true)
    try {
      // Delete old logo if exists
      const oldLogoUrl = settings.logo_url
      if (oldLogoUrl) {
        try {
          // Extract path from URL - handle different URL formats
          const urlParts = oldLogoUrl.split("/")
          const pathIndex = urlParts.findIndex(part => part === "logos" || part === "company-logo")
          if (pathIndex !== -1) {
            const oldPath = urlParts.slice(pathIndex).join("/")
            await supabase.storage.from("company-logo").remove([oldPath])
          }
        } catch (error) {
          // Ignore deletion errors
          console.error("Error deleting old logo:", error)
        }
      }

      // Upload new logo - try direct upload first
      const fileExt = logoFile.name.split(".").pop()
      const fileName = `logo-${Date.now()}.${fileExt}`
      const filePath = `logos/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("company-logo")
        .upload(filePath, logoFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Upload error details:", uploadError)
        
        // More detailed error messages
        if (uploadError.message?.includes("Bucket not found") || uploadError.message?.includes("not found")) {
          alert("Logo storage bucket bulunamadı.\n\nLütfen Supabase Dashboard'da:\n1. Storage > Buckets bölümüne gidin\n2. 'company-logo' adında bir bucket oluşturun\n3. Bucket'ı public yapın\n4. RLS policies ekleyin (007_logo_storage_bucket.sql dosyasındaki policies)")
        } else if (uploadError.message?.includes("new row violates row-level security")) {
          alert("Yetki hatası: RLS (Row Level Security) policy'leri eksik olabilir.\n\nSupabase'de '007_logo_storage_bucket.sql' dosyasındaki policy'leri kontrol edin.")
        } else if (uploadError.message?.includes("JWT")) {
          alert("Kimlik doğrulama hatası. Lütfen tekrar giriş yapın.")
        } else {
          alert("Logo yükleme hatası: " + uploadError.message + "\n\nDetaylar için konsolu kontrol edin.")
        }
        setUploading(false)
        return
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("company-logo").getPublicUrl(filePath)

      // Save to settings
      await handleSave("logo_url", publicUrl)
      setLogoFile(null)
      alert("Logo başarıyla yüklendi!")
    } catch (error: any) {
      console.error("Upload exception:", error)
      alert("Logo yükleme sırasında bir hata oluştu: " + (error?.message || "Bilinmeyen hata"))
    } finally {
      setUploading(false)
    }
  }

  const handleLogoDelete = async () => {
    if (!settings.logo_url) {
      return
    }

    if (!confirm("Logoyu silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      // Delete from storage
      const logoPath = settings.logo_url.split("/").slice(-2).join("/")
      const { error: deleteError } = await supabase.storage
        .from("company-logo")
        .remove([logoPath])

      if (deleteError) {
        console.error("Error deleting logo from storage:", deleteError)
      }

      // Remove from settings
      await handleSave("logo_url", "")
      setLogoPreview(null)
      setLogoFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      alert("Logo silindi!")
    } catch (error) {
      alert("Logo silme sırasında bir hata oluştu")
      console.error(error)
    }
  }

  const settingFields = [
    { key: "company_name", label: "Şirket Adı" },
    { key: "whatsapp", label: "WhatsApp Numarası" },
    { key: "phone", label: "Telefon" },
    { key: "email", label: "E-posta" },
    { key: "linkedin", label: "LinkedIn URL" },
    { key: "website", label: "Web Sitesi URL" },
    { key: "address", label: "Adres" },
    { key: "appointment_url", label: "Randevu URL" },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white">Ayarlar</h1>
        </div>

        {/* Logo Yükleme Bölümü */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Şirket Logosu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo Preview */}
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-24 w-auto object-contain rounded-lg border border-white/20 bg-white/5 p-2"
                  />
                  {settings.logo_url && (
                    <button
                      onClick={handleLogoDelete}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      title="Logoyu Sil"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="h-24 w-24 flex items-center justify-center border border-white/20 rounded-lg bg-white/5">
                  <ImageIcon className="h-8 w-8 text-white/40" />
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="logo-upload" className="text-white mb-2 block">
                  Logo Dosyası
                </Label>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Dosya Seç
                  </Button>
                  {logoFile && (
                    <Button
                      onClick={handleLogoUpload}
                      disabled={uploading}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {uploading ? "Yükleniyor..." : "Yükle"}
                    </Button>
                  )}
                </div>
                <p className="text-white/60 text-xs mt-2">
                  PNG, JPG veya SVG formatında, maksimum 5MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">İletişim Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {settingFields.map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key} className="text-white">
                  {field.label}
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id={field.key}
                    value={settings[field.key] || ""}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    className="bg-white/10 border-white/20 text-white flex-1"
                  />
                  <Button
                    onClick={() => handleSave(field.key, settings[field.key] || "")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Kaydet
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


