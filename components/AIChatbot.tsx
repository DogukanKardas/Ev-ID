"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useLocale } from "@/components/LocaleProvider"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
}

interface Service {
  title: string
  description: string
}

interface Employee {
  name: string
  title: string
  expertise_area: string | null
}

export default function AIChatbot() {
  const { language, isInternational } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    // Set initial message based on language
    setMessages([
      {
        id: "1",
        text:
          language === "en"
            ? "Hello! Welcome to Evrentek Technology. How can I help you today?"
            : "Merhaba! Evrentek Teknoloji'ye hoş geldiniz. Size nasıl yardımcı olabilirim?",
        sender: "bot",
      },
    ])
  }, [language])

  useEffect(() => {
    async function fetchCompanyData() {
      // Fetch services
      const { data: servicesData } = await supabase
        .from("services")
        .select("title, description")
        .order("order_index", { ascending: true })

      if (servicesData) {
        setServices(servicesData)
      }

      // Fetch employees
      const { data: employeesData } = await supabase
        .from("employees")
        .select("name, title, expertise_area")
        .order("order_index", { ascending: true })

      if (employeesData) {
        setEmployees(employeesData)
      }

      // Fetch settings
      const { data: settingsData } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["company_name", "appointment_url", "phone", "email"])

      if (settingsData) {
        const settingsMap: Record<string, string> = {}
        settingsData.forEach((item) => {
          settingsMap[item.key] = item.value
        })
        setSettings(settingsMap)
      }
    }
    fetchCompanyData()
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Track analytics (fire and forget, errors are non-critical)
    try {
      const { error } = await supabase.from("analytics").insert([
        {
          event_type: "chatbot_message",
          metadata: { message: input, timestamp: new Date().toISOString() },
        },
      ])
      // Silently fail analytics - ignore errors
      if (error) {
        // Analytics errors are non-critical
      }
    } catch {
      // Silently fail
    }

    // Simple rule-based responses (can be extended with AI API)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: "bot",
      }
      setMessages((prev) => [...prev, botResponse])
      setLoading(false)
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    const isEnglish = language === "en"

    // Services queries
    if (
      lowerInput.includes("hizmet") ||
      lowerInput.includes("servis") ||
      lowerInput.includes("service") ||
      lowerInput.includes("ne sunuyorsunuz") ||
      lowerInput.includes("neler yapıyorsunuz") ||
      lowerInput.includes("what do you offer") ||
      lowerInput.includes("what services")
    ) {
      if (services.length > 0) {
        const serviceList = services
          .slice(0, 5)
          .map((s) => `• ${s.title}`)
          .join("\n")
        return isEnglish
          ? `Our services:\n\n${serviceList}\n\nWould you like to view more details or speak with an expert?`
          : `Sunmuş olduğumuz hizmetler:\n\n${serviceList}\n\nDetaylı bilgi için hizmetlerimiz bölümüne bakabilir veya bir uzmanla görüşmek ister misiniz?`
      }
      return isEnglish
        ? "We offer cloud solutions, cybersecurity, software development, and consulting services. Please check our services section for more details."
        : "Bulut çözümleri, siber güvenlik, yazılım geliştirme ve danışmanlık hizmetleri sunuyoruz. Detaylı bilgi için hizmetlerimiz bölümüne bakabilirsiniz."
    }

    // Specific service queries
    if (lowerInput.includes("bulut") || lowerInput.includes("cloud")) {
      const cloudServices = services.filter(
        (s) =>
          s.title.toLowerCase().includes("bulut") ||
          s.description.toLowerCase().includes("bulut") ||
          s.title.toLowerCase().includes("cloud") ||
          s.description.toLowerCase().includes("cloud")
      )
      if (cloudServices.length > 0) {
        const serviceList = cloudServices.map((s) => `• ${s.title}: ${s.description}`).join("\n")
        return isEnglish
          ? `Our cloud solutions:\n${serviceList}\n\nWould you like to speak with an expert?`
          : `Bulut çözümlerimiz:\n${serviceList}\n\nBir uzmanla görüşmek ister misiniz?`
      }
    }

    if (lowerInput.includes("güvenlik") || lowerInput.includes("siber") || lowerInput.includes("security")) {
      const securityServices = services.filter(
        (s) =>
          s.title.toLowerCase().includes("güvenlik") ||
          s.description.toLowerCase().includes("güvenlik") ||
          s.title.toLowerCase().includes("security") ||
          s.description.toLowerCase().includes("security")
      )
      if (securityServices.length > 0) {
        const serviceList = securityServices.map((s) => `• ${s.title}: ${s.description}`).join("\n")
        return isEnglish
          ? `Our cybersecurity services:\n${serviceList}\n\nWould you like to speak with an expert?`
          : `Siber güvenlik hizmetlerimiz:\n${serviceList}\n\nBir uzmanla görüşmek ister misiniz?`
      }
    }

    // Team queries
    if (
      lowerInput.includes("ekip") ||
      lowerInput.includes("team") ||
      lowerInput.includes("kimler") ||
      lowerInput.includes("uzman") ||
      lowerInput.includes("expert")
    ) {
      if (employees.length > 0) {
        const teamList = employees
          .slice(0, 5)
          .map((e) => `• ${e.name} - ${e.title}${e.expertise_area ? ` (${e.expertise_area})` : ""}`)
          .join("\n")
        return isEnglish
          ? `Our team:\n\n${teamList}\n\nYou can view our team section to learn more about our experts.`
          : `Ekibimiz:\n\n${teamList}\n\nEkibimizle tanışmak için ekibimiz bölümüne bakabilirsiniz.`
      }
    }

    // Contact queries
    if (
      lowerInput.includes("iletişim") ||
      lowerInput.includes("contact") ||
      lowerInput.includes("telefon") ||
      lowerInput.includes("phone") ||
      lowerInput.includes("ulaş") ||
      lowerInput.includes("reach")
    ) {
      let response = isEnglish ? "Our contact information:\n" : "İletişim bilgilerimiz:\n"
      if (settings.phone) response += `📞 ${isEnglish ? "Phone" : "Telefon"}: ${settings.phone}\n`
      if (settings.email) response += `📧 ${isEnglish ? "Email" : "E-posta"}: ${settings.email}\n`
      if (settings.appointment_url) {
        response += isEnglish
          ? `\nYou can use the appointment section to book a meeting.`
          : `\nRandevu almak için randevu bölümünü kullanabilirsiniz.`
      }
      return response
    }

    // Appointment queries
    if (
      lowerInput.includes("randevu") ||
      lowerInput.includes("appointment") ||
      lowerInput.includes("görüşme") ||
      lowerInput.includes("meeting")
    ) {
      if (settings.appointment_url) {
        return isEnglish
          ? "You can click the 'Book Appointment' button at the bottom of the page to schedule a meeting. Or you can contact us directly."
          : "Randevu almak için sayfanın alt kısmındaki 'Randevu Al' butonuna tıklayabilirsiniz. Veya doğrudan bizimle iletişime geçebilirsiniz."
      }
      return isEnglish
        ? "Please contact us to schedule an appointment."
        : "Randevu almak için lütfen bizimle iletişime geçin."
    }

    // Price queries
    if (
      lowerInput.includes("fiyat") ||
      lowerInput.includes("price") ||
      lowerInput.includes("ücret") ||
      lowerInput.includes("cost") ||
      lowerInput.includes("maliyet")
    ) {
      return isEnglish
        ? "Pricing is determined based on your project scope. You can click the 'Get Quote' button for a detailed quote or contact us directly."
        : "Fiyatlandırma projenizin kapsamına göre belirlenmektedir. Detaylı teklif almak için 'Teklif Al' butonuna tıklayabilir veya doğrudan bizimle iletişime geçebilirsiniz."
    }

    // Default response with appointment suggestion
    return isEnglish
      ? "Thank you. For more detailed information, you can check our services, team, or references sections. Would you like to speak with an expert? You can use the 'Book Appointment' button to schedule a meeting."
      : "Teşekkür ederim. Daha detaylı bilgi için hizmetlerimiz, ekibimiz veya referanslarımız bölümlerine bakabilirsiniz. Bir uzmanla görüşmek ister misiniz? Randevu almak için 'Randevu Al' butonunu kullanabilirsiniz."
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-secondary" />
                <h3 className="text-white font-semibold">
                  {language === "en" ? "AI Assistant" : "AI Asistan"}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.sender === "user"
                        ? "bg-secondary text-white"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white rounded-2xl p-3">
                    <span className="animate-pulse">
                      {language === "en" ? "Typing..." : "Yazıyor..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-white/20 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={language === "en" ? "Type your message..." : "Mesajınızı yazın..."}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <Button
                onClick={handleSend}
                className="bg-secondary hover:bg-secondary/90"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-secondary hover:bg-secondary/90 text-white rounded-full w-14 h-14 shadow-2xl z-40"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  )
}

