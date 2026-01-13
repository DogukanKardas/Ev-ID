"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Plus, Trash2, Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Employee {
  id: string
  name: string
  title: string
  linkedin_url: string | null
  image_url: string | null
  expertise_area: string | null
  direct_contact_url: string | null
  bio: string | null
  order_index: number
}

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    linkedin_url: "",
    image_url: "",
    expertise_area: "",
    direct_contact_url: "",
    bio: "",
    order_index: 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
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
    fetchEmployees()
  }, [router])

  async function fetchEmployees() {
    const { data } = await supabase
      .from("employees")
      .select("*")
      .order("order_index", { ascending: true })
    if (data) {
      setEmployees(data)
    }
    setLoading(false)
  }

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `employees/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("employee-images")
      .upload(filePath, file)

    if (uploadError) {
      alert("Resim yükleme hatası: " + uploadError.message)
      return null
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("employee-images").getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let imageUrl = formData.image_url

    if (imageFile) {
      const uploadedUrl = await handleImageUpload(imageFile)
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      }
    }

    if (editing) {
      await supabase
        .from("employees")
        .update({
          ...formData,
          image_url: imageUrl,
        })
        .eq("id", editing.id)
    } else {
      await supabase.from("employees").insert([
        {
          ...formData,
          image_url: imageUrl,
        },
      ])
    }

    setEditing(null)
    setFormData({
      name: "",
      title: "",
      linkedin_url: "",
      image_url: "",
      expertise_area: "",
      direct_contact_url: "",
      bio: "",
      order_index: 0,
    })
    setImageFile(null)
    fetchEmployees()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Silmek istediğinize emin misiniz?")) {
      await supabase.from("employees").delete().eq("id", id)
      fetchEmployees()
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditing(employee)
    setFormData({
      name: employee.name,
      title: employee.title,
      linkedin_url: employee.linkedin_url || "",
      image_url: employee.image_url || "",
      expertise_area: employee.expertise_area || "",
      direct_contact_url: employee.direct_contact_url || "",
      bio: employee.bio || "",
      order_index: employee.order_index,
    })
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
          <h1 className="text-4xl font-bold text-white">Çalışan Yönetimi</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {editing ? "Çalışan Düzenle" : "Yeni Çalışan Ekle"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Ad Soyad
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
                  <Label htmlFor="title" className="text-white">
                    Ünvan
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
                  <Label htmlFor="image" className="text-white">
                    Resim (PNG/JPEG)
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0])
                      }
                    }}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin_url" className="text-white">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="expertise_area" className="text-white">
                    Uzmanlık Alanı
                  </Label>
                  <Input
                    id="expertise_area"
                    value={formData.expertise_area}
                    onChange={(e) => setFormData({ ...formData, expertise_area: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="direct_contact_url" className="text-white">
                    Direkt İletişim URL
                  </Label>
                  <Input
                    id="direct_contact_url"
                    type="url"
                    value={formData.direct_contact_url}
                    onChange={(e) =>
                      setFormData({ ...formData, direct_contact_url: e.target.value })
                    }
                    className="bg-white/10 border-white/20 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-white">
                    Biyografi
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
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
                          title: "",
                          linkedin_url: "",
                          image_url: "",
                          expertise_area: "",
                          direct_contact_url: "",
                          bio: "",
                          order_index: 0,
                        })
                      }}
                      className="bg-white/10 border-white/20 text-white"
                    >
                      İptal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {employees.map((employee) => (
              <Card
                key={employee.id}
                className="bg-white/10 backdrop-blur-md border-white/20"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {employee.image_url && (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={employee.image_url}
                          alt={employee.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{employee.name}</h3>
                      <p className="text-white/60">{employee.title}</p>
                      {employee.expertise_area && (
                        <p className="text-secondary text-sm mt-1">{employee.expertise_area}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(employee)}
                        className="bg-white/10 border-white/20 text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(employee.id)}
                        className="bg-red-500/20 border-red-500/50 text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
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


