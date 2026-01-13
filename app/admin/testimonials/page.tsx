"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface Testimonial {
  id: string
  name: string
  company: string
  text: string
  language: string
  location: string | null
  order_index: number
  is_active: boolean
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    text: "",
    language: "tr",
    location: "",
    order_index: 0,
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
    fetchTestimonials()
  }, [router])

  async function fetchTestimonials() {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("order_index", { ascending: true })
    if (data) {
      setTestimonials(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const submitData = {
        ...formData,
        location: formData.location.trim() || null, // Empty string'i null'a çevir
      }

      if (editing) {
        const { error } = await supabase
          .from("testimonials")
          .update(submitData)
          .eq("id", editing.id)

        if (error) {
          alert("Güncelleme hatası: " + error.message)
          console.error("Update error:", error)
          return
        }
        alert("Yorum başarıyla güncellendi!")
      } else {
        const { error } = await supabase.from("testimonials").insert([submitData])

        if (error) {
          alert("Ekleme hatası: " + error.message)
          console.error("Insert error:", error)
          return
        }
        alert("Yorum başarıyla eklendi!")
      }

      setEditing(null)
      setFormData({
        name: "",
        company: "",
        text: "",
        language: "tr",
        location: "",
        order_index: 0,
        is_active: true,
      })
      fetchTestimonials()
    } catch (error: any) {
      alert("Bir hata oluştu: " + (error?.message || "Bilinmeyen hata"))
      console.error("Submit error:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
      await supabase.from("testimonials").delete().eq("id", id)
      fetchTestimonials()
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditing(testimonial)
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      text: testimonial.text,
      language: testimonial.language,
      location: testimonial.location || "",
      order_index: testimonial.order_index,
      is_active: testimonial.is_active,
    })
    // Forma scroll yap
    setTimeout(() => {
      const formCard = document.querySelector('[data-form-card]')
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
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
          <h1 className="text-4xl font-bold text-white">Müşteri Yorumları</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20" data-form-card>
            <CardHeader>
              <CardTitle className="text-white">
                {editing ? "Yorum Düzenle" : "Yeni Yorum Ekle"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    İsim
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-white">
                    Şirket
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-white">
                    Konum (Şehir/Ülke)
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                    placeholder="Örn: İstanbul, Türkiye veya New York, USA"
                  />
                </div>
                <div>
                  <Label htmlFor="text" className="text-white">
                    Yorum
                  </Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2 min-h-[100px]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="language" className="text-white">
                    Dil
                  </Label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full mt-2 px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="order_index" className="text-white">
                    Sıra
                  </Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
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
                <div className="flex gap-2">
                  <Button type="submit">
                    {editing ? "Güncelle" : "Ekle"}
                  </Button>
                  {editing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(null)
                        setFormData({
                          name: "",
                          company: "",
                          text: "",
                          language: "tr",
                          location: "",
                          order_index: 0,
                          is_active: true,
                        })
                      }}
                    >
                      İptal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Mevcut Yorumlar</h2>
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="bg-white/10 backdrop-blur-md border-white/20"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-semibold">{testimonial.name}</p>
                        <p className="text-white/60 text-sm">{testimonial.company}</p>
                        {testimonial.location && (
                          <p className="text-white/50 text-xs mt-1">📍 {testimonial.location}</p>
                        )}
                        <p className="text-white/40 text-xs mt-1">
                          {testimonial.language === "tr" ? "Türkçe" : "English"} • Sıra: {testimonial.order_index}
                          {!testimonial.is_active && (
                            <span className="ml-2 text-red-400">• Pasif</span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-600/20 border-red-600/50 text-red-400 hover:bg-red-600/30"
                          onClick={() => handleDelete(testimonial.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm italic line-clamp-3">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              ))}
              {testimonials.length === 0 && (
                <p className="text-white/60 text-center py-8">Henüz yorum eklenmemiş.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

