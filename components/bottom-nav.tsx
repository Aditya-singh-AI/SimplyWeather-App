"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { CloudSun, Map, Calendar, Settings, Home } from "lucide-react"

const navItems = [
  { href: "/weather", label: "Weather", icon: Home },
  { href: "/forecast", label: "Forecast", icon: Calendar },
  { href: "/map", label: "Map", icon: Map },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  // Don't show on landing page
  if (pathname === "/") return null

  return (
    <>
      {/* Spacer to prevent content from hiding behind nav */}
      <div className="h-20 sm:hidden" />

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav nav-glass sm:hidden" id="bottom-navigation">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`bottom-nav-item ${isActive ? "active" : "text-muted-foreground"}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Top Nav */}
      <nav
        className="hidden sm:flex fixed top-0 left-0 right-0 z-50 nav-glass items-center justify-between px-6 py-3 border-b border-border/30"
        id="top-navigation"
      >
        <Link href="/weather" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
            <CloudSun className="h-4 w-4 text-accent" />
          </div>
          <span className="text-sm font-bold tracking-wide gradient-text-accent">SimplyWeather</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
