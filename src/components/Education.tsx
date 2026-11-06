
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

type ClassMarksheet = {
  slot: "classX" | "classXII" | string
  percentage: number | null
}

type EducationResponse = {
  semesters: Semester[]
  overallCgpa: number | null
  classMarksheets?: ClassMarksheet[]
  class10Percentage?: number | null
  class12Percentage?: number | null
  message?: string
}

type PdfStatus = {
  enabled?: boolean
  available?: boolean
  hasFile?: boolean
  protected?: boolean
  message?: string
}

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com"

const DEGREE_FILE = "degree-certificate.pdf"

const fallbackSemesters: Semester[] = [
  {
    slot: "firstSemester",
    name: "First Semester",
    fileName: "1st-semester-dmc.pdf",
    sgpa: 8.72,
    enabled: true,
    hasFile: true,
    available: true,
  },
  {
    slot: "secondSemester",
    name: "Second Semester",
    fileName: "2nd-semester-dmc.pdf",
    sgpa: 8.95,
    enabled: true,
    hasFile: true,
    available: true,
  },
  {
    slot: "thirdSemester",
    name: "Third Semester",
    fileName: "3rd-semester-dmc.pdf",
    sgpa: 8.49,
    enabled: true,
    hasFile: true,
    available: true,
  },
  {
    slot: "fourthSemester",
    name: "Fourth Semester",
    fileName: "4th-semester-dmc.pdf",
    sgpa: null,
    enabled: false,
    hasFile: false,
    available: false,
  },
  {
    slot: "fifthSemester",
    name: "Fifth Semester",
    fileName: "5th-semester-dmc.pdf",
    sgpa: null,
    enabled: false,
    hasFile: false,
    available: false,
  },
  {
    slot: "sixthSemester",
    name: "Sixth Semester",
    fileName: "6th-semester-dmc.pdf",
    sgpa: null,
    enabled: false,
    hasFile: false,
    available: false,
  },
]

const fallbackCgpa = (8.72 + 8.95 + 8.49) / 3

