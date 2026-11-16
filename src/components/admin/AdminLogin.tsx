import type { FormEvent } from "react";

type AdminLoginProps = {
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
  showPassword: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onForgotPassword: () => void;
  onRequestAccess: () => void;
};

/** Presentational login panel. Authentication and recovery remain in the parent. */
export default function AdminLogin({
  email,
  password,
  error,
  isLoading,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onForgotPassword,
  onRequestAccess,
}: AdminLoginProps) {
  return (
    <main className="admin-shell relative flex min-h-screen items-center justify-center bg-[#020617] px-4 py-12 text-white sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        <section className="hidden flex-col justify-between border-r border-slate-800 bg-[#061426] p-10 lg:flex">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-300">DEVELOPER PORTFOLIO</p>
            <h1 className="mt-12 text-4xl font-bold leading-tight">Manage your digital presence.</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">A private control centre for portfolio documents, academic records, announcements and administrator access.</p>
          </div>
          <p className="text-xs tracking-widest text-slate-500">PRIVATE ADMINISTRATOR AREA</p>
        </section>
        <section className="flex min-h-[560px] flex-col justify-center p-6 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Welcome back</p>
            <h2 className="mt-3 text-3xl font-bold">Admin sign in</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Sign in with your registered administrator account to continue.</p>
            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-xs font-medium tracking-wide text-slate-300">EMAIL ADDRESS</label>
                <input id="admin-email" type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} placeholder="name@example.com" autoComplete="username" disabled={isLoading} required className="h-14 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-white outline-none focus:border-cyan-300 disabled:opacity-50" />
              </div>
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-xs font-medium tracking-wide text-slate-300">PASSWORD</label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 pr-2 focus-within:border-cyan-300">
                  <input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => onPasswordChange(event.target.value)} placeholder="Enter your password" autoComplete="current-password" disabled={isLoading} required className="h-14 min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none disabled:opacity-50" />
                  <button type="button" onClick={onTogglePassword} disabled={isLoading} className="rounded-lg px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-white/5">{showPassword ? "Hide" : "Show"}</button>
                </div>
              </div>
              {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-300">{error}</p>}
              <button type="submit" disabled={isLoading} className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Verifying access..." : "Sign in to dashboard"}</button>
            </form>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={onForgotPassword} disabled={isLoading} className="rounded-xl border border-slate-700 px-3 py-3 text-xs font-bold text-slate-300 hover:border-cyan-300/40">Forgot password?</button>
              <button type="button" onClick={onRequestAccess} disabled={isLoading} className="rounded-xl border border-cyan-300/25 bg-cyan-300/[0.06] px-3 py-3 text-xs font-bold text-cyan-200">Request admin access</button>
            </div>
            <p className="mt-7 text-xs leading-5 text-slate-500">Restricted to authorized administrators. Password recovery is verified using an OTP sent to your registered email.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
