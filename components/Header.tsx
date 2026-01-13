"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { MessageCircle, Phone, Linkedin, Zap, Users, MessageSquare, Menu, X, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useLocale } from "@/components/LocaleProvider"

export default function Header() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [menuOpen, setMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLocale()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["whatsapp", "phone", "linkedin", "company_name"])

      if (data) {
        const settingsMap: Record<string, string> = {}
        data.forEach((item) => {
          settingsMap[item.key] = item.value
        })
        setSettings(settingsMap)
      }
    }
    fetchSettings()
  }, [])

  // Close language menu when clicking outside
  useEffect(() => {
    if (languageMenuOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (!target.closest(".language-menu-container")) {
          setLanguageMenuOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [languageMenuOpen])

  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`
    : null
  const phoneUrl = settings.phone ? `tel:${settings.phone}` : null
  const linkedinUrl = settings.linkedin || null

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">ET</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {settings.company_name || t("companyName")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Dil Seçici */}
            <div className="relative language-menu-container">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              >
                <Languages className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{language.toUpperCase()}</span>
              </Button>
              <AnimatePresence>
                {languageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 bg-[#1A1A1A] border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <button
                      className={`w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors ${
                        language === "tr" ? "bg-secondary/20" : ""
                      }`}
                      onClick={() => {
                        setLanguage("tr")
                        setLanguageMenuOpen(false)
                      }}
                    >
                      🇹🇷 Türkçe
                    </button>
                    <button
                      className={`w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors ${
                        language === "en" ? "bg-secondary/20" : ""
                      }`}
                      onClick={() => {
                        setLanguage("en")
                        setLanguageMenuOpen(false)
                      }}
                    >
                      🇬🇧 English
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Menü Butonu */}
            <Button
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Açılır Menü */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pb-4 border-t border-white/10"
            >
            <div className="flex flex-col gap-2 pt-4">
              {/* Navigasyon Menüsü */}
              <div className="mb-2">
                <p className="text-white/60 text-xs mb-2 px-2">
                  {t("quickAccess")}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl justify-start"
                  onClick={() => {
                    const servicesSection = document.getElementById("services")
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    setMenuOpen(false)
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {t("services")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl justify-start mt-2"
                  onClick={() => {
                    const teamSection = document.getElementById("team")
                    if (teamSection) {
                      teamSection.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    setMenuOpen(false)
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t("team")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl justify-start mt-2"
                  onClick={() => {
                    const testimonialsSection = document.getElementById("testimonials")
                    if (testimonialsSection) {
                      testimonialsSection.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    setMenuOpen(false)
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t("testimonials")}
                </Button>
              </div>

              {/* İletişim Butonları */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/60 text-xs mb-2 px-2">
                  {t("contact")}
                </p>
                {whatsappUrl && (
                  <Button
                    size="sm"
                    className="w-full bg-[#25D366] hover:bg-[#25D366]/90 rounded-xl text-yellow-200 justify-start"
                    onClick={() => {
                      window.open(whatsappUrl, "_blank")
                      setMenuOpen(false)
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2 text-yellow-200" />
                    WhatsApp
                  </Button>
                )}
                {phoneUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl justify-start mt-2"
                    onClick={() => {
                      window.location.href = phoneUrl
                      setMenuOpen(false)
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {t("ara")}
                  </Button>
                )}
                {linkedinUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-yellow-200 hover:bg-white/20 rounded-xl justify-start mt-2"
                    onClick={() => {
                      window.open(linkedinUrl, "_blank")
                      setMenuOpen(false)
                    }}
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-yellow-200" />
                    LinkedIn
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

