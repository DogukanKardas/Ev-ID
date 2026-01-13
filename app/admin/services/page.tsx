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

interface Service {
  id: string
  title: string
  description: string
  icon_name: string
  link_url: string | null
  video_url: string | null
  pdf_url: string | null
  show_quote_button: boolean
  order_index: number
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "Settings",
    link_url: "",
    video_url: "",
    pdf_url: "",
    show_quote_button: false,
    order_index: 0,
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
    fetchServices()
  }, [router])

  async function fetchServices() {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("order_index", { ascending: true })
    if (data) {
      setServices(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editing) {
      await supabase.from("services").update(formData).eq("id", editing.id)
    } else {
      await supabase.from("services").insert([formData])
    }

    setEditing(null)
    setFormData({
      title: "",
      description: "",
      icon_name: "Settings",
      link_url: "",
      video_url: "",
      pdf_url: "",
      show_quote_button: false,
      order_index: 0,
    })
    fetchServices()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Silmek istediğinize emin misiniz?")) {
      await supabase.from("services").delete().eq("id", id)
      fetchServices()
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white">Hizmet Yönetimi</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {editing ? "Hizmet Düzenle" : "Yeni Hizmet Ekle"}
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
                  <Label htmlFor="description" className="text-white">
                    Açıklama
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon_name" className="text-white">
                    İkon Adı (Lucide React)
                  </Label>
                  <Input
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="link_url" className="text-white">
                    Link URL
                  </Label>
                  <Input
                    id="link_url"
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="video_url" className="text-white">
                    Video URL
                  </Label>
                  <Input
                    id="video_url"
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="pdf_url" className="text-white">
                    PDF URL
                  </Label>
                  <Input
                    id="pdf_url"
                    type="url"
                    value={formData.pdf_url}
                    onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show_quote_button"
                    checked={formData.show_quote_button}
                    onChange={(e) =>
                      setFormData({ ...formData, show_quote_button: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="show_quote_button" className="text-white">
                    Teklif Butonu Göster
                  </Label>
                </div>
                <div>
                  <Label htmlFor="order_index" className="text-white">
                    Sıralama
                  </Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) =>
                      setFormData({ ...formData, order_index: parseInt(e.target.value) })
                    }
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editing ? "Güncelle" : "Ekle"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{service.title}</h3>
                      <p className="text-white/60 mt-2">{service.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(service)
                          setFormData({
                            title: service.title,
                            description: service.description,
                            icon_name: service.icon_name,
                            link_url: service.link_url || "",
                            video_url: service.video_url || "",
                            pdf_url: service.pdf_url || "",
                            show_quote_button: service.show_quote_button,
                            order_index: service.order_index,
                          })
                        }}
                        className="bg-white/10 border-white/20 text-white"
                      >
                        Düzenle
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(service.id)}
                        className="bg-red-500/20 border-red-500/50 text-red-400"
                      >
                        Sil
                      </Button>
                    </div>
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


