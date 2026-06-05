import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import ServiceWorkerRegister from "@/components/service-worker-register"
import "./globals.css"

export const metadata: Metadata = {
  title: "SimplyWeather — Beautiful Weather Forecasts",
  description: "A stunning, real-time weather application with hourly forecasts, weather maps, air quality data, and smart alerts. Built with modern design.",
  manifest: "/manifest.json",
  keywords: ["weather", "forecast", "temperature", "rain", "air quality", "weather app"],
  authors: [{ name: "SimplyWeather" }],
  generator: 'v0.app',
  openGraph: {
    title: "SimplyWeather — Beautiful Weather Forecasts",
    description: "Real-time weather with stunning visuals, 7-day forecasts, and smart alerts.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            <ServiceWorkerRegister />
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
