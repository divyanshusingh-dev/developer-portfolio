import type { ReactNode } from "react"

export type AcademicRecord = {
  slot: string
  displayName: string
  sgpa: number | null
  percentage: number | null
  available: boolean
}

type Props = {
  records: AcademicRecord[]
  overallCgpa: number | null
  onEdit: (record: AcademicRecord, type: "sgpa" | "percentage") => void
  children?: ReactNode
}

export default function AcademicManager({ records, overallCgpa, onEdit, children }: Props) {
  const semesters = records.filter((record) => record.slot.toLowerCase().includes("semester"))
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 text-white sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Academic records</p><h2 className="mt-2 text-xl font-bold">Semester performance</h2><p className="mt-1 text-sm text-slate-400">Manage SGPA and percentage values for uploaded academic records.</p></div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3"><p className="text-xs text-slate-400">Overall CGPA</p><p className="mt-1 text-2xl font-bold text-cyan-300">{overallCgpa == null ? "—" : overallCgpa.toFixed(2)}</p></div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {semesters.map((record) => <article key={record.slot} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"><div className="flex items-center justify-between gap-2"><h3 className="font-semibold">{record.displayName}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${record.available ? "bg-emerald-400/10 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>{record.available ? "Available" : "Not uploaded"}</span></div><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-slate-900 p-3"><p className="text-xs text-slate-500">SGPA</p><p className="mt-1 text-lg font-bold">{record.sgpa == null ? "—" : record.sgpa.toFixed(2)}</p><button type="button" onClick={() => onEdit(record, "sgpa")} className="mt-2 text-xs font-semibold text-cyan-300">Edit SGPA</button></div><div className="rounded-xl bg-slate-900 p-3"><p className="text-xs text-slate-500">Percentage</p><p className="mt-1 text-lg font-bold">{record.percentage == null ? "—" : `${record.percentage.toFixed(2)}%`}</p><button type="button" onClick={() => onEdit(record, "percentage")} className="mt-2 text-xs font-semibold text-cyan-300">Edit %</button></div></div></article>)}
      </div>
      {children}
    </section>
  )
}
