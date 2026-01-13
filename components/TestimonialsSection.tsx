"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

interface Testimonial {
  id: string
  name: string
  company: string
  text: string
  language: string
}

export default function TestimonialsSection() {
  const { t, language, isInternational } = useLocale()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      const currentLanguage = language || (isInternational ? "en" : "tr")
      
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .eq("language", currentLanguage)
        .order("order_index", { ascending: true })

      if (error) {
        console.error("Error fetching testimonials:", error)
        // Fallback to empty array if error
        setTestimonials([])
      } else if (data && data.length > 0) {
        setTestimonials(data)
      } else {
        // Fallback to empty array if no testimonials found
        setTestimonials([])
      }
      setLoading(false)
    }
    fetchTestimonials()
  }, [language, isInternational])

  if (loading) {
    return (
      <section id="testimonials" className="py-20 px-4 bg-[#0A0A0A]">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">{t("testimonials")}</h2>
            <p className="text-white/60">{t("testimonialsSubtitle")}</p>
          </div>
          <div className="text-center text-white/60">Yükleniyor...</div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null // Don't show section if no testimonials
  }

  return (
    <section id="testimonials" className="py-20 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("testimonials")}</h2>
          <p className="text-white/60">{t("testimonialsSubtitle")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 h-full">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-secondary mb-4" />
                  <p className="text-white/80 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-white/60 text-sm">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

