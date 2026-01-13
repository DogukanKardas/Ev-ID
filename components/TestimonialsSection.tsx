"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

export default function TestimonialsSection() {
  const { t, isInternational } = useLocale()
  
  // Different testimonials for international vs local
  const testimonials = isInternational
    ? [
        {
          id: 1,
          name: "John Smith",
          company: "Global Tech Corp",
          text: "Evrentek Technology provided excellent cloud solutions for our international operations. Their expertise and support are outstanding.",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          company: "International Solutions Ltd",
          text: "Professional team with deep technical knowledge. They helped us scale our infrastructure globally with great success.",
        },
        {
          id: 3,
          name: "Michael Chen",
          company: "Worldwide Enterprises",
          text: "Outstanding cybersecurity services and innovative approaches. Evrentek is our trusted partner for global projects.",
        },
      ]
    : [
        {
          id: 1,
          name: "Ahmet Yılmaz",
          company: "ABC Teknoloji",
          text: "Evrentek Teknoloji ile çalışmak harika bir deneyimdi. Profesyonel ekibi ve kaliteli hizmetleri sayesinde işlerimizi çok daha verimli hale getirdik.",
        },
        {
          id: 2,
          name: "Ayşe Demir",
          company: "XYZ Şirketi",
          text: "Teknik destek ekibi çok hızlı ve çözüm odaklı. Her sorunumuzda yanımızda oldular. Kesinlikle tavsiye ederim.",
        },
        {
          id: 3,
          name: "Mehmet Kaya",
          company: "DEF A.Ş.",
          text: "Modern çözümleri ve yenilikçi yaklaşımları ile sektörde öncü bir firma. Projelerimizde her zaman ilk tercihimiz.",
        },
      ]

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

