"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  type: "rain" | "snow" | "star" | "cloud"
}

interface WeatherParticlesProps {
  variant?: "hero" | "rain" | "snow" | "stars" | "clouds"
  count?: number
  className?: string
}

export function WeatherParticles({
  variant = "hero",
  count = 60,
  className = "",
}: WeatherParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize particles
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    particlesRef.current = Array.from({ length: count }, () => {
      const type =
        variant === "hero"
          ? (["star", "cloud"] as const)[Math.random() > 0.7 ? 1 : 0]
          : variant === "rain"
            ? "rain"
            : variant === "snow"
              ? "snow"
              : variant === "stars"
                ? "star"
                : "cloud"

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size:
          type === "star"
            ? Math.random() * 2.5 + 0.5
            : type === "cloud"
              ? Math.random() * 40 + 20
              : type === "rain"
                ? Math.random() * 2 + 1
                : Math.random() * 4 + 2,
        speedX:
          type === "cloud"
            ? Math.random() * 0.3 + 0.05
            : type === "snow"
              ? (Math.random() - 0.5) * 0.5
              : 0,
        speedY:
          type === "rain"
            ? Math.random() * 4 + 6
            : type === "snow"
              ? Math.random() * 1 + 0.3
              : type === "star"
                ? 0
                : Math.random() * 0.1,
        opacity:
          type === "star"
            ? Math.random() * 0.8 + 0.2
            : type === "cloud"
              ? Math.random() * 0.08 + 0.02
              : Math.random() * 0.4 + 0.2,
        type,
      }
    })

    let time = 0
    const animate = () => {
      const cw = canvas.offsetWidth
      const ch = canvas.offsetHeight
      ctx.clearRect(0, 0, cw, ch)
      time += 0.01

      for (const p of particlesRef.current) {
        if (p.type === "star") {
          // Twinkling stars
          const twinkle = Math.sin(time * 2 + p.x * 0.1) * 0.3 + 0.7
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * twinkle})`
          ctx.fill()

          // Glow effect
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size * 4
          )
          gradient.addColorStop(0, `rgba(168, 85, 247, ${p.opacity * 0.3 * twinkle})`)
          gradient.addColorStop(1, "rgba(168, 85, 247, 0)")
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        } else if (p.type === "cloud") {
          // Soft cloud blobs
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size
          )
          gradient.addColorStop(0, `rgba(168, 85, 247, ${p.opacity})`)
          gradient.addColorStop(0.5, `rgba(139, 92, 246, ${p.opacity * 0.5})`)
          gradient.addColorStop(1, "rgba(139, 92, 246, 0)")
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()

          p.x += p.speedX
          if (p.x > cw + p.size) p.x = -p.size
        } else if (p.type === "rain") {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - 0.5, p.y + p.size * 8)
          ctx.strokeStyle = `rgba(96, 165, 250, ${p.opacity})`
          ctx.lineWidth = p.size * 0.5
          ctx.stroke()

          p.y += p.speedY
          p.x += p.speedX - 0.5
          if (p.y > ch) {
            p.y = -10
            p.x = Math.random() * cw
          }
        } else if (p.type === "snow") {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.fill()

          p.y += p.speedY
          p.x += Math.sin(time * 2 + p.y * 0.01) * 0.5
          if (p.y > ch) {
            p.y = -5
            p.x = Math.random() * cw
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [variant, count])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
