type Props = {
  confirmation: { title: string; message: string; confirmLabel: string; danger?: boolean; onConfirm: () => void } | null
  onClose: () => void
}

export default function ConfirmationModal({ confirmation, onClose }: Props) {
  if (!confirmation) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} onKeyDown={(event) => { if (event.key === "Escape") onClose() }} role="presentation">
      <div role="alertdialog" aria-modal="true" aria-labelledby="admin-confirmation-title" aria-describedby="admin-confirmation-message" className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40" onMouseDown={(event) => event.stopPropagation()}>
        <div className="border-b border-slate-800 bg-gradient-to-r from-amber-400/10 via-red-400/5 to-transparent px-6 py-5">
          <div className="flex items-start gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${confirmation.danger ? "border-amber-400/25 bg-amber-400/10 text-amber-300" : "border-cyan-400/25 bg-cyan-400/10 text-cyan-300"}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M12 9v4" strokeLinecap="round"/><path d="M12 17h.01" strokeLinecap="round"/><path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinejoin="round"/></svg></div>
            <div className="min-w-0 flex-1"><h2 id="admin-confirmation-title" className="text-lg font-bold text-white">{confirmation.title}</h2><p id="admin-confirmation-message" className="mt-2 break-words text-sm leading-6 text-slate-400">{confirmation.message}</p></div>
            <button type="button" onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-800 hover:text-white" aria-label="Close confirmation">&times;</button>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white">Cancel</button>
          <button type="button" onClick={confirmation.onConfirm} className={`rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${confirmation.danger ? "bg-red-500 hover:bg-red-400" : "bg-cyan-500 hover:bg-cyan-400"}`}>{confirmation.confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
