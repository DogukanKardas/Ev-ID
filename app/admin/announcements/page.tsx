"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  start_date: string
  end_date: string | null
  is_active: boolean
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "general",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    is_active: true,
  })
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
    fetchAnnouncements()
  }, [router])

  async function fetchAnnouncements() {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("start_date", { ascending: false })
    if (data) {
      setAnnouncements(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      end_date: formData.end_date || null,
    }

    if (editing) {
      await supabase.from("announcements").update(submitData).eq("id", editing.id)
    } else {
      await supabase.from("announcements").insert([submitData])
    }

    setEditing(null)
    setFormData({
      title: "",
      content: "",
      type: "general",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      is_active: true,
    })
    fetchAnnouncements()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white">Duyuru Yönetimi</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {editing ? "Duyuru Düzenle" : "Yeni Duyuru Ekle"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Başlık
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content" className="text-white">
                    İçerik
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-white">
                    Tip
                  </Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-10 rounded-md border border-white/20 bg-white/10 text-white px-3 mt-2"
                  >
                    <option value="general">Genel</option>
                    <option value="award">Ödül</option>
                    <option value="partnership">Ortaklık</option>
                    <option value="event">Etkinlik</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="start_date" className="text-white">
                    Başlangıç Tarihi
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date" className="text-white">
                    Bitiş Tarihi (Opsiyonel)
                  </Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_active" className="text-white">
                    Aktif
                  </Label>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {editing ? "Güncelle" : "Ekle"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-white font-bold text-lg">{announcement.title}</h3>
                  <p className="text-white/60 mt-2">{announcement.content}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-secondary text-sm">{announcement.type}</span>
                    <span className="text-white/40 text-sm">
                      {announcement.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


