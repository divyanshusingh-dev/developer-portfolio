import { useEffect, useState } from "react"

type PdfSetting = {
  fileName: string
  protected: boolean
}

type SecurityResponse = {
  masterProtected: boolean
  files: PdfSetting[]
}

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com"

const PDF_LABELS: Record<string, string> = {
  "10th-marksheet.pdf": "10th Marksheet",
  "12th-marksheet.pdf": "12th Marksheet",
  "1st-semester-dmc.pdf": "1st Semester DMC",
  "2nd-semester-dmc.pdf": "2nd Semester DMC",
  "resume.pdf": "Resume",
}

function AdminPdfSecurity() {
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [masterProtected, setMasterProtected] = useState(true)
  const [files, setFiles] = useState<PdfSetting[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const savedPassword = sessionStorage.getItem(
      "admin_panel_password"
    )

    if (savedPassword) {
      setPassword(savedPassword)
      setIsLoggedIn(true)

      loadSecuritySettings(savedPassword)
    }
  }, [])

  const loadSecuritySettings = async (
    adminPassword: string
  ) => {
    try {
      setIsLoading(true)
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/security`,
        {
          headers: {
            "X-Admin-Password": adminPassword,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load security settings."
        )
      }

      const securityData =
        data as SecurityResponse

      setMasterProtected(
        securityData.masterProtected
      )

      setFiles(securityData.files)
    } catch (err) {
      sessionStorage.removeItem(
        "admin_panel_password"
      )

      setIsLoggedIn(false)
      setPassword("")

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load security settings."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!password.trim()) {
      setError(
        "Please enter the admin password."
      )
      return
    }

    try {
      setIsLoading(true)
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Incorrect admin password."
        )
      }

      sessionStorage.setItem(
        "admin_panel_password",
        password
      )

      setIsLoggedIn(true)

      await loadSecuritySettings(password)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(
      "admin_panel_password"
    )

    setIsLoggedIn(false)
    setPassword("")
    setFiles([])
    setSuccess("")
    setError("")
  }

  const updateMasterProtection = async (
    nextValue: boolean
  ) => {
    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/security/master`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": password,
          },

          body: JSON.stringify({
            protected: nextValue,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update master protection."
        )
      }

      setMasterProtected(nextValue)

      setSuccess(
        nextValue
          ? "Password protection enabled for all PDFs."
          : "Password protection disabled for all PDFs."
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update master protection."
      )
    } finally {
      setIsSaving(false)
    }
  }

  const updateIndividualProtection = async (
    fileName: string,
    nextValue: boolean
  ) => {
    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/security/pdf/${encodeURIComponent(
          fileName
        )}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": password,
          },

          body: JSON.stringify({
            protected: nextValue,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update PDF protection."
        )
      }

      setFiles((currentFiles) =>
        currentFiles.map((file) =>
          file.fileName === fileName
            ? {
                ...file,
                protected: nextValue,
              }
            : file
        )
      )

      setSuccess(
        `${PDF_LABELS[fileName] || fileName} protection ${
          nextValue ? "enabled" : "disabled"
        }.`
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update PDF protection."
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#020617] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Admin Access
              </p>

              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                PDF Security Panel
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Enter your admin password to manage
                protection for your portfolio documents.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Admin Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError("")
                }}
                placeholder="Enter admin password"
                autoComplete="current-password"
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />

              {error && (
                <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading
                  ? "Checking..."
                  : "Login to Admin Panel"}
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              PDF Security
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Manage password protection for all protected
              portfolio documents.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-fit rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-5 py-4 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {/* Master Control */}
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-5 shadow-xl sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Master Protection
              </p>

              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                Protect all PDFs
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Turn this OFF for instant access to all
                five documents. Individual settings are
                preserved.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                updateMasterProtection(
                  !masterProtected
                )
              }
              disabled={isSaving || isLoading}
              className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                masterProtected
                  ? "bg-cyan-400"
                  : "bg-slate-700"
              } ${
                isSaving
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              aria-label="Toggle master PDF protection"
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg transition ${
                  masterProtected
                    ? "left-7"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                masterProtected
                  ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                  : "border-amber-400/30 bg-amber-400/10 text-amber-300"
              }`}
            >
              Master:{" "}
              {masterProtected ? "ON" : "OFF"}
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-400">
              {files.length} PDFs configured
            </span>
          </div>
        </section>

        {/* Individual Controls */}
        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Individual Controls
            </p>

            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              Document protection
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Each document can be enabled or disabled
              separately.
            </p>
          </div>

          <div className="space-y-3">
            {files.map((file) => {
              const effectiveProtected =
                masterProtected &&
                file.protected

              return (
                <div
                  key={file.fileName}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white">
                      {PDF_LABELS[file.fileName] ||
                        file.fileName}
                    </h3>

                    <p className="mt-1 break-all text-xs text-slate-600">
                      {file.fileName}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                          effectiveProtected
                            ? "border-cyan-400/20 bg-cyan-400/5 text-cyan-300"
                            : "border-slate-700 bg-slate-900 text-slate-500"
                        }`}
                      >
                        Effective:{" "}
                        {effectiveProtected
                          ? "Protected"
                          : "Unprotected"}
                      </span>

                      <span className="rounded-full border border-slate-800 px-2.5 py-1 text-[11px] text-slate-500">
                        Individual:{" "}
                        {file.protected
                          ? "ON"
                          : "OFF"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateIndividualProtection(
                        file.fileName,
                        !file.protected
                      )
                    }
                    disabled={isSaving}
                    className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                      file.protected
                        ? "bg-cyan-400"
                        : "bg-slate-700"
                    } ${
                      isSaving
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    aria-label={`Toggle protection for ${
                      PDF_LABELS[file.fileName] ||
                      file.fileName
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg transition ${
                        file.protected
                          ? "left-7"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Info */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-xs leading-5 text-slate-500">
            Note: Effective protection is ON only when
            both Master Protection and the individual
            PDF protection are ON. Turning Master OFF
            temporarily removes the password requirement
            from all five PDFs.
          </p>
        </div>
      </div>
    </main>
  )
}

export default AdminPdfSecurity