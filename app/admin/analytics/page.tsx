"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AnalyticsEvent {
  id: string
  event_type: string
  metadata: any
  created_at: string
}

export default function AdminAnalytics() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
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
    fetchAnalytics()
  }, [router])

  async function fetchAnalytics() {
    const { data } = await supabase
      .from("analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
    if (data) {
      setEvents(data)
    }
  }

  const eventCounts = events.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white">Analitik</h1>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {Object.entries(eventCounts).map(([type, count]) => (
            <Card key={type} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">{type}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-secondary">{count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Son Olaylar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white/5 p-4 rounded-lg border border-white/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{event.event_type}</p>
                      <p className="text-white/60 text-sm">
                        {new Date(event.created_at).toLocaleString("tr-TR")}
                      </p>
                    </div>
                    <pre className="text-xs text-white/40 max-w-md overflow-auto">
                      {JSON.stringify(event.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


