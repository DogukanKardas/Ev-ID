"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

interface Service {
  id: string
  title: string
  title_tr?: string | null
  description: string
  description_tr?: string | null
  icon_name: string
  link_url: string | null
  video_url: string | null
  pdf_url: string | null
  show_quote_button: boolean
  order_index: number
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const { language, isInternational, locale, t } = useLocale()

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("order_index", { ascending: true })

      if (data) {
        // For now, show all services
        // In the future, you can add a 'regions' or 'is_global' column to services table
        // to filter services based on location
        setServices(data)
        
        // Track service view for analytics (fire and forget)
        ;(async () => {
          try {
            const { error } = await supabase.from("analytics").insert([
              {
                event_type: "services_viewed",
                metadata: {
                  locale: locale.country,
                  language: language,
                  is_international: isInternational,
                  service_count: data.length,
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
        })()
      }
      setLoading(false)
    }
    fetchServices()
  }, [isInternational, locale.country])

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Settings
    return IconComponent
  }

  if (loading) {
    return (
      <section id="services" className="py-20 px-4 bg-[#0A0A0A]">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-20 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("services")}</h2>
          <p className="text-white/60">{t("servicesSubtitle")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon_name)
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-secondary mb-4" />
                    <CardTitle className="text-white">
                      {language === "tr" && service.title_tr ? service.title_tr : service.title}
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      {language === "tr" && service.description_tr ? service.description_tr : service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {service.link_url && (
                        <Button
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => window.open(service.link_url!, "_blank")}
                        >
                          {t("viewDetails")}
                        </Button>
                      )}
                      {service.video_url && (
                        <Button
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => window.open(service.video_url!, "_blank")}
                        >
                          {t("watchVideo")}
                        </Button>
                      )}
                      {service.pdf_url && (
                        <Button
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => window.open(service.pdf_url!, "_blank")}
                        >
                          {t("downloadPdf")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

