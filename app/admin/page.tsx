"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Users,
  Briefcase,
  Settings,
  BarChart3,
  Megaphone,
  FileText,
  FolderOpen,
  MessageSquare,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      // Önce session'ı kontrol et
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        // Session yoksa getUser'ı da dene
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push("/admin/login")
          return
        }
        setUser(user)
        return
      }
      
      // Session varsa user'ı set et
      if (session.user) {
        setUser(session.user)
      } else {
        router.push("/admin/login")
      }
    }
    checkUser()
  }, [router])

  const menuItems = [
    { icon: Users, title: "Çalışanlar", href: "/admin/employees", color: "text-blue-400" },
    { icon: Briefcase, title: "Hizmetler", href: "/admin/services", color: "text-green-400" },
    { icon: Settings, title: "Ayarlar", href: "/admin/settings", color: "text-yellow-400" },
    { icon: BarChart3, title: "Analitik", href: "/admin/analytics", color: "text-purple-400" },
    { icon: Megaphone, title: "Duyurular", href: "/admin/announcements", color: "text-orange-400" },
    { icon: MessageSquare, title: "Teklifler", href: "/admin/quotes", color: "text-pink-400" },
    { icon: FolderOpen, title: "Projeler", href: "/admin/case-studies", color: "text-cyan-400" },
    { icon: FileText, title: "Kaynaklar", href: "/admin/resources", color: "text-red-400" },
    { icon: Star, title: "Müşteri Yorumları", href: "/admin/testimonials", color: "text-yellow-300" },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Paneli</h1>
              <p className="text-white/60">Evrentek Teknoloji Yönetim Merkezi</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Çıkış Yap
            </Button>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <Icon className={`h-8 w-8 ${item.color} mb-2`} />
                      <CardTitle className="text-white">{item.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


