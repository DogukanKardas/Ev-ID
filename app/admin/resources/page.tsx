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

interface Resource {
  id: string
  title: string
  description: string | null
  file_url: string
  file_type: string
  category: string | null
  is_public: boolean
  order_index: number
}

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [editing, setEditing] = useState<Resource | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
    file_type: "pdf",
    category: "",
    is_public: true,
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
    fetchResources()
  }, [router])

  async function fetchResources() {
    const { data } = await supabase
      .from("resources")
      .select("*")
      .order("order_index", { ascending: true })
    if (data) {
      setResources(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editing) {
      await supabase.from("resources").update(formData).eq("id", editing.id)
    } else {
      await supabase.from("resources").insert([formData])
    }

    setEditing(null)
    setFormData({
      title: "",
      description: "",
      file_url: "",
      file_type: "pdf",
      category: "",
      is_public: true,
      order_index: 0,
    })
    fetchResources()
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
          <h1 className="text-4xl font-bold text-white">Kaynak Yönetimi</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {editing ? "Kaynak Düzenle" : "Yeni Kaynak Ekle"}
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
                  />
                </div>
                <div>
                  <Label htmlFor="file_url" className="text-white">
                    Dosya URL
                  </Label>
                  <Input
                    id="file_url"
                    type="url"
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="file_type" className="text-white">
                    Dosya Tipi
                  </Label>
                  <select
                    id="file_type"
                    value={formData.file_type}
                    onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                    className="w-full h-10 rounded-md border border-white/20 bg-white/10 text-white px-3 mt-2"
                  >
                    <option value="pdf">PDF</option>
                    <option value="doc">DOC</option>
                    <option value="xls">XLS</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="category" className="text-white">
                    Kategori
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_public" className="text-white">
                    Halka Açık
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
            {resources.map((resource) => (
              <Card key={resource.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-white font-bold text-lg">{resource.title}</h3>
                  <p className="text-white/60 mt-2">{resource.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-secondary text-sm">{resource.category}</span>
                    <span className="text-white/40 text-sm">
                      {resource.is_public ? "Halka Açık" : "Özel"}
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


