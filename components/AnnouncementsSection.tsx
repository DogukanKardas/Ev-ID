"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Megaphone } from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  start_date: string
  end_date: string | null
  is_active: boolean
}

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLocale()

  useEffect(() => {
    async function fetchAnnouncements() {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("start_date", { ascending: false })
        .limit(3)

      if (data) {
        setAnnouncements(data)
      }
      setLoading(false)
    }
    fetchAnnouncements()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 bg-[#0A0A0A]">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (announcements.length === 0) return null

  return (
    <section className="py-20 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("announcements")}</h2>
          <p className="text-white/60">{t("announcementsSubtitle")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 h-full">
                <CardContent className="p-6">
                  <Megaphone className="h-8 w-8 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{announcement.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{announcement.content}</p>
                  <span className="text-secondary text-xs">{announcement.type}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

