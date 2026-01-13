"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ChevronDown, ChevronUp, Save, X, MessageSquare, Calendar, Mail, Phone, Building, DollarSign, Clock, FileText } from "lucide-react"
import Link from "next/link"

interface QuoteRequest {
  id: string
  form_data: any
  submission_date: string
  status?: string
  updated_at?: string
  notes?: string
}

const STATUS_OPTIONS = [
  { value: "beklemede", label: "Beklemede", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "gorusuldu", label: "Görüşüldü", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "teklif_yapildi", label: "Teklif Yapıldı", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { value: "projelendirildi", label: "Projelendirildi", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "iptal", label: "İptal", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { value: "tamamlandi", label: "Tamamlandı", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
]

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [expandedQuotes, setExpandedQuotes] = useState<Set<string>>(new Set())
  const [editingStatus, setEditingStatus] = useState<{ [key: string]: string }>({})
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({})
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({})
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push("/admin/login")
          return
        }
      }
    }
    checkUser()
    fetchQuotes()
  }, [router])

  async function fetchQuotes() {
    const { data } = await supabase
      .from("smart_lead_submissions")
      .select("*")
      .order("submission_date", { ascending: false })
    if (data) {
      setQuotes(data)
      // Initialize editing states
      const statusMap: { [key: string]: string } = {}
      const notesMap: { [key: string]: string } = {}
      data.forEach((quote) => {
        statusMap[quote.id] = quote.status || "beklemede"
        notesMap[quote.id] = quote.notes || ""
      })
      setEditingStatus(statusMap)
      setEditingNotes(notesMap)
    }
  }

  const toggleExpand = (quoteId: string) => {
    const newExpanded = new Set(expandedQuotes)
    if (newExpanded.has(quoteId)) {
      newExpanded.delete(quoteId)
    } else {
      newExpanded.add(quoteId)
    }
    setExpandedQuotes(newExpanded)
  }

  const handleStatusChange = (quoteId: string, newStatus: string) => {
    setEditingStatus({ ...editingStatus, [quoteId]: newStatus })
  }

  const handleNotesChange = (quoteId: string, newNotes: string) => {
    setEditingNotes({ ...editingNotes, [quoteId]: newNotes })
  }

  const saveQuote = async (quote: QuoteRequest) => {
    setSaving({ ...saving, [quote.id]: true })
    try {
      const { error } = await supabase
        .from("smart_lead_submissions")
        .update({
          status: editingStatus[quote.id] || "beklemede",
          notes: editingNotes[quote.id] || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", quote.id)

      if (error) {
        console.error("Error updating quote:", error)
        alert("Güncelleme sırasında bir hata oluştu: " + error.message)
      } else {
        // Update local state
        setQuotes(
          quotes.map((q) =>
            q.id === quote.id
              ? {
                  ...q,
                  status: editingStatus[quote.id] || "beklemede",
                  notes: editingNotes[quote.id] || "",
                  updated_at: new Date().toISOString(),
                }
              : q
          )
        )
        alert("Başarıyla güncellendi!")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Bir hata oluştu")
    } finally {
      setSaving({ ...saving, [quote.id]: false })
    }
  }

  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-white">Teklif Talepleri</h1>
            <span className="text-white/60 text-lg">({quotes.length} talep)</span>
          </div>
        </div>

        <div className="space-y-4">
          {quotes.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <p className="text-white/60 text-lg">Henüz teklif talebi bulunmuyor.</p>
              </CardContent>
            </Card>
          ) : (
            quotes.map((quote) => {
              const isExpanded = expandedQuotes.has(quote.id)
              const statusInfo = getStatusInfo(quote.status || "beklemede")
              const formData = quote.form_data || {}

              return (
                <Card key={quote.id} className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-white text-xl">
                            {formData.name || "İsimsiz Talep"}
                          </CardTitle>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(quote.submission_date)}</span>
                          </div>
                          {quote.updated_at && quote.updated_at !== quote.submission_date && (
                            <div className="flex items-center gap-1">
                              <span>Güncellendi: {formatDate(quote.updated_at)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(quote.id)}
                        className="text-white hover:bg-white/10"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Özet Bilgiler */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {formData.email && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Mail className="h-4 w-4 text-white/60" />
                          <span className="text-sm truncate">{formData.email}</span>
                        </div>
                      )}
                      {formData.phone && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Phone className="h-4 w-4 text-white/60" />
                          <span className="text-sm">{formData.phone}</span>
                        </div>
                      )}
                      {formData.company && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Building className="h-4 w-4 text-white/60" />
                          <span className="text-sm truncate">{formData.company}</span>
                        </div>
                      )}
                      {formData.service_interest && (
                        <div className="flex items-center gap-2 text-white/80">
                          <FileText className="h-4 w-4 text-white/60" />
                          <span className="text-sm truncate">{formData.service_interest}</span>
                        </div>
                      )}
                    </div>

                    {/* Detaylı İçerik (Açılır/Kapanır) */}
                    {isExpanded && (
                      <div className="space-y-6 pt-4 border-t border-white/10">
                        {/* Tüm Form Verileri */}
                        <div>
                          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Talep Detayları
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(formData).map(([key, value]) => {
                              if (!value || value === "") return null
                              
                              const labelMap: { [key: string]: string } = {
                                name: "Ad Soyad",
                                email: "E-posta",
                                phone: "Telefon",
                                company: "Şirket",
                                service_interest: "İlgilendiğiniz Hizmet",
                                sub_category: "Alt Kategori",
                                budget_range: "Bütçe Aralığı",
                                timeline: "Zaman Çizelgesi",
                                message: "Mesaj",
                              }

                              const label = labelMap[key] || key
                              const isMessage = key === "message"

                              return (
                                <div key={key} className={isMessage ? "md:col-span-2" : ""}>
                                  <Label className="text-white/60 text-xs mb-1 block">
                                    {label}
                                  </Label>
                                  {isMessage ? (
                                    <div className="bg-white/5 border border-white/10 rounded-md p-3 text-white text-sm whitespace-pre-wrap">
                                      {String(value)}
                                    </div>
                                  ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-md p-3 text-white text-sm">
                                      {String(value)}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Durum ve Notlar Düzenleme */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Durum ve Notlar
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`status-${quote.id}`} className="text-white mb-2 block">
                                Durum
                              </Label>
                              <select
                                id={`status-${quote.id}`}
                                value={editingStatus[quote.id] || "beklemede"}
                                onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                                className="w-full h-10 rounded-md border border-white/20 bg-white/10 text-white px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <Label htmlFor={`notes-${quote.id}`} className="text-white mb-2 block">
                                Notlar
                              </Label>
                              <Textarea
                                id={`notes-${quote.id}`}
                                value={editingNotes[quote.id] || ""}
                                onChange={(e) => handleNotesChange(quote.id, e.target.value)}
                                placeholder="Bu talep hakkında notlarınızı buraya ekleyebilirsiniz..."
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[80px]"
                              />
                            </div>
                          </div>

                          <Button
                            onClick={() => saveQuote(quote)}
                            disabled={saving[quote.id]}
                            className="w-full md:w-auto bg-primary hover:bg-primary/90"
                          >
                            {saving[quote.id] ? (
                              <>
                                <span className="animate-spin mr-2">⏳</span>
                                Kaydediliyor...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Değişiklikleri Kaydet
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}


