"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { useLocale } from "@/components/LocaleProvider"

export default function LocationSection() {
  const [address, setAddress] = useState<string | null>(null)
  const { t, language, isInternational } = useLocale()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "address")
        .single()

      if (data) {
        setAddress(data.value)
      }
    }
    fetchSettings()
  }, [])

  if (!address) return null

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`

  return (
    <section className="py-20 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            {t("ourLocation")}
          </h2>
          <p className="text-white/60 mb-8">{address}</p>
          {isInternational && (
            <p className="text-secondary text-sm mb-4">
              🌍 {t("remoteSupportWorldwide")}
            </p>
          )}
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-white rounded-xl px-8 py-6 text-lg"
            onClick={() => window.open(mapsUrl, "_blank")}
          >
            <MapPin className="h-5 w-5 mr-2" />
            {t("showOnMap")}
            <ExternalLink className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

