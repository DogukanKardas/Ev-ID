"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

export default function FAQSection() {
  const { t, language } = useLocale()
  
  const faqs = language === "en"
    ? [
        {
          id: 1,
          question: "What services do you offer?",
          answer: "We provide cloud solutions, cybersecurity, software development, consulting, and technical support services globally.",
        },
        {
          id: 2,
          question: "What are the project timelines?",
          answer: "Project timelines vary based on scope. Please contact us for detailed information about your specific project.",
        },
        {
          id: 3,
          question: "How is technical support provided?",
          answer: "We offer 24/7 technical support with remote access capabilities. Our global team is always available to assist you.",
        },
        {
          id: 4,
          question: "How is pricing structured?",
          answer: "Each project is priced individually based on your specific needs. We prepare custom quotes tailored to your requirements.",
        },
      ]
    : [
        {
          id: 1,
          question: "Hangi hizmetleri sunuyorsunuz?",
          answer: "Bulut çözümleri, siber güvenlik, yazılım geliştirme, danışmanlık ve teknik destek hizmetleri sunmaktayız.",
        },
        {
          id: 2,
          question: "Proje süreleri ne kadar?",
          answer: "Proje süreleri projenin kapsamına göre değişiklik göstermektedir. Detaylı bilgi için iletişime geçebilirsiniz.",
        },
        {
          id: 3,
          question: "Teknik destek nasıl sağlanıyor?",
          answer: "7/24 teknik destek hattımız ve uzaktan erişim imkanlarımız ile her zaman yanınızdayız.",
        },
        {
          id: 4,
          question: "Fiyatlandırma nasıl yapılıyor?",
          answer: "Her proje için özel fiyatlandırma yapılmaktadır. İhtiyaçlarınıza göre özel teklif hazırlıyoruz.",
        },
      ]
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("faq")}</h2>
          <p className="text-white/60">{t("faqSubtitle")}</p>
        </motion.div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full p-6 flex items-center justify-between text-left"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              >
                <span className="text-white font-semibold">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-white transition-transform ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-white/80">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

