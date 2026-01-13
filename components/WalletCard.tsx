"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreditCard, Download } from "lucide-react"

interface WalletCardProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function WalletCard({ isOpen, onOpenChange }: WalletCardProps) {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [open, setOpen] = useState(isOpen || false)

  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen)
    }
  }, [isOpen])

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(open)
    }
  }, [open, onOpenChange])

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("settings")
        .select("key, value, metadata")
        .in("key", ["company_name", "phone", "email", "website", "address"])

      if (data) {
        const settingsMap: Record<string, any> = {}
        data.forEach((item) => {
          settingsMap[item.key] = item.value
          if (item.metadata) {
            settingsMap[`${item.key}_metadata`] = item.metadata
          }
        })
        setSettings(settingsMap)
      }
    }
    fetchSettings()
  }, [])

  const generateAppleWalletPass = () => {
    // Apple Wallet pass.json structure
    const pass = {
      formatVersion: 1,
      passTypeIdentifier: "pass.com.evrentek.digital",
      serialNumber: "123456789",
      teamIdentifier: "YOUR_TEAM_ID",
      organizationName: settings.company_name || "Evrentek Teknoloji",
      description: "Evrentek Teknoloji Digital Card",
      logoText: settings.company_name || "Evrentek",
      foregroundColor: "rgb(255, 255, 255)",
      backgroundColor: "rgb(0, 45, 91)",
      generic: {
        primaryFields: [
          {
            key: "name",
            label: "Company",
            value: settings.company_name || "Evrentek Teknoloji",
          },
        ],
        secondaryFields: [
          {
            key: "phone",
            label: "Phone",
            value: settings.phone || "",
          },
          {
            key: "email",
            label: "Email",
            value: settings.email || "",
          },
        ],
        auxiliaryFields: [
          {
            key: "website",
            label: "Website",
            value: settings.website || "",
          },
        ],
      },
    }

    const blob = new Blob([JSON.stringify(pass, null, 2)], {
      type: "application/json",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "evrentek-wallet.pkpass"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Track analytics (fire and forget)
    ;(async () => {
      try {
        const { error } = await supabase.from("analytics").insert([
          {
            event_type: "wallet_download",
            metadata: { type: "apple", timestamp: new Date().toISOString() },
          },
        ])
        // Silently fail analytics - ignore errors
        if (error) {
          // Analytics errors are non-critical
        }
      } catch {
        // Silently fail
      }
    })()
  }

  const generateGoogleWalletPass = () => {
    // Google Wallet pass structure (simplified - actual implementation requires Google Wallet API)
    const pass = {
      issuerId: "YOUR_ISSUER_ID",
      classId: "evrentek_digital_card",
      id: `evrentek_${Date.now()}`,
      state: "active",
      genericObject: {
        id: `evrentek_${Date.now()}`,
        classId: "evrentek_digital_card",
        genericType: "GENERIC_TYPE_UNSPECIFIED",
        hexBackgroundColor: "#002D5B",
        logo: {
          sourceUri: {
            uri: "https://example.com/logo.png",
          },
        },
        textModulesData: [
          {
            header: "Company",
            body: settings.company_name || "Evrentek Teknoloji",
          },
          {
            header: "Phone",
            body: settings.phone || "",
          },
          {
            header: "Email",
            body: settings.email || "",
          },
        ],
      },
    }

    // For Google Wallet, you typically need to use their API
    // This is a simplified version - in production, you'd call Google Wallet API
    alert(
      "Google Wallet entegrasyonu için Google Wallet API kullanılmalıdır. Detaylar için: https://developers.google.com/wallet"
    )

    // Track analytics (fire and forget)
    ;(async () => {
      try {
        const { error } = await supabase.from("analytics").insert([
          {
            event_type: "wallet_download",
            metadata: { type: "google", timestamp: new Date().toISOString() },
          },
        ])
        // Silently fail analytics - ignore errors
        if (error) {
          // Analytics errors are non-critical
        }
      } catch {
        // Silently fail
      }
    })()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-secondary" />
            Cüzdana Ekle
          </DialogTitle>
          <DialogDescription>
            Kurumsal kartınızı telefonunuzun cüzdan uygulamasına ekleyin
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-white/80">
              {settings.company_name || "Evrentek Teknoloji"} kurumsal kartınızı
              cüzdanınıza ekleyerek hızlı erişim sağlayın.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                generateAppleWalletPass()
                setOpen(false)
              }}
              className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Apple Wallet'a Ekle
            </Button>
            <Button
              onClick={() => {
                generateGoogleWalletPass()
                setOpen(false)
              }}
              className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Google Wallet'a Ekle
            </Button>
          </div>
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-white/50 text-center">
              Kartınız telefonunuzda kalıcı olarak saklanır ve güncellemelerden
              haberdar olursunuz.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


