"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { X } from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

interface SmartLeadFormProps {
  isOpen: boolean
  onClose: () => void
}

interface Service {
  id: string
  title: string
  title_tr?: string | null
  description: string
}

export default function SmartLeadForm({ isOpen, onClose }: SmartLeadFormProps) {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLocale()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service_interest: "",
    sub_category: "", // Dinamik alt kategori
    budget_range: "",
    timeline: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase
        .from("services")
        .select("id, title, title_tr, description")
        .order("order_index", { ascending: true })

      if (data) {
        setServices(data)
      }
      setLoading(false)
    }
    fetchServices()
  }, [])

  // Dinamik sorular - service_interest'e göre
  const getDynamicQuestions = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    if (!service) return null

    const serviceTitle = language === "tr" && service.title_tr ? service.title_tr : service.title
    const lowerTitle = serviceTitle.toLowerCase()

    // Bulut çözümleri kategorisi
    if (lowerTitle.includes("cloud") || lowerTitle.includes("bulut")) {
      return {
        question: language === "en" ? "Which cloud platform?" : "Hangi bulut platformu?",
        options: language === "en"
          ? ["Azure", "AWS", "Google Cloud", "Hybrid", "Other"]
          : ["Azure", "AWS", "Google Cloud", "Hybrid", "Diğer"],
      }
    }

    // Siber Güvenlik kategorisi
    if (lowerTitle.includes("security") || lowerTitle.includes("güvenlik") || lowerTitle.includes("cyber")) {
      return {
        question: language === "en" ? "Which security area?" : "Hangi güvenlik alanı?",
        options: language === "en"
          ? ["Cybersecurity", "Network Security", "Data Protection", "Compliance", "Other"]
          : ["Siber Güvenlik", "Ağ Güvenliği", "Veri Koruma", "Uyumluluk", "Diğer"],
      }
    }

    // Yazılım Geliştirme kategorisi
    if (lowerTitle.includes("software") || lowerTitle.includes("yazılım") || lowerTitle.includes("development")) {
      return {
        question: language === "en" ? "Which software type?" : "Hangi yazılım türü?",
        options: language === "en"
          ? ["Web Application", "Mobile Application", "API", "Integration", "Other"]
          : ["Web Uygulaması", "Mobil Uygulama", "API", "Entegrasyon", "Diğer"],
      }
    }

    // Donanım kategorisi
    if (lowerTitle.includes("hardware") || lowerTitle.includes("donanım") || lowerTitle.includes("vendor")) {
      return {
        question: language === "en" ? "Which hardware type?" : "Hangi donanım türü?",
        options: language === "en"
          ? ["Server", "Switch", "Router", "Storage", "Other"]
          : ["Sunucu", "Switch", "Router", "Storage", "Diğer"],
      }
    }

    // IT Infrastructure Management kategorisi
    if (lowerTitle.includes("infrastructure") || lowerTitle.includes("altyapı") || lowerTitle.includes("management")) {
      return {
        question: language === "en" ? "Which management area?" : "Hangi yönetim alanı?",
        options: language === "en"
          ? ["360° Management", "Break Fix", "On-Site Support", "Migrations", "Other"]
          : ["360° Yönetim", "Arıza Giderme", "Sahada Destek", "Geçişler", "Diğer"],
      }
    }

    // IT Support kategorisi
    if (lowerTitle.includes("support") || lowerTitle.includes("destek") || lowerTitle.includes("ticket")) {
      return {
        question: language === "en" ? "Which support type?" : "Hangi destek türü?",
        options: language === "en"
          ? ["24/7 Support", "On-Site Support", "Remote Support", "Ticket Management", "Other"]
          : ["7/24 Destek", "Sahada Destek", "Uzaktan Destek", "Bilet Yönetimi", "Diğer"],
      }
    }

    // Professional Services kategorisi
    if (lowerTitle.includes("professional") || lowerTitle.includes("profesyonel") || lowerTitle.includes("consulting")) {
      return {
        question: language === "en" ? "Which consulting area?" : "Hangi danışmanlık alanı?",
        options: language === "en"
          ? ["IT Strategy", "Digital Transformation", "Cloud Migration", "Security Audit", "Other"]
          : ["IT Stratejisi", "Dijital Dönüşüm", "Bulut Geçişi", "Güvenlik Denetimi", "Diğer"],
      }
    }

    // IoT Solutions kategorisi
    if (lowerTitle.includes("iot") || lowerTitle.includes("internet of things")) {
      return {
        question: language === "en" ? "Which IoT application?" : "Hangi IoT uygulaması?",
        options: language === "en"
          ? ["Industrial IoT", "Smart City", "Connected Devices", "Automation", "Other"]
          : ["Endüstriyel IoT", "Akıllı Şehir", "Bağlı Cihazlar", "Otomasyon", "Diğer"],
      }
    }

    return null
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    const { error: submitError } = await supabase.from("smart_lead_submissions").insert([
      {
        form_data: formData,
        submission_date: new Date().toISOString(),
      },
    ])

    if (submitError) {
      console.error("Error submitting form:", submitError)
      alert(language === "en" ? "An error occurred. Please try again." : "Bir hata oluştu. Lütfen tekrar deneyin.")
      setSubmitting(false)
      return
    }

    // Track analytics (fire and forget, errors are non-critical)
    try {
      const { error } = await supabase.from("analytics").insert([
        {
          event_type: "smart_lead_submit",
          metadata: {
            service_interest: formData.service_interest,
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
    setStep(1)
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      service_interest: "",
      sub_category: "",
      budget_range: "",
      timeline: "",
      message: "",
    })
    onClose()
  }

  const handleNext = () => {
    if (step === 1 && formData.service_interest) {
      setStep(2)
    } else if (step === 2) {
      // Dinamik soru varsa ve cevaplanmamışsa ilerleme
      const dynamicQ = getDynamicQuestions(formData.service_interest)
      if (dynamicQ && !formData.sub_category) {
        return // Dinamik soru cevaplanmalı
      }
      setStep(3)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">
            {language === "en" ? "Quote Form" : "Teklif Formu"}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {language === "en"
              ? "Get a customized quote according to your needs"
              : "İhtiyaçlarınıza göre özelleştirilmiş teklif alın"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 1 && (
            <>
              <div>
                <Label htmlFor="name" className="text-white">
                  {language === "en" ? "Full Name *" : "Ad Soyad *"}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white mt-2"
                  placeholder={language === "en" ? "Enter your full name" : "Adınızı ve soyadınızı girin"}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  {language === "en" ? "Email *" : "E-posta *"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/10 border-white/20 text-white mt-2"
                  placeholder={language === "en" ? "Enter your email" : "E-posta adresinizi girin"}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">
                  {language === "en" ? "Phone *" : "Telefon *"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/10 border-white/20 text-white mt-2"
                  placeholder={language === "en" ? "Enter your phone number" : "Telefon numaranızı girin"}
                  required
                />
              </div>
              <div>
                <Label htmlFor="service_interest" className="text-white">
                  {language === "en" ? "Service You Are Interested In *" : "İlgilendiğiniz Hizmet *"}
                </Label>
                {loading ? (
                  <div className="w-full h-10 rounded-md border border-white/20 bg-white/10 mt-2 flex items-center justify-center">
                    <span className="text-white/60 text-sm">
                      {language === "en" ? "Loading..." : "Yükleniyor..."}
                    </span>
                  </div>
                ) : (
                  <select
                    id="service_interest"
                    value={formData.service_interest}
                    onChange={(e) => setFormData({ ...formData, service_interest: e.target.value, sub_category: "" })}
                    className="w-full h-10 rounded-md border border-white/20 bg-white/10 text-white px-3 mt-2"
                    required
                  >
                    <option value="">
                      {language === "en" ? "Select..." : "Seçiniz..."}
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {language === "tr" && service.title_tr ? service.title_tr : service.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <Button onClick={handleNext} className="w-full" disabled={!formData.service_interest}>
                {language === "en" ? "Continue" : "Devam Et"}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Dinamik soru - service_interest'e göre */}
              {(() => {
                const dynamicQ = getDynamicQuestions(formData.service_interest)
                return dynamicQ ? (
                  <div>
                    <Label htmlFor="sub_category" className="text-white">
                      {dynamicQ.question} *
                    </Label>
                    <select
                      id="sub_category"
                      value={formData.sub_category}
                      onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                      className="w-full h-10 rounded-md border border-white/20 bg-white/10 text-white px-3 mt-2"
                      required
                    >
                      <option value="">
                        {language === "en" ? "Select..." : "Seçiniz..."}
                      </option>
                      {dynamicQ.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null
              })()}
              <div>
                <Label htmlFor="company" className="text-white">
                  {language === "en" ? "Company Name" : "Şirket Adı"}
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-white/10 border-white/20 text-white mt-2"
                  placeholder={language === "en" ? "Enter company name" : "Şirket adını girin"}
                />
              </div>
              <div>
                <Label htmlFor="budget_range" className="text-white">
                  {language === "en" ? "Budget Range" : "Bütçe Aralığı"}
                </Label>
                <select
                  id="budget_range"
                  value={formData.budget_range}
                  onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                  className="w-full h-10 rounded-md border border-white/20 bg-white/10 text-white px-3 mt-2"
                >
                  <option value="">
                    {language === "en" ? "Select..." : "Seçiniz..."}
                  </option>
                  {language === "en" ? (
                    <>
                      <option value="0-50k">$0 - $10,000</option>
                      <option value="50k-100k">$10,000 - $25,000</option>
                      <option value="100k-250k">$25,000 - $50,000</option>
                      <option value="250k+">$50,000+</option>
                    </>
                  ) : (
                    <>
                      <option value="0-50k">0 - 50.000 TL</option>
                      <option value="50k-100k">50.000 - 100.000 TL</option>
                      <option value="100k-250k">100.000 - 250.000 TL</option>
                      <option value="250k+">250.000 TL+</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <Label htmlFor="timeline" className="text-white">
                  {language === "en" ? "Timeline" : "Zaman Çizelgesi"}
                </Label>
                <select
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full h-10 rounded-md border border-white/20 bg-white/10 text-white px-3 mt-2"
                >
                  <option value="">
                    {language === "en" ? "Select..." : "Seçiniz..."}
                  </option>
                  {language === "en" ? (
                    <>
                      <option value="acil">Urgent (within 1 month)</option>
                      <option value="kisa">Short-term (1-3 months)</option>
                      <option value="orta">Medium-term (3-6 months)</option>
                      <option value="uzun">Long-term (6+ months)</option>
                    </>
                  ) : (
                    <>
                      <option value="acil">Acil (1 ay içinde)</option>
                      <option value="kisa">Kısa Vadeli (1-3 ay)</option>
                      <option value="orta">Orta Vadeli (3-6 ay)</option>
                      <option value="uzun">Uzun Vadeli (6+ ay)</option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  {language === "en" ? "Back" : "Geri"}
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  {language === "en" ? "Continue" : "Devam Et"}
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <Label htmlFor="message" className="text-white">
                  {language === "en" ? "Additional Information" : "Ek Bilgiler"}
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/10 border-white/20 text-white mt-2 min-h-[120px]"
                  placeholder={language === "en" ? "Tell us more about your needs..." : "İhtiyaçlarınız hakkında daha fazla bilgi verin..."}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  {language === "en" ? "Back" : "Geri"}
                </Button>
                <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                  {submitting
                    ? language === "en"
                      ? "Submitting..."
                      : "Gönderiliyor..."
                    : language === "en"
                    ? "Submit"
                    : "Gönder"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