function Education() {
  const [semesters, setSemesters] = useState<Semester[]>(
    fallbackSemesters
  )
  const [overallCgpa, setOverallCgpa] = useState<number | null>(
    fallbackCgpa
  )

  const [isLoading, setIsLoading] = useState(true)

  const [class10Percentage, setClass10Percentage] =
    useState<number | null>(70.4)

  const [class12Percentage, setClass12Percentage] =
    useState<number | null>(60.4)

  // Degree certificate availability
  const [degreeAvailable, setDegreeAvailable] = useState(false)
  const [degreeLoading, setDegreeLoading] = useState(true)

  // PDF password modal
  const [downloadFile, setDownloadFile] = useState<string | null>(null)
  const [downloadName, setDownloadName] = useState("")
  const [downloadPassword, setDownloadPassword] = useState("")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [error, setError] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)

  // Load education information
  useEffect(() => {
    const loadEducation = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(
          `${API_BASE}/api/public/education`,
          { cache: "no-store" }
        )

        if (!response.ok) {
          throw new Error("Education API unavailable")
        }

        const data = (await response.json()) as EducationResponse

        const class10FromList = data.classMarksheets?.find(
          (item) => item.slot === "classX"
        )?.percentage

        const class12FromList = data.classMarksheets?.find(
          (item) => item.slot === "classXII"
        )?.percentage

        setClass10Percentage(
          data.class10Percentage ?? class10FromList ?? 70.4
        )

        setClass12Percentage(
          data.class12Percentage ?? class12FromList ?? 60.4
        )

        const serverMap = new Map(
          (data.semesters || []).map((semester) => [
            semester.slot,
            semester,
          ])
        )

        const mergedSemesters = fallbackSemesters.map((fallback) => {
          const server = serverMap.get(fallback.slot)

          if (!server) return fallback

          return {
            ...fallback,
            ...server,
            sgpa: server.sgpa ?? fallback.sgpa,
            fileName: server.fileName || fallback.fileName,
          }
        })

        setSemesters(mergedSemesters)

        const enteredSgpas = mergedSemesters
          .map((semester) => semester.sgpa)
          .filter((value): value is number => value !== null)

        setOverallCgpa(
          enteredSgpas.length > 0
            ? enteredSgpas.reduce((sum, value) => sum + value, 0) /
                enteredSgpas.length
            : fallbackCgpa
        )

        setError("")
      } catch {
        setSemesters(fallbackSemesters)
        setOverallCgpa(fallbackCgpa)
        setClass10Percentage(70.4)
        setClass12Percentage(60.4)
      } finally {
        setIsLoading(false)
      }
    }

    void loadEducation()
  }, [])

  // Automatically check degree certificate status
  useEffect(() => {
    let cancelled = false

    const checkDegreeStatus = async () => {
      try {
        setDegreeLoading(true)

        const response = await fetch(
          `${API_BASE}/api/protected-pdf/status/${encodeURIComponent(
            DEGREE_FILE
          )}`,
          { cache: "no-store" }
        )

        if (!response.ok) {
          throw new Error("Degree certificate not available")
        }

        const data = (await response.json()) as PdfStatus

        if (!cancelled) {
          setDegreeAvailable(
            data.enabled !== false &&
              data.available !== false &&
              data.hasFile !== false
          )
        }
      } catch {
        if (!cancelled) {
          setDegreeAvailable(false)
        }
      } finally {
        if (!cancelled) {
          setDegreeLoading(false)
        }
      }
    }

    void checkDegreeStatus()

    return () => {
      cancelled = true
    }
  }, [])

  const semesterMap = useMemo(
    () =>
      new Map(
        semesters.map((semester) => [
          semester.slot,
          semester,
        ])
      ),
    [semesters]
  )

  // Check PDF availability before downloading
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
        throw new Error(
          data.message || "Unable to check PDF status."
        )
      }

      if (data.enabled === false) {
        throw new Error("This document is currently disabled.")
      }

      if (data.available === false || data.hasFile === false) {
        throw new Error("This document is currently unavailable.")
      }

      setDownloadFile(fileName)
      setDownloadName(displayName)
      setPasswordError("")

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

  // Protected PDF download
  const downloadPdf = async (
    fileName: string,
    displayName: string,
    password: string
  ) => {
    setIsDownloading(true)
    setError("")
    setPasswordError("")

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
          data.message || `Unable to download ${displayName}.`
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
      setPasswordError("")
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `Unable to download ${displayName}.`

      if (showPasswordModal) {
        setPasswordError(message)
      } else {
        setError(message)
      }
    } finally {
      setIsDownloading(false)
    }
  }

  const closePasswordModal = () => {
    if (isDownloading) return

    setShowPasswordModal(false)
    setDownloadFile(null)
    setDownloadPassword("")
    setPasswordError("")
  }

  const semesterSlots = [
    "firstSemester",
    "secondSemester",
    "thirdSemester",
    "fourthSemester",
    "fifthSemester",
    "sixthSemester",
  ]

  const completedSemesters = semesters.filter(
    (semester) => semester.sgpa !== null
  ).length

  return (
    <section
      id="education"
      className="border-t border-slate-800 bg-slate-950 px-6 py-20"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Education
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            My Education
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            My academic background, semester performance and educational journey.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <div className="space-y-6">

          {/* BCA */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition-all duration-300 hover:border-cyan-400/20 hover:bg-slate-900 sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Academic Journey
                </p>

                <h3 className="text-xl font-medium text-white sm:text-xl">
                  Bachelor of Computer Applications (BCA)
                </h3>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  I. K. Gujral Punjab Technical University (IKGPTU)
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Swami Vivekanand Faculty of Technology and Management, Ramnagar
                </p>
              </div>

              <div className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2">
                <span className="text-xs font-medium text-cyan-300">
                  2024 – 27
                </span>
              </div>
            </div>

            <div className="my-6 h-px bg-slate-800" />

            {/* Semester Performance */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Semester Performance
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {semesterSlots.map((slot) => {
                  const semester =
                    semesterMap.get(slot) ||
                    fallbackSemesters.find(
                      (item) => item.slot === slot
                    )!

                  const hasSgpa = semester.sgpa !== null

                  const canDownload = Boolean(
                    semester.available && semester.hasFile
                  )

                  return (
                    <div
                      key={slot}
                      className={`rounded-xl border p-5 transition-all duration-300 ${
                        canDownload
                          ? "border-slate-800 bg-slate-950/70 hover:border-cyan-400/20"
                          : "border-slate-800/70 bg-slate-950/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-slate-400">
                          {semester.name}
                        </p>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
                            canDownload
                              ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                              : "border-slate-700 bg-slate-900 text-slate-500"
                          }`}
                        >
                          {canDownload ? "Available" : "Pending"}
                        </span>
                      </div>

                      <p
                        className={`mt-4 text-xl font-medium ${
                          hasSgpa ? "text-white" : "text-slate-600"
                        }`}
                      >
                        {hasSgpa
                          ? `SGPA: ${semester.sgpa!.toFixed(2)}`
                          : "SGPA: —"}
                      </p>

                      <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                        {canDownload
                          ? "Semester DMC available"
                          : "DMC not available"}
                      </p>

                      {canDownload ? (
                        <button
                          type="button"
                          onClick={() =>
                            void requestDownload(
                              semester.fileName,
                              `${semester.name} DMC`
                            )
                          }
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-3 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm"
                        >
                          Download DMC
                          <span>↓</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="mt-5 flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-600 sm:text-sm"
                        >
                          DMC Not Available
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CGPA */}
            <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Current Calculated CGPA
                  </p>

                  <p className="mt-1 text-2xl font-bold text-cyan-400">
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

          {/* DEGREE CERTIFICATE - NEW */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition-all duration-300 hover:border-cyan-400/30 hover:bg-slate-900 sm:p-7">

            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

              <div className="min-w-0 flex-1">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Academic Achievement
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cyan-400"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5Z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">
                      Degree Certificate
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Bachelor of Computer Applications (BCA)
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Official degree certificate issued by I. K. Gujral Punjab Technical University.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <span className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300">
                  2027
                </span>

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    degreeAvailable
                      ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                      : "border-amber-400/20 bg-amber-400/5 text-amber-300"
                  }`}
                >
                  {degreeLoading
                    ? "Checking..."
                    : degreeAvailable
                      ? "Available"
                      : "Pending"}
                </span>
              </div>
            </div>

            <div className="relative mt-6 border-t border-slate-800 pt-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-semibold text-white">
                    Official Degree Document
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {degreeLoading
                      ? "Checking document availability..."
                      : degreeAvailable
                        ? "Your degree certificate is ready to download."
                        : "Degree certificate will be uploaded after completion of the final year."}
                  </p>
                </div>

                {degreeAvailable ? (
                  <button
                    type="button"
                    onClick={() =>
                      void requestDownload(
                        DEGREE_FILE,
                        "BCA Degree Certificate"
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-5 py-3 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:w-auto sm:text-sm"
                  >
                    Download Degree Certificate
                    <span>↓</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-5 py-3 text-xs font-semibold text-slate-500 sm:w-auto sm:text-sm"
                  >
                    Degree Certificate Pending
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Class XII */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition-all duration-300 hover:border-cyan-400/20 hover:bg-slate-900 sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Senior Secondary
                </p>

                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Senior Secondary (Class XII)
                </h3>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  Central Board of Secondary Education (CBSE)
                </p>

                <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:text-sm">
                  UNS HR SEC SCH SHANKARGANJ MAHURPUR JAUNPUR UP
                </p>
              </div>

              <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end">
                <span className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300">
                  2023
                </span>

                <span className="text-sm font-semibold text-cyan-400">
                  Percentage: {class12Percentage !== null
                    ? `${class12Percentage.toFixed(2)}%`
                    : "—"}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    void requestDownload(
                      "12th-marksheet.pdf",
                      "Senior Secondary (Class XII) Marksheet"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:w-auto sm:text-sm"
                >
                  Download Marksheet
                  <span>↓</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void requestDownload(
                      "12th-Migration Certificate.pdf",
                      "Migration Certificate"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:w-auto sm:text-sm"
                >
                  Download Migration Certificate
                  <span>↓</span>
                </button>
              </div>
            </div>
          </div>

          {/* Class X */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition-all duration-300 hover:border-cyan-400/20 hover:bg-slate-900 sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Secondary
                </p>

                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Secondary (Class X)
                </h3>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  Central Board of Secondary Education (CBSE)
                </p>

                <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:text-sm">
                  UNS HR SEC SCH SHANKARGANJ MAHURPUR JAUNPUR UP
                </p>
              </div>

              <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end">
                <span className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300">
                  2021
                </span>

                <span className="text-sm font-semibold text-cyan-400">
                  Percentage: {class10Percentage !== null
                    ? `${class10Percentage.toFixed(2)}%`
                    : "—"}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    void requestDownload(
                      "10th-marksheet.pdf",
                      "Secondary (Class X) Marksheet"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:w-auto sm:text-sm"
                >
                  Download Marksheet
                  <span>↓</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void requestDownload(
                      "10th-Migration Certificate.pdf",
                      "Secondary (Class X) Migration Certificate"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:w-auto sm:text-sm"
                >
                  Download Migration Certificate
                  <span>↓</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Highlight */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Current CGPA
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {overallCgpa !== null
                ? overallCgpa.toFixed(2)
                : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Completed Semesters
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {completedSemesters} Semesters
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Academic Focus
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              Computer Applications
            </p>
          </div>

        </div>
      </div>

      {/* PDF PASSWORD MODAL */}
      {showPasswordModal && downloadFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePasswordModal()
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-modal-title"
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
          >

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Protected Document
                </p>

                <h2
                  id="pdf-modal-title"
                  className="mt-2 text-xl font-bold text-white"
                >
                  Enter PDF password
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {downloadName}
                </p>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={isDownloading}
                className="text-xl text-slate-500 transition hover:text-white disabled:opacity-40"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <input
              type="password"
              value={downloadPassword}
              onChange={(event) => {
                setDownloadPassword(event.target.value)
                setPasswordError("")
              }}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !isDownloading
                ) {
                  void downloadPdf(
                    downloadFile,
                    downloadName,
                    downloadPassword
                  )
                }
              }}
              autoFocus
              placeholder="Enter PDF password"
              aria-invalid={Boolean(passwordError)}
              aria-describedby={
                passwordError ? "pdf-password-error" : undefined
              }
              className={`mt-6 w-full rounded-xl border bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400 ${
                passwordError
                  ? "border-red-500"
                  : "border-slate-700"
              }`}
            />

            {passwordError && (
              <div
                id="pdf-password-error"
                role="alert"
                aria-live="polite"
                className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                <p className="font-semibold">
                  Password verification failed
                </p>

                <p className="mt-1 break-words">
                  {passwordError}
                </p>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={closePasswordModal}
                disabled={isDownloading}
                className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDownloading || !downloadPassword.trim()}
                onClick={() =>
                  void downloadPdf(
                    downloadFile,
                    downloadName,
                    downloadPassword
                  )
                }
                className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
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
