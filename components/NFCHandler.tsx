"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function NFCHandler() {
  useEffect(() => {
    // Check if Web NFC API is available
    if ("NDEFReader" in window) {
      // Track NFC availability (fire and forget)
      ;(async () => {
        try {
          const { error } = await supabase.from("analytics").insert([
            {
              event_type: "nfc_available",
              metadata: {
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
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
      })()

      // Listen for NFC reads (if user taps their phone on an NFC tag)
      const ndef = new (window as any).NDEFReader()
      
      ndef
        .scan()
        .then(() => {
          console.log("NFC scan started")
          ndef.addEventListener("reading", async (event: any) => {
            console.log("NFC tag read:", event)
            // Track NFC read (fire and forget)
            try {
              const { error } = await supabase.from("analytics").insert([
                {
                  event_type: "nfc_read",
                  metadata: {
                    timestamp: new Date().toISOString(),
                    serial_number: event.serialNumber,
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
          })
        })
        .catch((error: Error) => {
          console.log("NFC scan error:", error)
        })
    }

    // Check if page was opened via NFC
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get("nfc") === "true") {
        // Track NFC opened (fire and forget)
        ;(async () => {
          try {
            const { error } = await supabase.from("analytics").insert([
              {
                event_type: "nfc_opened",
                metadata: {
                  timestamp: new Date().toISOString(),
                  referrer: document.referrer,
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
        })()
      }
    }
  }, [])

  return null
}


