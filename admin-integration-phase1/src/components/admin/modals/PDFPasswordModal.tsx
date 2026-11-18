import type { FormEvent } from "react"

type PdfFile = { displayName: string }
type Props = {
  file: PdfFile | null
  newPassword: string
  onPasswordChange: (value: string) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  isSaving: boolean
  showAll: boolean
  allPassword: string
  confirmPassword: string
  onAllPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onCloseAll: () => void
  onSubmitAll: (event: FormEvent<HTMLFormElement>) => void
}

export default function PDFPasswordModal(props: Props) {
  const { file, newPassword, onPasswordChange, onClose, onSubmit, isSaving, showAll, allPassword, confirmPassword, onAllPasswordChange, onConfirmPasswordChange, onCloseAll, onSubmitAll } = props
  if (file) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">PDF Password</p><h2 className="mt-2 text-xl font-bold text-white">Change password</h2><p className="mt-2 text-sm text-slate-400">{file.displayName}</p></div><button type="button" onClick={onClose} className="text-xl text-slate-500 hover:text-white" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>
        <form onSubmit={onSubmit} className="mt-6 space-y-4"><input type="password" value={newPassword} onChange={(event) => onPasswordChange(event.target.value)} placeholder="New password" autoFocus className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400"/><div className="flex gap-3"><button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white">Cancel</button><button type="submit" disabled={isSaving} className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50">{isSaving ? "Saving..." : "Change Password"}</button></div></form>
      </div>
    </div>
  )
  if (showAll) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Global PDF Password</p><h2 className="mt-2 text-xl font-bold text-white">Change Password for All PDFs</h2><p className="mt-2 text-sm leading-6 text-slate-400">This updates the password of every currently uploaded PDF. Empty slots are skipped automatically.</p></div><button type="button" onClick={onCloseAll} className="text-xl text-slate-500 hover:text-white" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>
        <form onSubmit={onSubmitAll} className="mt-6 space-y-4"><input type="password" value={allPassword} onChange={(event) => onAllPasswordChange(event.target.value)} placeholder="New password" autoFocus className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400"/><input type="password" value={confirmPassword} onChange={(event) => onConfirmPasswordChange(event.target.value)} placeholder="Confirm password" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400"/><div className="flex gap-3"><button type="button" onClick={onCloseAll} className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white">Cancel</button><button type="submit" disabled={isSaving} className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50">{isSaving ? "Changing..." : "Change All Passwords"}</button></div></form>
      </div>
    </div>
  )
  return null
}
