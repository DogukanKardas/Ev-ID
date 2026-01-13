"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import { useLocale } from "@/components/LocaleProvider"

export default function HeroSection() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const { language, isInternational, t } = useLocale()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["whatsapp", "phone", "company_name", "logo_url"])

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

  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`
    : null
  const phoneUrl = settings.phone ? `tel:${settings.phone}` : null

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black pt-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto flex items-center justify-center">
                {settings.logo_url ? (
                  <img
                    src={settings.logo_url}
                    alt={settings.company_name || t("companyName")}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center shadow-2xl">
                    <span className="text-4xl md:text-5xl font-bold text-white">ET</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {settings.company_name || t("companyName")}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
          {isInternational && (
            <div className="mb-8 inline-block bg-secondary/20 border border-secondary/50 rounded-xl px-6 py-3">
              <p className="text-secondary text-sm font-medium">
                🌍 {t("globalServicesAvailable")}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {whatsappUrl && (
              <Button
                size="lg"
                className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-xl px-8 py-6 text-lg"
                onClick={() => window.open(whatsappUrl, "_blank")}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {t("contactViaWhatsapp")}
              </Button>
            )}
            {phoneUrl && (
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl px-8 py-6 text-lg"
                onClick={() => (window.location.href = phoneUrl)}
              >
                <Phone className="h-5 w-5 mr-2" />
                {t("callNow")}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="h-6 w-6 text-white/60" />
      </motion.div>
    </section>
  )
}

