import { useEffect, useMemo, useState } from "react"

type Semester = {
  slot: string
  name: string
  fileName: string
  sgpa: number | null
  enabled: boolean
  hasFile: boolean
  available: boolean
}

type SchoolDocument = {
  slot: string
  name: string
  fileName: string
  percentage: number | null
  enabled: boolean
  hasFile: boolean
  available: boolean
}

type EducationResponse = {
  semesters: Semester[]
  classMarksheets: SchoolDocument[]
  overallCgpa: number | null
  message?: string
}

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com"

function Education() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [classMarksheets, setClassMarksheets] = useState<SchoolDocument[]>([])
  const [overallCgpa, setOverallCgpa] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [downloadFile, setDownloadFile] = useState<string | null>(null)
  const [downloadName, setDownloadName] = useState("")
  const [downloadPassword, setDownloadPassword] = useState("")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [error, setError] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const loadEducation = async () => {
      try {
        setIsLoading(true)
        setError("")

        const response = await fetch(
          `${API_BASE}/api/public/education`,
          { cache: "no-store" }
        )

        const data = (await response.json()) as EducationResponse

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load education data."
          )
        }

        setSemesters(data.semesters || [])
        setClassMarksheets(data.classMarksheets || [])
        setOverallCgpa(data.overallCgpa ?? null)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load education data."
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadEducation()
  }, [])

  const semesterMap = useMemo(
    () => new Map(semesters.map((semester) => [semester.slot, semester])),
    [semesters]
  )

  const schoolDocumentMap = useMemo(
    () =>
      new Map(
        classMarksheets.map((document) => [document.slot, document])
      ),
    [classMarksheets]
  )

  const requestDownload = async (
    fileName: string,
    displayName: string
  ) => {
    try {
      setError("")

      const response = await fetch(
        `${API_BASE}/api/protected-pdf/status/${encodeURIComponent(
          fileName
        )}`,
        { cache: "no-store" }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Unable to check PDF status.")
      }

      if (data.enabled === false) {
        throw new Error("This document is currently disabled.")
      }

      setDownloadFile(fileName)
      setDownloadName(displayName)

      if (data.protected) {
        setDownloadPassword("")
        setShowPasswordModal(true)
        return
      }

      await downloadPdf(fileName, displayName, "")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to download PDF."
      )
    }
  }

  const downloadPdf = async (
    fileName: string,
    displayName: string,
    password: string
  ) => {
    setIsDownloading(true)
    setError("")

    try {
      const response = await fetch(
        `${API_BASE}/api/protected-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName,
            password,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          data.message || "Unable to download PDF."
        )
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      setShowPasswordModal(false)
      setDownloadFile(null)
      setDownloadPassword("")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to download ${displayName}.`
      )
    } finally {
      setIsDownloading(false)
    }
  }

  const semesterCards = [
    "firstSemester",
    "secondSemester",
    "thirdSemester",
    "fourthSemester",
    "fifthSemester",
    "sixthSemester",
  ].map((slot) => semesterMap.get(slot))

  return (
    <section
      id="education"
      className="w-full overflow-hidden border-t border-slate-800 bg-transparent px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 sm:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-sm sm:tracking-[0.3em]">
            Education
          </p>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            My Education
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
            My academic background, semester performance and educational journey.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-5 sm:space-y-6">
          {/* BCA */}
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 sm:text-sm">
                  Bachelor of Computer Applications
                </p>

                <h3 className="mt-2 text-lg font-bold leading-snug text-white sm:text-xl lg:text-2xl">
                  Bachelor of Computer Applications (BCA)
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
                  I. K. Gujral Punjab Technical University (IKGPTU)
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Swami Vivekanand Faculty of Technology and Management, Ramnagar
                </p>
              </div>

              <span className="w-fit shrink-0 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                2024 – 27
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {semesterCards.map((semester, index) => {
                const fallbackNames = [
                  "First Semester",
                  "Second Semester",
                  "Third Semester",
                  "Fourth Semester",
                  "Fifth Semester",
                  "Sixth Semester",
                ]
                const fallbackSlots = [
                  "firstSemester",
                  "secondSemester",
                  "thirdSemester",
                  "fourthSemester",
                  "fifthSemester",
                  "sixthSemester",
                ]

                const name = semester?.name || fallbackNames[index]
                const slot = semester?.slot || fallbackSlots[index]
                const hasSgpa = semester?.sgpa !== null && semester?.sgpa !== undefined
                const canDownload = Boolean(
                  semester?.available && semester?.hasFile
                )

                return (
                  <div
                    key={slot}
                    className={`min-w-0 rounded-xl border p-4 sm:p-5 ${
                      canDownload
                        ? "border-slate-800 bg-slate-950/70"
                        : "border-slate-800/60 bg-slate-950/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-400">
                        {name}
                      </p>

                      <span
                        className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold sm:text-xs ${
                          canDownload
                            ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                            : "border-slate-700 bg-slate-900 text-slate-500"
                        }`}
                      >
                        {canDownload ? "Available" : "Pending"}
                      </span>
                    </div>

                    <p
                      className={`mt-3 text-2xl font-bold ${
                        hasSgpa ? "text-white" : "text-slate-600"
                      }`}
                    >
                      {hasSgpa
                        ? `SGPA: ${semester?.sgpa?.toFixed(2)}`
                        : "SGPA: —"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {canDownload
                        ? "Semester DMC available"
                        : semester?.hasFile === false
                          ? "DMC not uploaded"
                          : "DMC not available"}
                    </p>

                    {canDownload ? (
                      <button
                        type="button"
                        onClick={() =>
                          requestDownload(
                            semester!.fileName,
                            `${name} DMC`
                          )
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-3 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm"
                      >
                        Download DMC
                        <span>↓</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="mt-4 flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-600 sm:text-sm"
                      >
                        DMC Not Available
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 sm:mt-6 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Current Calculated CGPA
                  </p>
                  <p className="mt-1 text-xl font-bold text-cyan-400 sm:text-2xl">
                    {overallCgpa !== null
                      ? overallCgpa.toFixed(2)
                      : "—"}
                  </p>
                </div>

                <p className="text-xs leading-5 text-slate-500 sm:max-w-xs sm:text-right sm:text-sm">
                  Average of the semester SGPA values currently entered.
                </p>
              </div>
            </div>

            {isLoading && (
              <p className="mt-4 text-center text-xs text-slate-500">
                Updating semester information…
              </p>
            )}
          </div>

          {/* 12th */}
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 sm:text-sm">
                  Senior Secondary
                </p>

                <h3 className="mt-2 text-lg font-bold leading-snug text-white sm:text-xl">
                  Senior Secondary (Class XII)
                </h3>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  Central Board of Secondary Education (CBSE)
                </p>

                <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:text-sm">
                  UNS HR SEC SCH SHANKARGANJ MAHURPUR JAUNPUR UP
                </p>
              </div>

              <div className="flex w-full flex-col items-start gap-3 lg:w-auto lg:items-end">
                <span className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                  2023
                </span>

                <span className="text-sm font-semibold text-cyan-400">
                  Percentage:{" "}
                  {(schoolDocumentMap.get("classXII")?.percentage ?? 60.4).toFixed(2)}%
                </span>

                <button
                  type="button"
                  onClick={() =>
                    requestDownload(
                      "12th-marksheet.pdf",
                      "Senior Secondary (Class XII) Marksheet"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm lg:w-auto"
                >
                  Download Marksheet
                  <span>↓</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    requestDownload(
                      "12th-Migration Certificate.pdf",
                      "Migration Certificate"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm lg:w-auto"
                >
                  Download Migration Certificate
                  <span>↓</span>
                </button>
              </div>
            </div>
          </div>

          {/* 10th */}
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 sm:text-sm">
                  Secondary
                </p>

                <h3 className="mt-2 text-lg font-bold leading-snug text-white sm:text-xl">
                  Secondary (Class X)
                </h3>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  Central Board of Secondary Education (CBSE)
                </p>

                <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:text-sm">
                  UNS HR SEC SCH SHANKARGANJ MAHURPUR JAUNPUR UP
                </p>
              </div>

              <div className="flex w-full flex-col items-start gap-3 lg:w-auto lg:items-end">
                <span className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                  2021
                </span>

                <span className="text-sm font-semibold text-cyan-400">
                  Percentage:{" "}
                  {(schoolDocumentMap.get("classX")?.percentage ?? 70.4).toFixed(2)}%
                </span>

                <button
                  type="button"
                  onClick={() =>
                    requestDownload(
                      "10th-marksheet.pdf",
                      "Secondary (Class X) Marksheet"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm lg:w-auto"
                >
                  Download Marksheet
                  <span>↓</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    requestDownload(
                      "10th-Migration Certificate.pdf",
                      "Secondary (Class X) Migration Certificate"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm lg:w-auto"
                >
                  Download Migration Certificate
                  <span>↓</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && downloadFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Protected Document
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  Enter PDF password
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {downloadName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false)
                  setDownloadFile(null)
                  setDownloadPassword("")
                }}
                className="text-xl text-slate-500 hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <input
              type="password"
              value={downloadPassword}
              onChange={(event) => setDownloadPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void downloadPdf(
                    downloadFile,
                    downloadName,
                    downloadPassword
                  )
                }
              }}
              autoFocus
              placeholder="Enter PDF password"
              className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400"
            />

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false)
                  setDownloadFile(null)
                  setDownloadPassword("")
                }}
                className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDownloading}
                onClick={() =>
                  void downloadPdf(
                    downloadFile,
                    downloadName,
                    downloadPassword
                  )
                }
                className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
              >
                {isDownloading ? "Downloading..." : "Download"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Education
