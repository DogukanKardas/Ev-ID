"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Linkedin, Download, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useLocale } from "@/components/LocaleProvider"

export default function ActionBar() {
  const { t } = useLocale()
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["whatsapp", "phone", "linkedin", "email", "website", "address"])

      if (data) {
        const settingsMap: Record<string, string> = {}
        data.forEach((item) => {
          settingsMap[item.key] = item.value
        })
        setSettings(settingsMap)
      }
    }
    fetchSettings()

    // Track scroll for hide/show
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`
    : null
  const phoneUrl = settings.phone ? `tel:${settings.phone}` : null
  const linkedinUrl = settings.linkedin || null
  const emailUrl = settings.email ? `mailto:${settings.email}` : null

  const handleVCardDownload = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Evrentek Teknoloji
ORG:Evrentek Teknoloji
TEL;TYPE=WORK,VOICE:${settings.phone || ""}
EMAIL;TYPE=WORK:${settings.email || ""}
URL:${settings.website || ""}
ADR;TYPE=WORK:;;${settings.address || ""};;;;
END:VCARD`

    const blob = new Blob([vcard], { type: "text/vcard" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "evrentek-teknoloji.vcf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Track analytics (fire and forget)
    ;(async () => {
      try {
        const { error } = await supabase.from("analytics").insert([
          {
            event_type: "vcard_download",
            metadata: { timestamp: new Date().toISOString() },
          },
        ])
        // Silently fail analytics - ignore errors
        if (error) {
          // Analytics errors are non-critical
        }
      } catch {
        // Silently fail
      }
    })()
  }

  const trackClick = (eventType: string) => {
    // Track analytics (fire and forget)
    ;(async () => {
      try {
        const { error } = await supabase.from("analytics").insert([
          {
            event_type: eventType,
            metadata: {
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
            },
          },
        ])
        // Silently fail analytics - ignore errors
        if (error) {
          // Analytics errors are non-critical
        }
      } catch {
        // Silently fail
      }
    })()
  }

  if (!whatsappUrl && !phoneUrl && !linkedinUrl && !emailUrl) {
    return null
  }

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl flex items-center gap-2">
        {whatsappUrl && (
          <Button
            size="sm"
            className="bg-[#25D366] hover:bg-[#25D366]/90 rounded-xl"
            onClick={() => {
              trackClick("whatsapp_click")
              window.open(whatsappUrl, "_blank")
            }}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>
        )}
        {phoneUrl && (
          <Button
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
            onClick={() => {
              trackClick("phone_click")
              window.location.href = phoneUrl
            }}
          >
            <Phone className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t("ara")}</span>
          </Button>
        )}
        {linkedinUrl && (
          <Button
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
            onClick={() => {
              trackClick("linkedin_click")
              window.open(linkedinUrl, "_blank")
            }}
          >
            <Linkedin className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">LinkedIn</span>
          </Button>
        )}
        {emailUrl && (
          <Button
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
            onClick={() => {
              trackClick("email_click")
              window.location.href = emailUrl
            }}
          >
            <Mail className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t("eposta")}</span>
          </Button>
        )}
        {settings.phone && (
          <Button
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
            onClick={handleVCardDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t("rehbereKaydet")}</span>
          </Button>
        )}
      </div>
    </motion.div>
  )
}

