"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Magic link hash'ini kontrol et
  useEffect(() => {
    const handleAuthCallback = async () => {
      // URL hash'inden token'ları al
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const errorParam = hashParams.get('error')

      if (errorParam) {
        setError(decodeURIComponent(errorParam))
        // Hash'i temizle
        window.history.replaceState(null, '', window.location.pathname)
        return
      }

      if (accessToken && refreshToken) {
        setLoading(true)
        try {
          // Session'ı set et
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            setError(sessionError.message)
            setLoading(false)
            return
          }

          if (data.session) {
            // Hash'i temizle ve yönlendir
            window.history.replaceState(null, '', '/admin')
            router.refresh()
            setTimeout(() => {
              window.location.href = "/admin"
            }, 100)
          }
        } catch (err: any) {
          setError(err.message || "Giriş yapılırken bir hata oluştu")
          setLoading(false)
        }
      }
    }

    handleAuthCallback()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data.user && data.session) {
        // Session'ı doğrula
        const { data: sessionData } = await supabase.auth.getSession()
        
        if (sessionData.session) {
          // Başarılı login - admin paneline yönlendir
          router.refresh()
          setTimeout(() => {
            window.location.href = "/admin"
          }, 200)
        } else {
          setError("Oturum oluşturulamadı. Lütfen tekrar deneyin.")
          setLoading(false)
        }
      } else {
        setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.")
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || "Giriş yapılırken bir hata oluştu")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Admin Girişi</CardTitle>
            <CardDescription className="text-white/60">
              Evrentek Teknoloji Admin Paneli
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  E-posta
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white">
                  Şifre
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white mt-2"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


