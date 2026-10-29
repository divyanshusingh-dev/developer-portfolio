import { useEffect, useState } from "react"

type Announcement = {
  _id?: string
  id?: string
  title: string
  message: string
  priority: "normal" | "important" | "urgent"
  createdAt: string
  expiresAt?: string | null
  attachment?: { fileName?: string; mimeType?: string; sizeBytes?: number; dataUrl?: string } | null
}

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : "https://developer-portfolio-8.onrender.com"

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
}

export default function PublicAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetch(`${API_BASE}/api/announcements`, { headers: { Accept: "application/json" } })
      .then(async (response) => {
        const text = await response.text()
        let data: { announcements?: Announcement[] }
        try { data = text ? JSON.parse(text) : {} } catch { throw new Error("Invalid announcement API response") }
        if (!response.ok) throw new Error("Unable to load announcements")
        return Array.isArray(data.announcements) ? data.announcements : []
      })
      .then((announcements) => { if (active) setItems(announcements) })
      .catch((error) => console.error("Public announcements could not load:", error))
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (loading || items.length === 0) return null

  return (
    <section aria-label="Latest announcements" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300" aria-hidden="true">✦</span>
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Updates</p><h2 className="text-xl font-bold text-white">Latest announcements</h2></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const id = item.id || item._id || `${item.title}-${item.createdAt}`
          const priority = item.priority || "normal"
          const badge = priority === "urgent" ? "border-rose-400/30 bg-rose-400/10 text-rose-300" : priority === "important" ? "border-amber-400/30 bg-amber-400/10 text-amber-200" : "border-cyan-400/25 bg-cyan-400/10 text-cyan-200"
          return <article key={id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-black/10">
            <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badge}`}>{priority}</span><time className="text-xs text-slate-500">{formatDate(item.createdAt)}</time></div>
            <h3 className="mt-3 break-words text-lg font-bold text-white">{item.title}</h3>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{item.message}</p>
            {item.attachment?.dataUrl && <a href={item.attachment.dataUrl} download={item.attachment.fileName || "announcement-attachment"} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/5 px-3 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/10"><span aria-hidden="true">↧</span>View / download attachment <span className="max-w-40 truncate text-xs font-normal text-slate-400">{item.attachment.fileName}</span></a>}
            {item.expiresAt && <p className="mt-3 text-xs text-slate-500">Expires {formatDate(item.expiresAt)}</p>}
          </article>
        })}
      </div>
    </section>
  )
}
