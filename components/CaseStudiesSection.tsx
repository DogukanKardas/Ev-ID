"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { useLocale } from "@/components/LocaleProvider"

interface CaseStudy {
  id: string
  client_name: string
  client_logo_url: string | null
  project_title: string
  project_description: string
  project_url: string | null
  order_index: number
  category?: string | null
}

interface ReferenceCategory {
  name: string
  nameEn: string
  companies: string[]
}

export default function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLocale()

  // Static references data based on the images
  const references: ReferenceCategory[] = language === "en"
    ? [
        {
          name: "Technology",
          nameEn: "Technology",
          companies: ["Apple", "Philips", "Dyson", "Hitachi"],
        },
        {
          name: "Finance & Banking",
          nameEn: "Finance & Banking",
          companies: ["HSBC", "Citibank", "Yapı Kredi", "Garanti BBVA"],
        },
        {
          name: "Aviation & Transportation",
          nameEn: "Aviation & Transportation",
          companies: ["Lufthansa", "Saudia Airlines", "THY Technic", "DHMI"],
        },
        {
          name: "Industry, Automotive & Chemicals",
          nameEn: "Industry, Automotive & Chemicals",
          companies: ["Mercedes-Benz", "3M", "Dow", "Covestro"],
        },
        {
          name: "Tourism & Hospitality",
          nameEn: "Tourism & Hospitality",
          companies: ["Marriott", "Hilton"],
        },
        {
          name: "Government & Public Sector",
          nameEn: "Government & Public Sector",
          companies: [
            "Republic of Türkiye Ministry of Health",
            "Consulate of Spain",
            "Consulate of Kuwait",
          ],
        },
      ]
    : [
        {
          name: "Teknoloji",
          nameEn: "Technology",
          companies: ["Apple", "Philips", "Dyson", "Hitachi"],
        },
        {
          name: "Finans & Bankacılık",
          nameEn: "Finance & Banking",
          companies: ["HSBC", "Citibank", "Yapı Kredi", "Garanti BBVA"],
        },
        {
          name: "Havacılık & Ulaştırma",
          nameEn: "Aviation & Transportation",
          companies: ["Lufthansa", "Saudia Airlines", "THY Technic", "DHMI"],
        },
        {
          name: "Sanayi, Otomotiv & Kimya",
          nameEn: "Industry, Automotive & Chemicals",
          companies: ["Mercedes-Benz", "3M", "Dow", "Covestro"],
        },
        {
          name: "Turizm & Konaklama",
          nameEn: "Tourism & Hospitality",
          companies: ["Marriott", "Hilton"],
        },
        {
          name: "Kamu & Devlet Sektörü",
          nameEn: "Government & Public Sector",
          companies: [
            "Türkiye Cumhuriyeti Sağlık Bakanlığı",
            "İspanya Konsolosluğu",
            "Kuveyt Konsolosluğu",
          ],
        },
      ]

  useEffect(() => {
    async function fetchCaseStudies() {
      const { data } = await supabase
        .from("case_studies")
        .select("*")
        .order("order_index", { ascending: true })
        .limit(6)

      if (data) {
        setCaseStudies(data)
      }
      setLoading(false)
    }
    fetchCaseStudies()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 bg-[#0A0A0A]">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Show references if no case studies, or show both
  const showReferences = caseStudies.length === 0 || true // Always show references

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
          <h2 className="text-4xl font-bold text-white mb-4">{t("caseStudies")}</h2>
          <p className="text-white/60">{t("caseStudiesSubtitle")}</p>
        </motion.div>

        {/* References by Category */}
        {showReferences && (
          <div className="mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {references.map((category, categoryIndex) => (
                <motion.div
                  key={category.nameEn}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/10 relative">
                    {category.name}
                    <span className="absolute left-0 bottom-0 w-2 h-2 bg-secondary rounded-full -mb-1"></span>
                  </h3>
                  <ul className="space-y-2">
                    {category.companies.map((company, companyIndex) => (
                      <li
                        key={companyIndex}
                        className="text-white/80 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-white/40"
                      >
                        {company}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Case Studies Cards (if any) */}
        {caseStudies.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {language === "en" ? "Featured Projects" : "Öne Çıkan Projeler"}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {caseStudies.map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      {caseStudy.client_logo_url && (
                        <div className="relative w-24 h-24 mb-4 mx-auto">
                          <Image
                            src={caseStudy.client_logo_url}
                            alt={caseStudy.client_name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white mb-2 text-center">
                        {caseStudy.client_name}
                      </h3>
                      <h4 className="text-lg font-semibold text-secondary mb-2 text-center">
                        {caseStudy.project_title}
                      </h4>
                      <p className="text-white/60 text-sm mb-4 line-clamp-3">
                        {caseStudy.project_description}
                      </p>
                      {caseStudy.project_url && (
                        <a
                          href={caseStudy.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-secondary hover:text-secondary/80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t("viewDetails")}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

