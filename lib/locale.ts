export interface LocaleData {
  language: string
  country: string
  timezone: string
}

// Helper functions for safe browser API access
function getLocalStorageItem(key: string): string | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null
  }
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function setLocalStorageItem(key: string, value: string): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return
  }
  try {
    localStorage.setItem(key, value)
  } catch {
    // Silently fail
  }
}

function getSessionStorageItem(key: string): string | null {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return null
  }
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function setSessionStorageItem(key: string, value: string): void {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return
  }
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // Silently fail
  }
}

export async function detectLocale(): Promise<LocaleData> {
  // Try to get from browser
  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    const language = navigator.language || "tr-TR"
    const [lang, country] = language.split("-")
    
    // Try to get timezone
    let timezone = "Europe/Istanbul"
    try {
      if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    } catch {
      // Use default
    }
    
    // Try to get country from IP-based geolocation (with caching)
    let detectedCountry = country || "TR"
    
    // Check cache first (cache for 24 hours)
    const cacheKey = "locale_country_cache"
    const cacheTimestampKey = "locale_country_cache_timestamp"
    const cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    
    try {
      const cachedCountry = getLocalStorageItem(cacheKey)
      const cachedTimestamp = getLocalStorageItem(cacheTimestampKey)
      
      if (cachedCountry && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10)
        const now = Date.now()
        
        // Use cached value if still valid
        if (now - timestamp < cacheExpiry) {
          detectedCountry = cachedCountry
        } else {
          // Cache expired, try to fetch new value (but only once per session)
          const sessionKey = "locale_fetch_attempted"
          if (!getSessionStorageItem(sessionKey)) {
            setSessionStorageItem(sessionKey, "true")
            
            try {
              // Use a more reliable API with CORS support
              // Check if fetch and AbortController are available
              if (typeof fetch !== "undefined" && typeof AbortController !== "undefined") {
              
              // Create abort controller for timeout
              const controller = new AbortController()
              const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
              
              try {
                const response = await fetch("https://ipapi.co/json/", {
                  method: "GET",
                  headers: {
                    "Accept": "application/json",
                  },
                  signal: controller.signal,
                })
                
                if (response.ok) {
                  const data = await response.json()
                  if (data.country_code) {
                    detectedCountry = data.country_code
                    // Cache the result
                    setLocalStorageItem(cacheKey, detectedCountry)
                    setLocalStorageItem(cacheTimestampKey, Date.now().toString())
                  }
                }
              } finally {
                if (typeof clearTimeout !== "undefined") {
                  clearTimeout(timeoutId)
                }
              }
              }
            } catch (error) {
              // Silently fail and use fallback - don't log to avoid console spam
              // If fetch fails, use timezone-based detection
            }
          } else {
            // Already attempted this session, use cached value even if expired
            detectedCountry = cachedCountry
          }
        }
      } else {
        // No cache, try to fetch (but only once per session)
        const sessionKey = "locale_fetch_attempted"
        if (!getSessionStorageItem(sessionKey)) {
          setSessionStorageItem(sessionKey, "true")
          
          try {
            // Check if fetch and AbortController are available
            if (typeof fetch !== "undefined" && typeof AbortController !== "undefined") {
            
            // Create abort controller for timeout
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
            
            try {
              const response = await fetch("https://ipapi.co/json/", {
                method: "GET",
                headers: {
                  "Accept": "application/json",
                },
                signal: controller.signal,
              })
              
              if (response.ok) {
                const data = await response.json()
                if (data.country_code) {
                  detectedCountry = data.country_code
                  // Cache the result
                  setLocalStorageItem(cacheKey, detectedCountry)
                  setLocalStorageItem(cacheTimestampKey, Date.now().toString())
                }
              }
            } finally {
              if (typeof clearTimeout !== "undefined") {
                clearTimeout(timeoutId)
              }
            }
            }
          } catch (error) {
            // Silently fail and use fallback
          }
        }
      }
    } catch (error) {
      // localStorage might be disabled, continue with fallback
    }
    
    // Fallback: Common timezone to country mapping
    const timezoneMap: Record<string, string> = {
      "Europe/Istanbul": "TR",
      "America/New_York": "US",
      "America/Los_Angeles": "US",
      "Europe/London": "GB",
      "Europe/Paris": "FR",
      "Europe/Berlin": "DE",
      "Europe/Madrid": "ES",
      "Europe/Rome": "IT",
      "Asia/Dubai": "AE",
      "Asia/Singapore": "SG",
      "Asia/Tokyo": "JP",
      "Asia/Shanghai": "CN",
      "Australia/Sydney": "AU",
    }
    
    // Use timezone-based detection if country is still TR and timezone suggests otherwise
    if (timezoneMap[timezone] && detectedCountry === "TR" && timezone !== "Europe/Istanbul") {
      detectedCountry = timezoneMap[timezone]
    }
    
    return {
      language: lang,
      country: detectedCountry,
      timezone,
    }
  }
  
  return {
    language: "tr",
    country: "TR",
    timezone: "Europe/Istanbul",
  }
}

