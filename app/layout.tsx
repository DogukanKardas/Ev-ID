import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LocaleProvider } from "@/components/LocaleProvider"
import { ThemeProvider } from "@/components/ThemeProvider"
import MetaTags from "@/components/MetaTags"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Evrentek Teknoloji - Digital Interaction Hub",
  description: "Evrentek Teknoloji ile iletişime geçin, hizmetlerimizi keşfedin ve ekibimizle tanışın.",
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black",
    "msapplication-navbutton-color": "#000000",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <MetaTags />
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

