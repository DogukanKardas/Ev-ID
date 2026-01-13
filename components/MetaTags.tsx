"use client"

import { useEffect } from "react"

export default function MetaTags() {
  useEffect(() => {
    // Theme color meta tag
    let themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (!themeColorMeta) {
      themeColorMeta = document.createElement("meta")
      themeColorMeta.setAttribute("name", "theme-color")
      document.head.appendChild(themeColorMeta)
    }
    themeColorMeta.setAttribute("content", "#000000")

    // Apple mobile web app status bar style
    let appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (!appleStatusBarMeta) {
      appleStatusBarMeta = document.createElement("meta")
      appleStatusBarMeta.setAttribute("name", "apple-mobile-web-app-status-bar-style")
      document.head.appendChild(appleStatusBarMeta)
    }
    appleStatusBarMeta.setAttribute("content", "black")

    // MS Application navbutton color
    let msNavButtonMeta = document.querySelector('meta[name="msapplication-navbutton-color"]')
    if (!msNavButtonMeta) {
      msNavButtonMeta = document.createElement("meta")
      msNavButtonMeta.setAttribute("name", "msapplication-navbutton-color")
      document.head.appendChild(msNavButtonMeta)
    }
    msNavButtonMeta.setAttribute("content", "#000000")
  }, [])

  return null
}

