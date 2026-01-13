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

interface CaseStudy {
  id: string
  client_name: string
  client_logo_url: string | null
  project_title: string
  project_description: string
  project_url: string | null
  order_index: number
}

export default function AdminCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [editing, setEditing] = useState<CaseStudy | null>(null)
  const [formData, setFormData] = useState({
    client_name: "",
    client_logo_url: "",
    project_title: "",
    project_description: "",
    project_url: "",
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
    fetchCaseStudies()
  }, [router])

  async function fetchCaseStudies() {
    const { data } = await supabase
      .from("case_studies")
      .select("*")
      .order("order_index", { ascending: true })
    if (data) {
      setCaseStudies(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editing) {
      await supabase.from("case_studies").update(formData).eq("id", editing.id)
    } else {
      await supabase.from("case_studies").insert([formData])
    }

    setEditing(null)
    setFormData({
      client_name: "",
      client_logo_url: "",
      project_title: "",
      project_description: "",
      project_url: "",
      order_index: 0,
    })
    fetchCaseStudies()
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
          <h1 className="text-4xl font-bold text-white">Proje Yönetimi</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {editing ? "Proje Düzenle" : "Yeni Proje Ekle"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="client_name" className="text-white">
                    Müşteri Adı
                  </Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client_logo_url" className="text-white">
                    Logo URL
                  </Label>
                  <Input
                    id="client_logo_url"
                    type="url"
                    value={formData.client_logo_url}
                    onChange={(e) => setFormData({ ...formData, client_logo_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="project_title" className="text-white">
                    Proje Başlığı
                  </Label>
                  <Input
                    id="project_title"
                    value={formData.project_title}
                    onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="project_description" className="text-white">
                    Proje Açıklaması
                  </Label>
                  <Textarea
                    id="project_description"
                    value={formData.project_description}
                    onChange={(e) =>
                      setFormData({ ...formData, project_description: e.target.value })
                    }
                    className="bg-white/10 border-white/20 text-white mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="project_url" className="text-white">
                    Proje URL
                  </Label>
                  <Input
                    id="project_url"
                    type="url"
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
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
            {caseStudies.map((caseStudy) => (
              <Card key={caseStudy.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-white font-bold text-lg">{caseStudy.client_name}</h3>
                  <p className="text-secondary text-sm mt-1">{caseStudy.project_title}</p>
                  <p className="text-white/60 mt-2">{caseStudy.project_description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


