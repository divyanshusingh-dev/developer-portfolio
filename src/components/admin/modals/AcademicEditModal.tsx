import type { FormEvent } from "react"

type AcademicFile = { displayName: string }
type AcademicEdit = { file: AcademicFile; type: "sgpa" | "percentage" }

type Props = {
  academicEdit: AcademicEdit | null
  value: string
  isSaving: boolean
  onValueChange: (value: string) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export default function AcademicEditModal({ academicEdit, value, isSaving, onValueChange, onClose, onSubmit }: Props) {
  if (!academicEdit) return null
  const isSgpa = academicEdit.type === "sgpa"
  const max = isSgpa ? 10 : 100
  const changeBy = (amount: number) => {
    const current = Number(value) || 0
    onValueChange(Math.min(max, Math.max(0, current + amount)).toFixed(2))
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md" onMouseDown={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/95 shadow-[0_25px_80px_rgba(0,0,0,0.55)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="border-b border-slate-800 bg-gradient-to-r from-cyan-400/10 via-blue-500/5 to-transparent px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400">Academic Result</p><h2 className="mt-2 text-xl font-bold text-white">Edit {isSgpa ? "SGPA" : "Percentage"}</h2><p className="mt-1 text-sm text-slate-400">{academicEdit.file.displayName}</p></div>
            <button type="button" onClick={onClose} disabled={isSaving} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/60 text-lg text-slate-400 transition hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label htmlFor="academic-edit-value" className="mb-2 block text-sm font-semibold text-slate-200">{isSgpa ? "SGPA" : "Percentage"}</label>
            <div className="flex items-center overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/90 transition focus-within:border-cyan-400/70 focus-within:ring-4 focus-within:ring-cyan-400/10">
              <button type="button" onClick={() => changeBy(-0.01)} disabled={isSaving} className="m-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-lg font-bold text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300 disabled:opacity-50" aria-label="Decrease value">-</button>
              <input id="academic-edit-value" type="number" min="0" max={max} step="0.01" value={value} onChange={(event) => onValueChange(event.target.value)} inputMode="decimal" autoFocus placeholder={isSgpa ? "8.95" : "70.40"} className="min-w-0 flex-1 bg-transparent px-3 py-4 text-center text-lg font-bold tracking-wide text-white outline-none placeholder:text-slate-600/60" />
              <span className="pointer-events-none mr-1.5 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-bold tracking-wide text-cyan-300">{isSgpa ? "/ 10" : "%"}</span>
              <button type="button" onClick={() => changeBy(0.01)} disabled={isSaving} className="m-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-lg font-bold text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300 disabled:opacity-50" aria-label="Increase value">+</button>
            </div>
            <p className="mt-2 text-xs text-slate-500">{isSgpa ? "Enter a value from 0 to 10." : "Enter a value from 0 to 100."}</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSaving || !value.trim()} className="flex-1 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
