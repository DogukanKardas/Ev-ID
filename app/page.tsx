"use client"

import { useState } from "react"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import QuickLinksSection from "@/components/QuickLinksSection"
import ServicesSection from "@/components/ServicesSection"
import TeamSection from "@/components/TeamSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import FAQSection from "@/components/FAQSection"
import ContactFormSection from "@/components/ContactFormSection"
import AppointmentSection from "@/components/AppointmentSection"
import ActionBar from "@/components/ActionBar"
import AnnouncementsSection from "@/components/AnnouncementsSection"
import LocationSection from "@/components/LocationSection"
import AIChatbot from "@/components/AIChatbot"
import CaseStudiesSection from "@/components/CaseStudiesSection"
import ResourceCenter from "@/components/ResourceCenter"
import SmartLeadForm from "@/components/SmartLeadForm"
import NFCHandler from "@/components/NFCHandler"
import { useLocale } from "@/components/LocaleProvider"

export default function Home() {
  const [smartFormOpen, setSmartFormOpen] = useState(false)
  const { t } = useLocale()

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Header />
      <HeroSection />
      <QuickLinksSection />
      <AnnouncementsSection />
      <CaseStudiesSection />
      <ServicesSection />
      <TeamSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactFormSection />
      <ResourceCenter />
      <LocationSection />
      <AppointmentSection />
      <ActionBar />
      <AIChatbot />
      <SmartLeadForm isOpen={smartFormOpen} onClose={() => setSmartFormOpen(false)} />
      <NFCHandler />
      
      {/* Smart Lead Form Trigger Button */}
      <button
        onClick={() => setSmartFormOpen(true)}
        className="fixed bottom-32 right-6 bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-3 shadow-2xl z-40 flex items-center gap-2"
      >
        <span className="text-sm font-medium">{t("getQuote")}</span>
      </button>
    </main>
  )
}

