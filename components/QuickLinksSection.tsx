"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Mail, Linkedin, Calendar, Globe, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocale } from "@/components/LocaleProvider"

export default function QuickLinksSection() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const { t, language } = useLocale()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["whatsapp", "phone", "email", "linkedin", "appointment_url", "website", "address"])

      if (data) {
        const settingsMap: Record<string, string> = {}
        data.forEach((item) => {
          settingsMap[item.key] = item.value
        })
        setSettings(settingsMap)
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const links = [
    {
      key: "whatsapp",
      icon: MessageCircle,
      label: "WhatsApp",
      url: settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}` : null,
      color: "bg-[#25D366]",
    },
    {
      key: "phone",
      icon: Phone,
      label: t("telefon"),
      url: settings.phone ? `tel:${settings.phone}` : null,
      color: "bg-white/10",
    },
    {
      key: "email",
      icon: Mail,
      label: t("eposta"),
      url: settings.email ? `mailto:${settings.email}` : null,
      color: "bg-white/10",
    },
    {
      key: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      url: settings.linkedin || null,
      color: "bg-white/10",
    },
    {
      key: "appointment",
      icon: Calendar,
      label: t("randevu"),
      url: settings.appointment_url || null,
      color: "bg-white/10",
    },
    {
      key: "website",
      icon: Globe,
      label: language === "en" ? "Website" : "Web Sitesi",
      url: settings.website || null,
      color: "bg-white/10",
    },
    {
      key: "address",
      icon: MapPin,
      label: language === "en" ? "Address" : "Adres",
      url: settings.address ? `https://maps.google.com/?q=${encodeURIComponent(settings.address)}` : null,
      color: "bg-white/10",
    },
  ].filter((link) => link.url)

  if (loading) {
    return (
      <section className="py-20 px-4 bg-[#0A0A0A]">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

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
          <h2 className="text-4xl font-bold text-white mb-4">{t("quickAccess")}</h2>
          <p className="text-white/60">
            {language === "en"
              ? "Quick access to our communication channels"
              : "İletişim kanallarımıza tek tıkla ulaşın"}
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {links.map((link, index) => {
            const Icon = link.icon
            return (
              <motion.div
                key={link.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Button
                  className={`w-full h-24 ${link.color} border border-white/20 text-white hover:opacity-80 rounded-2xl flex flex-col items-center justify-center gap-2 backdrop-blur-md`}
                  onClick={() => {
                    if (link.url) {
                      if (link.url.startsWith("http") || link.url.startsWith("mailto") || link.url.startsWith("tel")) {
                        window.open(link.url, "_blank")
                      } else {
                        window.location.href = link.url
                      }
                    }
                  }}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{link.label}</span>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

