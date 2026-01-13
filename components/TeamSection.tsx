"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Linkedin, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useLocale } from "@/components/LocaleProvider"

interface Employee {
  id: string
  name: string
  title: string
  linkedin_url: string | null
  image_url: string | null
  expertise_area: string | null
  direct_contact_url: string | null
  bio: string | null
  order_index: number
}

export default function TeamSection() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLocale()

  useEffect(() => {
    async function fetchEmployees() {
      const { data } = await supabase
        .from("employees")
        .select("*")
        .order("order_index", { ascending: true })

      if (data) {
        setEmployees(data)
      }
      setLoading(false)
    }
    fetchEmployees()
  }, [])

  if (loading) {
    return (
      <section id="team" className="py-20 px-4 bg-[#0A0A0A]">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="team" className="py-20 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("team")}</h2>
          <p className="text-white/60">{t("teamSubtitle")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative z-10">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-secondary/50 group-hover:border-secondary transition-colors">
                    {employee.image_url ? (
                      <Image
                        src={employee.image_url}
                        alt={employee.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <span className="text-4xl text-white">{employee.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-2 group-hover:text-secondary transition-colors">
                    {employee.name}
                  </h3>
                  <p className="text-white/60 text-center mb-2">{employee.title}</p>
                  {employee.expertise_area && (
                    <p className="text-secondary text-sm text-center mb-4">{employee.expertise_area}</p>
                  )}
                  {employee.bio && (
                    <p className="text-white/60 text-sm text-center mb-4 line-clamp-3">{employee.bio}</p>
                  )}
                  <div className="flex justify-center gap-2">
                    {employee.linkedin_url && (
                      <a
                        href={employee.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="h-5 w-5 text-white" />
                      </a>
                    )}
                    {employee.direct_contact_url && (
                      <a
                        href={employee.direct_contact_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-5 w-5 text-white" />
                      </a>
                    )}
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

