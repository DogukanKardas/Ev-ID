"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useLocale } from "@/components/LocaleProvider"

export default function AppointmentSection() {
  const [appointmentUrl, setAppointmentUrl] = useState<string | null>(null)
  const { t, language } = useLocale()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "appointment_url")
        .single()

      if (data) {
        setAppointmentUrl(data.value)
      }
    }
    fetchSettings()
  }, [])

  if (!appointmentUrl) return null

  return (
    <section className="py-20 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("appointment")}</h2>
          <p className="text-white/60 mb-8">{t("appointmentSubtitle")}</p>
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-white rounded-xl px-8 py-6 text-lg"
            onClick={() => window.open(appointmentUrl, "_blank")}
          >
            <Calendar className="h-5 w-5 mr-2" />
            {t("bookAppointment")}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

