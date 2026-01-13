"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

export default function ContactFormSection() {
  const { t, language } = useLocale()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Track analytics (fire and forget, errors are non-critical)
    try {
      const { error } = await supabase.from("analytics").insert([
        {
          event_type: "contact_form_submit",
          metadata: {
            name: formData.name,
            email: formData.email,
          timestamp: new Date().toISOString(),
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

    setSubmitting(false)
    setSubmitted(true)
    setFormData({ name: "", email: "", phone: "", message: "" })

    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section className="py-20 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("contact")}</h2>
          <p className="text-white/60">{t("contactSubtitle")}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
        >
          {submitted ? (
            <div className="text-center py-8">
              <p className="text-white text-lg">
                {t("messageSent")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white">
                  {t("yourName")}
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-2"
                  placeholder={t("enterYourFullName")}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-2"
                  placeholder={t("enterYourEmail")}
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">
                  {t("phone")}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-2"
                  placeholder={t("enterYourPhone")}
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-white">
                  {t("message")}
                </Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-2 min-h-[120px]"
                  placeholder={t("enterYourMessage")}
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-secondary hover:bg-secondary/90 text-white"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? t("sending") : t("sendMessage")}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

