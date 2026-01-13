"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Linkedin, Download, Mail, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocale } from "@/components/LocaleProvider"

export default function ActionBar() {
  const { t } = useLocale()
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  // Close menu when clicking outside
  useEffect(() => {
    if (isMenuOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (!target.closest(".action-bar-menu")) {
          setIsMenuOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  if (!whatsappUrl && !phoneUrl && !linkedinUrl && !emailUrl) {
    return null
  }

  interface MenuItem {
    key: string
    icon: typeof MessageCircle
    label: string
    color: string
    onClick: () => void
  }

  const menuItems: MenuItem[] = []
  
  if (whatsappUrl) {
    menuItems.push({
      key: "whatsapp",
      icon: MessageCircle,
      label: "WhatsApp",
      color: "bg-[#25D366] hover:bg-[#25D366]/90 text-white",
      onClick: () => {
        trackClick("whatsapp_click")
        window.open(whatsappUrl, "_blank")
        setIsMenuOpen(false)
      },
    })
  }
  
  if (phoneUrl) {
    menuItems.push({
      key: "phone",
      icon: Phone,
      label: t("ara"),
      color: "bg-white/10 border-white/20 text-white hover:bg-white/20",
      onClick: () => {
        trackClick("phone_click")
        window.location.href = phoneUrl
        setIsMenuOpen(false)
      },
    })
  }
  
  if (linkedinUrl) {
    menuItems.push({
      key: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      color: "bg-white/10 border-white/20 text-white hover:bg-white/20",
      onClick: () => {
        trackClick("linkedin_click")
        window.open(linkedinUrl, "_blank")
        setIsMenuOpen(false)
      },
    })
  }
  
  if (emailUrl) {
    menuItems.push({
      key: "email",
      icon: Mail,
      label: t("eposta"),
      color: "bg-white/10 border-white/20 text-white hover:bg-white/20",
      onClick: () => {
        trackClick("email_click")
        window.location.href = emailUrl
        setIsMenuOpen(false)
      },
    })
  }
  
  if (settings.phone) {
    menuItems.push({
      key: "vcard",
      icon: Download,
      label: t("rehbereKaydet"),
      color: "bg-white/10 border-white/20 text-white hover:bg-white/20",
      onClick: () => {
        handleVCardDownload()
        setIsMenuOpen(false)
      },
    })
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 action-bar-menu"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Menu Items */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      size="sm"
                      className={`w-full ${item.color} rounded-xl justify-start px-4 py-2.5`}
                      onClick={item.onClick}
                    >
                      <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm whitespace-nowrap">{item.label}</span>
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90 text-white rounded-full w-14 h-14 shadow-2xl p-0 flex items-center justify-center"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
    </motion.div>
  )
}