export function getLanguage(locale: LocaleData): string {
  // If outside Turkey, default to English
  if (locale.country !== "TR") {
    return "en"
  }
  return locale.language === "tr" ? "tr" : "en"
}

export const translations: Record<string, Record<string, string>> = {
  tr: {
    welcome: "Hoş Geldiniz",
    services: "Hizmetlerimiz",
    team: "Ekibimiz",
    contact: "İletişim",
    appointment: "Randevu Al",
    quickAccess: "Hızlı Erişim",
    testimonials: "Müşteri Yorumları",
    faq: "Sık Sorulan Sorular",
    resources: "Kaynak Merkezi",
    caseStudies: "Referanslarımız",
    announcements: "Duyurular",
    heroSubtitle: "Teknoloji çözümlerinizde güvenilir ortağınız",
    servicesSubtitle: "Size özel teknoloji çözümleri",
    teamSubtitle: "Uzman kadromuzla tanışın",
    testimonialsSubtitle: "Bizi tercih eden müşterilerimizin görüşleri",
    faqSubtitle: "Merak ettiklerinizin cevapları",
    resourcesSubtitle: "Dokümanlar, sertifikalar ve kaynaklar",
    caseStudiesSubtitle: "Başarılı projelerimiz ve müşterilerimiz",
    announcementsSubtitle: "Son haberler ve güncellemeler",
    contactSubtitle: "Projeleriniz için bizimle iletişime geçin",
    locationSubtitle: "Ofisimizi ziyaret edin",
    appointmentSubtitle: "Uzmanlarımızla görüşmek için randevu alın",
    companyName: "Evrentek Teknoloji",
    contactViaWhatsapp: "WhatsApp ile İletişim",
    callNow: "Hemen Ara",
    globalServicesAvailable: "Global Hizmetler Mevcut • Dünya Çapında Destek",
    yourName: "Ad Soyad",
    email: "E-posta",
    phone: "Telefon",
    message: "Mesaj",
    sendMessage: "Gönder",
    sending: "Gönderiliyor...",
    messageSent: "Mesajınız başarıyla gönderildi!",
    bookAppointment: "Randevu Al",
    watchVideo: "Video İzle",
    downloadPdf: "PDF İndir",
    getQuote: "Teklif Al",
    ourLocation: "Konumumuz",
    showOnMap: "Haritada Göster",
    remoteSupportWorldwide: "Dünya çapında uzaktan destek sunuyoruz",
    download: "İndir",
    viewDetails: "Detayları Görüntüle",
    telefon: "Telefon",
    eposta: "E-posta",
    randevu: "Randevu",
    rehbereKaydet: "Rehbere Kaydet",
    cüzdanaEkle: "Cüzdana Ekle",
    ara: "Ara",
    contactUs: "Bize Ulaşın",
    enterYourFullName: "Adınızı ve soyadınızı girin",
    enterYourEmail: "E-posta adresinizi girin",
    enterYourPhone: "Telefon numaranızı girin",
    enterYourMessage: "Mesajınızı yazın",
  },
  en: {
    welcome: "Welcome",
    services: "Our Services",
    team: "Our Team",
    contact: "Contact",
    appointment: "Book Appointment",
    quickAccess: "Quick Access",
    testimonials: "Client Testimonials",
    faq: "FAQs",
    resources: "Resource Center",
    caseStudies: "Our References",
    announcements: "Announcements",
    heroSubtitle: "Your trusted partner in technology solutions",
    servicesSubtitle: "Global technology solutions tailored for you",
    teamSubtitle: "Meet our expert team",
    testimonialsSubtitle: "What our clients say about us",
    faqSubtitle: "Answers to your questions",
    resourcesSubtitle: "Documents, certificates and resources",
    caseStudiesSubtitle: "Our successful projects and clients",
    announcementsSubtitle: "Latest news and updates",
    contactSubtitle: "Get in touch with us for your projects",
    locationSubtitle: "Visit our office",
    appointmentSubtitle: "Book an appointment to meet with our experts",
    companyName: "Evrentek Technology",
    contactViaWhatsapp: "Contact via WhatsApp",
    callNow: "Call Now",
    globalServicesAvailable: "Global Services Available • Worldwide Support",
    yourName: "Full Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    sendMessage: "Send",
    sending: "Sending...",
    messageSent: "Your message has been sent successfully!",
    bookAppointment: "Book Appointment",
    watchVideo: "Watch Video",
    downloadPdf: "Download PDF",
    getQuote: "Get a Quote",
    ourLocation: "Our Location",
    showOnMap: "Show on Map",
    remoteSupportWorldwide: "We provide remote support worldwide",
    download: "Download",
    viewDetails: "View Details",
    telefon: "Phone",
    eposta: "Email",
    randevu: "Appointment",
    rehbereKaydet: "Save to Contacts",
    cüzdanaEkle: "Add to Wallet",
    ara: "Call",
    contactUs: "Contact Us",
    enterYourFullName: "Enter your full name",
    enterYourEmail: "Enter your email address",
    enterYourPhone: "Enter your phone number",
    enterYourMessage: "Enter your message",
  },
}

export function t(key: string, lang: string = "tr"): string {
  return translations[lang]?.[key] || translations.tr[key] || key
}

