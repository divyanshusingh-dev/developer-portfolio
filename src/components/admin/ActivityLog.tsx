export type ActivityEntry = { id: string; action: string; detail: string; at: string }

type Props = { entries: ActivityEntry[]; formatDate: (value: string) => string; onClear?: () => void }

export default function ActivityLog({ entries, formatDate, onClear }: Props) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-white">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold">Recent activity</h3><p className="mt-1 text-xs text-slate-500">Activity recorded in this browser. This is not a secure audit trail.</p></div>{onClear && <button type="button" onClick={onClear} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-400/40">Clear log</button>}</div>
      {entries.length === 0 ? <p className="rounded-xl border border-dashed border-slate-800 p-5 text-center text-sm text-slate-500">No actions recorded yet.</p> : <div className="space-y-3">{entries.map((entry) => <article key={entry.id} className="flex flex-col gap-1 border-b border-slate-800 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-semibold text-slate-200">{entry.action}</p><p className="mt-1 text-xs text-slate-500">{entry.detail}</p></div><time className="shrink-0 text-[11px] text-slate-500">{formatDate(entry.at)}</time></article>)}</div>}
    </section>
  )
}
