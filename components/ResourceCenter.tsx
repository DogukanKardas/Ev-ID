"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Download, FileText } from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

interface Resource {
  id: string
  title: string
  description: string | null
  file_url: string
  file_type: string
  category: string | null
  is_public: boolean
  order_index: number
}

export default function ResourceCenter() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLocale()

  useEffect(() => {
    async function fetchResources() {
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("is_public", true)
        .order("order_index", { ascending: true })

      if (data) {
        setResources(data)
      }
      setLoading(false)
    }
    fetchResources()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 bg-[#0A0A0A]">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (resources.length === 0) return null

  return (
    <section className="py-20 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("resources")}</h2>
          <p className="text-white/60">{t("resourcesSubtitle")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all h-full">
                <CardContent className="p-6 flex flex-col">
                  <FileText className="h-8 w-8 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                  {resource.description && (
                    <p className="text-white/60 text-sm mb-4 flex-1">{resource.description}</p>
                  )}
                  {resource.category && (
                    <span className="text-secondary text-xs mb-4">{resource.category}</span>
                  )}
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full"
                    onClick={() => {
                      window.open(resource.file_url, "_blank")
                      // Track analytics (fire and forget)
                      ;(async () => {
                        try {
                          const { error } = await supabase.from("analytics").insert([
                            {
                              event_type: "resource_download",
                              metadata: {
                                resource_id: resource.id,
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
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {language === "en" ? "Download" : "İndir"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

