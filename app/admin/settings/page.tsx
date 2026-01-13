"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
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


