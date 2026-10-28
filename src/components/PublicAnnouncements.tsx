import { useEffect, useState } from "react"

type Announcement = {
  id: string
  title: string
  message: string
  priority: "normal" | "important" | "urgent"
  createdAt: string
  expiresAt: string | null
}

const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com"

export default function PublicAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/announcements`)
        if (!response.ok) return
        const data = await response.json()
        if (!cancelled && Array.isArray(data.announcements)) setItems(data.announcements)
      } catch {
        // The portfolio should still render normally if the announcements API is temporarily unavailable.
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  if (!items.length) return null

  return (
    <section aria-label="Portfolio announcements" className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className={`rounded-2xl border p-4 shadow-lg backdrop-blur-xl sm:p-5 ${item.priority === "urgent" ? "border-red-400/30 bg-red-950/30" : item.priority === "important" ? "border-amber-300/25 bg-amber-950/20" : "border-cyan-300/20 bg-slate-900/70"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${item.priority === "urgent" ? "bg-red-400/15 text-red-200" : item.priority === "important" ? "bg-amber-300/15 text-amber-100" : "bg-cyan-300/10 text-cyan-200"}`}>{item.priority}</span>
              <h2 className="text-base font-bold text-white sm:text-lg">{item.title}</h2>
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{item.message}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
