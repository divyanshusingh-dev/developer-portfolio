import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type {
  ChangeEvent,
  FormEvent,
} from "react"

type PdfSetting = {
  slot: string
  fileName: string
  displayName: string
  isSemester: boolean
  protected: boolean
  enabled: boolean
  effectiveProtected: boolean
  sgpa: number | null
  percentage: number | null
  sizeBytes: number
  uploadedAt: string | null
  builtIn: boolean
  hasFile: boolean
  available: boolean
}

type SecurityResponse = {
  masterProtected: boolean
  files: PdfSetting[]
  overallCgpa: number | null
}

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com"

const PDF_OPTIONS = [
  {
    slot: "classX",
    label: "10th Marksheet",
    fileName: "10th-marksheet.pdf",
  },
  {
    slot: "classXII",
    label: "12th Marksheet",
    fileName: "12th-marksheet.pdf",
  },
  {
    slot: "classXMigration",
    label: "10th Migration Certificate",
    fileName: "10th-Migration Certificate.pdf",
  },
  {
    slot: "classXIIMigration",
    label: "12th Migration Certificate",
    fileName: "12th-Migration Certificate.pdf",
  },
  {
    slot: "firstSemester",
    label: "1st Semester",
    fileName: "1st-semester-dmc.pdf",
  },
  {
    slot: "secondSemester",
    label: "2nd Semester",
    fileName: "2nd-semester-dmc.pdf",
  },
  {
    slot: "thirdSemester",
    label: "3rd Semester",
    fileName: "3rd-semester-dmc.pdf",
  },
  {
    slot: "fourthSemester",
    label: "4th Semester",
    fileName: "4th-semester-dmc.pdf",
  },
  {
    slot: "fifthSemester",
    label: "5th Semester",
    fileName: "5th-semester-dmc.pdf",
  },
  {
    slot: "sixthSemester",
    label: "6th Semester",
    fileName: "6th-semester-dmc.pdf",
  },
  {
    slot: "degreeCertificate",
    label: "Degree Certificate",
    fileName: "degree-certificate.pdf",
  },
  {
    slot: "resume",
    label: "Resume",
    fileName: "resume.pdf",
  },
]

const SEMESTER_SLOTS = new Set([
  "firstSemester",
  "secondSemester",
  "thirdSemester",
  "fourthSemester",
  "fifthSemester",
  "sixthSemester",
])

const SCHOOL_MARKSHEET_SLOTS = new Set([
  "classX",
  "classXII",
])

function formatFileSize(bytes: number) {
  if (!bytes) return "Not available"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDate(value: string | null) {
  if (!value) return "Not updated"

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function AdminPdfSecurity() {
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [masterProtected, setMasterProtected] = useState(true)
  const [files, setFiles] = useState<PdfSetting[]>([])
  const [overallCgpa, setOverallCgpa] = useState<number | null>(null)

  const [selectedSlot, setSelectedSlot] = useState("firstSemester")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadPassword, setUploadPassword] = useState("")
  const [uploadProtected, setUploadProtected] = useState(true)
  const [uploadSgpa, setUploadSgpa] = useState("")
  const [uploadPercentage, setUploadPercentage] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [passwordModalFile, setPasswordModalFile] =
    useState<PdfSetting | null>(null)
  const [newPdfPassword, setNewPdfPassword] = useState("")

  const [academicEdit, setAcademicEdit] = useState<{ file: PdfSetting; type: "sgpa" | "percentage" } | null>(null)
  const [academicEditValue, setAcademicEditValue] = useState("")

  const [showAllPasswordModal, setShowAllPasswordModal] =
    useState(false)
  const [allPdfPassword, setAllPdfPassword] = useState("")
  const [allPdfPasswordConfirm, setAllPdfPasswordConfirm] =
    useState("")

  const selectedOption = useMemo(
    () => PDF_OPTIONS.find((option) => option.slot === selectedSlot),
    [selectedSlot]
  )

  const selectedExistingFile = useMemo(
    () => files.find((file) => file.slot === selectedSlot),
    [files, selectedSlot]
  )

  const [isPdfDropdownOpen, setIsPdfDropdownOpen] = useState(false)
  const pdfDropdownRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        pdfDropdownRef.current &&
        !pdfDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPdfDropdownOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPdfDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  useEffect(() => {
    if (selectedExistingFile?.isSemester) {
      setUploadSgpa(
        selectedExistingFile.sgpa != null
          ? String(selectedExistingFile.sgpa)
          : ""
      )
    } else {
      setUploadSgpa("")
    }

    if (
      selectedExistingFile?.slot &&
      SCHOOL_MARKSHEET_SLOTS.has(selectedExistingFile.slot)
    ) {
      setUploadPercentage(
        selectedExistingFile.percentage != null &&
          selectedExistingFile.percentage !== undefined
          ? String(selectedExistingFile.percentage)
          : ""
      )
    } else {
      setUploadPercentage("")
    }
  }, [selectedExistingFile])


  const loadSecuritySettings = async (adminPassword: string) => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(
        `${API_BASE}/api/admin/security`,
        {
          headers: {
            "X-Admin-Password": adminPassword,
          },
        }
      )

      const data = (await response.json()) as SecurityResponse & {
        message?: string
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load PDF security settings."
        )
      }

      setMasterProtected(Boolean(data.masterProtected))
      setFiles(data.files || [])
      setOverallCgpa(data.overallCgpa ?? null)
    } catch (err) {
      sessionStorage.removeItem("admin_panel_password")
      setIsLoggedIn(false)
      setPassword("")
      setFiles([])
      setOverallCgpa(null)
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load PDF security settings."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!password.trim()) {
      setError("Please enter the admin password.")
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch(
        `${API_BASE}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Incorrect admin password."
        )
      }

      sessionStorage.setItem("admin_panel_password", password)
      setIsLoggedIn(true)
      await loadSecuritySettings(password)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("admin_panel_password")
    setIsLoggedIn(false)
    setPassword("")
    setFiles([])
    setOverallCgpa(null)
    setError("")
    setSuccess("")
  }

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null

    setSelectedFile(file)
    setError("")
    setSuccess("")

    if (!file) return

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")

    if (!isPdf) {
      setSelectedFile(null)
      event.target.value = ""
      setError("Only PDF files are allowed.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null)
      event.target.value = ""
      setError("PDF size must be 10 MB or less.")
    }
  }

  const resetUploadForm = () => {
    setSelectedFile(null)
    setUploadPassword("")
    setUploadProtected(true)

    const currentFile = selectedExistingFile

    if (SEMESTER_SLOTS.has(selectedSlot)) {
      setUploadSgpa(
        currentFile?.sgpa !== null && currentFile?.sgpa !== undefined
          ? String(currentFile.sgpa)
          : ""
      )
    } else {
      setUploadSgpa("")
    }

    if (SCHOOL_MARKSHEET_SLOTS.has(selectedSlot)) {
      setUploadPercentage(
        currentFile?.percentage !== null &&
          currentFile?.percentage !== undefined
          ? String(currentFile.percentage)
          : ""
      )
    } else {
      setUploadPercentage("")
    }

    const input = document.getElementById(
      "pdf-upload-input"
    ) as HTMLInputElement | null

    if (input) input.value = ""

    if (selectedExistingFile?.isSemester) {
      setUploadSgpa(
        selectedExistingFile.sgpa != null
          ? String(selectedExistingFile.sgpa)
          : ""
      )
    } else {
      setUploadSgpa("")
    }
  }

  const handleSlotChange = (slot: string) => {
    setSelectedSlot(slot)
    setSelectedFile(null)
    setUploadPassword("")
    setError("")
    setSuccess("")
    setIsPdfDropdownOpen(false)

    const selected = files.find(
      (file) => file.slot === slot
    )

    setUploadSgpa(
      selected?.sgpa !== null && selected?.sgpa !== undefined
        ? String(selected.sgpa)
        : ""
    )

    setUploadPercentage(
      selected?.percentage !== null &&
        selected?.percentage !== undefined
        ? String(selected.percentage)
        : ""
    )
  }

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!selectedFile) {
      setError("Please select a PDF file.")
      return
    }

    if (uploadProtected && !uploadPassword.trim()) {
      setError(
        "Please enter a PDF password when protection is ON."
      )
      return
    }

    if (!selectedOption) {
      setError("Please select a valid PDF type.")
      return
    }

    if (selectedExistingFile?.hasFile) {
      const confirmed = window.confirm(
        `"${selectedOption.label}" already has a PDF.\n\nDo you want to replace the existing PDF?`
      )

      if (!confirmed) return
    }

    if (SEMESTER_SLOTS.has(selectedSlot)) {
      const sgpa = Number(uploadSgpa)

      if (!Number.isFinite(sgpa) || sgpa < 0 || sgpa > 10) {
        setError(
          `${selectedOption.label} requires an SGPA between 0 and 10.`
        )
        return
      }
    }

    if (SCHOOL_MARKSHEET_SLOTS.has(selectedSlot)) {
      const percentage = Number(uploadPercentage)

      if (
        !Number.isFinite(percentage) ||
        percentage < 0 ||
        percentage > 100
      ) {
        setError(
          `${selectedOption.label} requires a percentage between 0 and 100.`
        )
        return
      }
    }

    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append("pdf", selectedFile)
      formData.append("slot", selectedSlot)
      formData.append("password", uploadPassword)
      formData.append(
        "protected",
        uploadProtected ? "true" : "false"
      )

      if (SEMESTER_SLOTS.has(selectedSlot)) {
        formData.append("sgpa", uploadSgpa)
      }

      if (SCHOOL_MARKSHEET_SLOTS.has(selectedSlot)) {
        formData.append("percentage", uploadPercentage)
      }

      const response = await fetch(
        `${API_BASE}/api/admin/pdf/upload`,
        {
          method: "POST",
          headers: {
            "X-Admin-Password": password,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to upload PDF."
        )
      }

      setSuccess(
        data.message || `${selectedOption.label} uploaded successfully.`
      )
      resetUploadForm()
      await loadSecuritySettings(password)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to upload PDF."
      )
    } finally {
      setIsUploading(false)
    }
  }

  const updateMasterProtection = async (nextValue: boolean) => {
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
          body: JSON.stringify({ protected: nextValue }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update master protection."
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
          body: JSON.stringify({ protected: nextValue }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update PDF protection."
        )
      }

      setFiles((currentFiles) =>
        currentFiles.map((file) =>
          file.fileName === fileName
            ? {
                ...file,
                protected: nextValue,
                effectiveProtected:
                  masterProtected && nextValue,
              }
            : file
        )
      )

      setSuccess(
        `${data.fileName || fileName} protection ${
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

  const updateSlotEnabled = async (
    slot: string,
    nextValue: boolean
  ) => {
    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/security/slot/${encodeURIComponent(
          slot
        )}/enabled`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": password,
          },
          body: JSON.stringify({ enabled: nextValue }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update portfolio slot."
        )
      }

      setFiles((currentFiles) =>
        currentFiles.map((file) =>
          file.slot === slot
            ? {
                ...file,
                enabled: nextValue,
                available: file.hasFile && nextValue,
              }
            : file
        )
      )

      setSuccess(data.message || "Portfolio slot updated.")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update portfolio slot."
      )
    } finally {
      setIsSaving(false)
    }
  }

  const saveSgpa = async (file: PdfSetting, input: string) => {
    if (!file.isSemester) return

    const sgpa = Number(input)

    if (!Number.isFinite(sgpa) || sgpa < 0 || sgpa > 10) {
      setError("SGPA must be between 0 and 10.")
      return
    }

    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/security/slot/${encodeURIComponent(
          file.slot
        )}/sgpa`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": password,
          },
          body: JSON.stringify({ sgpa }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Unable to save SGPA.")
      }

      setFiles((currentFiles) =>
        currentFiles.map((currentFile) =>
          currentFile.slot === file.slot
            ? { ...currentFile, sgpa: data.sgpa }
            : currentFile
        )
      )
      setOverallCgpa(data.overallCgpa ?? null)
      setSuccess(data.message || "SGPA saved successfully.")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save SGPA."
      )
    } finally {
      setIsSaving(false)
    }
  }

  const savePercentage = async (file: PdfSetting, input: string) => {
    if (!SCHOOL_MARKSHEET_SLOTS.has(file.slot)) return

    const percentage = Number(input)

    if (
      !Number.isFinite(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      setError("Percentage must be between 0 and 100.")
      return
    }

    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/security/slot/${encodeURIComponent(
          file.slot
        )}/percentage`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": password,
          },
          body: JSON.stringify({ percentage }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save percentage."
        )
      }

      setFiles((currentFiles) =>
        currentFiles.map((currentFile) =>
          currentFile.slot === file.slot
            ? {
                ...currentFile,
                percentage: data.percentage,
              }
            : currentFile
        )
      )

      setSuccess(
        data.message || "Percentage saved successfully."
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save percentage."
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleAcademicEditSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!academicEdit) return

    if (academicEdit.type === "sgpa") {
      await saveSgpa(academicEdit.file, academicEditValue)
    } else {
      await savePercentage(
        academicEdit.file,
        academicEditValue
      )
    }

    setAcademicEdit(null)
    setAcademicEditValue("")
  }
  const handleAdminDownload = async (file: PdfSetting) => {
    if (!file.hasFile) {
      setError(`${file.displayName} has not been uploaded yet.`)
      return
    }

    try {
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/pdf/${encodeURIComponent(
          file.fileName
        )}`,
        {
          headers: {
            "X-Admin-Password": password,
          },
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
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      setSuccess(`${file.displayName} downloaded successfully.`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to download PDF."
      )
    }
  }

  const handlePreview = async (file: PdfSetting) => {
    if (!file.hasFile) {
      setError(`${file.displayName} has not been uploaded yet.`)
      return
    }

    try {
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/pdf/preview/${encodeURIComponent(
          file.fileName
        )}`,
        {
          headers: {
            "X-Admin-Password": password,
          },
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          data.message || "Unable to preview PDF."
        )
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank", "noopener,noreferrer")

      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to preview PDF."
      )
    }
  }

  const handleDelete = async (file: PdfSetting) => {
    if (!file.hasFile) {
      setError(`${file.displayName} has not been uploaded yet.`)
      return
    }

    const confirmed = window.confirm(
      `Delete the uploaded PDF from ${file.displayName}?\n\nThe fixed portfolio slot will remain available for a future upload.`
    )

    if (!confirmed) return

    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/pdf/${encodeURIComponent(
          file.fileName
        )}`,
        {
          method: "DELETE",
          headers: {
            "X-Admin-Password": password,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete PDF.")
      }

      setSuccess(data.message || "PDF deleted successfully.")
      await loadSecuritySettings(password)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete PDF."
      )
    } finally {
      setIsSaving(false)
    }
  }

  const submitIndividualPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!passwordModalFile) return

    if (newPdfPassword.trim().length < 4) {
      setError("Password must be at least 4 characters.")
      return
    }

    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/security/password/${encodeURIComponent(
          passwordModalFile.fileName
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": password,
          },
          body: JSON.stringify({ password: newPdfPassword }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to change PDF password."
        )
      }

      setSuccess(data.message || "PDF password changed successfully.")
      setNewPdfPassword("")
      setPasswordModalFile(null)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to change PDF password."
      )
    } finally {
      setIsSaving(false)
    }
  }

  const submitAllPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (allPdfPassword.length < 4) {
      setError("Password must be at least 4 characters.")
      return
    }

    if (allPdfPassword !== allPdfPasswordConfirm) {
      setError("New password and confirm password do not match.")
      return
    }

    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch(
        `${API_BASE}/api/admin/security/password/all`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": password,
          },
          body: JSON.stringify({ password: allPdfPassword }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to change all PDF passwords."
        )
      }

      setSuccess(
        data.message || "Passwords changed successfully."
      )
      setAllPdfPassword("")
      setAllPdfPasswordConfirm("")
      setShowAllPasswordModal(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to change all PDF passwords."
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
                Manage portfolio PDFs, passwords, visibility and academic results from one place.
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
                {isLoading ? "Checking..." : "Login to Admin Panel"}
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Administration
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              PDF Security &amp; Education Manager
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Upload or replace a PDF, control portfolio visibility, manage passwords and maintain semester SGPA data without editing source code.
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

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-5 shadow-xl sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                PDF Manager
              </p>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                Upload / Replace PDF
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Every option maps to one fixed portfolio slot. All eleven semester/document options stay selectable, even when no file has been uploaded yet.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs text-slate-500">Current calculated CGPA</p>
                  <p className="mt-1 text-3xl font-bold text-cyan-400">
                    {overallCgpa !== null ? overallCgpa.toFixed(2) : "Not set"}
                  </p>
                </div>
                <p className="text-xs leading-5 text-slate-500 sm:max-w-52 sm:text-right">
                  Average of the semester SGPA values currently entered in the manager.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpload} className="mt-7 space-y-5">
            <div ref={pdfDropdownRef} className="relative">
              <label
                htmlFor="pdf-slot"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Select PDF Type
              </label>

              <button
                id="pdf-slot"
                type="button"
                onClick={() =>
                  setIsPdfDropdownOpen((current) => !current)
                }
                disabled={isUploading || isSaving}
                aria-haspopup="listbox"
                aria-expanded={isPdfDropdownOpen}
                className={`group flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-300 ${
                  isPdfDropdownOpen
                    ? "border-cyan-400 bg-slate-950 shadow-lg shadow-cyan-500/10"
                    : "border-slate-700 bg-slate-950 hover:border-slate-600"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {selectedOption?.label || "Select PDF Type"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {selectedExistingFile?.hasFile
                        ? "Uploaded"
                        : "Not Uploaded"}
                    </p>
                  </div>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`ml-3 h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 ${
                    isPdfDropdownOpen
                      ? "rotate-180 text-cyan-400"
                      : "group-hover:text-slate-300"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              {isPdfDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-[100] mt-2">
                  <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#07101f]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">

                    <div
                      role="listbox"
                      className="mt-1 max-h-80 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#334155_transparent]"
                    >
                      {PDF_OPTIONS.map((option) => {
                        const existing = files.find(
                          (file) => file.slot === option.slot
                        )
                        const isSelected =
                          option.slot === selectedSlot

                        const isSchoolStart = option.slot === "classX"
                        const isDegreeStart = option.slot === "firstSemester"
                        const isProfessionalStart = option.slot === "resume"

            return (
              <div key={option.slot}>
                {isSchoolStart && (
                  <div className="border-b border-slate-800 px-3 pb-2.5 pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      SCHOOL DOCUMENTS
                    </p>
                  </div>
                )}

                {isDegreeStart && (
                  <div className="border-b border-slate-800 px-3 pb-2.5 pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      DEGREE / COLLEGE DOCUMENTS
                    </p>
                  </div>
                )}

                {isProfessionalStart && (
                  <div className="border-b border-slate-800 px-3 pb-2.5 pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      PROFESSIONAL DOCUMENTS
                    </p>
                  </div>
                )}

                            <button
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() =>
                                handleSlotChange(option.slot)
                              }
                              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                                isSelected
                                  ? "bg-cyan-400/10"
                                  : "hover:bg-white/[0.04]"
                              }`}
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition ${
                                  isSelected
                                    ? "bg-cyan-400/15 text-cyan-300"
                                    : existing?.hasFile
                                      ? "bg-emerald-400/10 text-emerald-300"
                                      : "bg-slate-800 text-slate-500"
                                }`}
                              >
                                {isSelected
                                  ? "\u2713"
                                  : existing?.hasFile
                                  ? "\u2713"
                                    : "\u2022"}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p
                                  className={`truncate text-sm font-medium ${
                                    isSelected
                                      ? "text-cyan-300"
                                      : "text-slate-200 group-hover:text-white"
                                  }`}
                                >
                                  {option.label}
                                </p>

                                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                  {existing?.hasFile
                                    ? "Uploaded"
                                    : "Not Uploaded"}
                                </p>
                              </div>

                              {isSelected && (
                                <span className="text-xs font-semibold text-cyan-400">
                                  Selected
                                </span>
                              )}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedOption && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Selected Slot
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {selectedOption.label}
                    </p>
                    <p className="mt-1 break-all text-xs text-slate-500">
                      Portfolio file: {selectedOption.fileName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      selectedExistingFile?.hasFile
                        ? "border-cyan-400/20 bg-cyan-400/5 text-cyan-300"
                        : "border-slate-700 bg-slate-900 text-slate-500"
                    }`}
                  >
                    {selectedExistingFile?.hasFile
                      ? "PDF Uploaded"
                      : "PDF Not Uploaded"}
                  </span>
                </div>
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="pdf-upload-input"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Choose PDF File
                </label>
                <input
                  id="pdf-upload-input"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-cyan-300"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Maximum file size: 10 MB.
                </p>
              </div>

              {SEMESTER_SLOTS.has(selectedSlot) ? (
                <div>
                  <label
                    htmlFor="semester-sgpa"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Semester SGPA
                  </label>
                  <input
                    id="semester-sgpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={uploadSgpa}
                    onChange={(event) =>
                      setUploadSgpa(event.target.value)
                    }
                    disabled={isUploading}
                    placeholder="Example: 8.78"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Used automatically for the calculated CGPA.
                  </p>
                </div>
              ) : SCHOOL_MARKSHEET_SLOTS.has(selectedSlot) ? (
                <div>
                  <label
                    htmlFor="school-percentage"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Percentage
                  </label>
                  <input
                    id="school-percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={uploadPercentage}
                    onChange={(event) =>
                      setUploadPercentage(event.target.value)
                    }
                    disabled={isUploading}
                    placeholder="Example: 70.4"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Percentage for the selected Class X or Class XII marksheet.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm font-medium text-slate-300">
                    Academic result
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    No academic result value is required for migration certificates or the resume.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="pdf-upload-password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                PDF Password
              </label>
              <input
                id="pdf-upload-password"
                type="password"
                value={uploadPassword}
                onChange={(event) =>
                  setUploadPassword(event.target.value)
                }
                disabled={isUploading || !uploadProtected}
                placeholder={
                  uploadProtected
                    ? "Enter password"
                    : "Protection is OFF"
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-white">
                  Password Protection
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  ON = visitors need the PDF password. OFF = direct download.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setUploadProtected((current) => !current)
                }
                disabled={isUploading}
                className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                  uploadProtected ? "bg-cyan-400" : "bg-slate-700"
                }`}
                aria-label="Toggle upload protection"
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg transition ${
                    uploadProtected ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading
                  ? "Uploading..."
                  : selectedExistingFile?.hasFile
                    ? "Replace PDF"
                    : "Upload PDF"}
              </button>
              <button
                type="button"
                onClick={resetUploadForm}
                disabled={isUploading}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-5 shadow-xl sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Global Security
              </p>
              <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                Master Protection
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                This is separate from the individual PDF protection toggles. Turning it OFF temporarily removes the password requirement globally while preserving individual settings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => updateMasterProtection(!masterProtected)}
              disabled={isSaving || isLoading}
              className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                masterProtected ? "bg-cyan-400" : "bg-slate-700"
              }`}
              aria-label="Toggle master protection"
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg transition ${
                  masterProtected ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
              Master: {masterProtected ? "ON" : "OFF"}
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-400">
              {files.filter((file) => file.hasFile).length} / 11 PDFs uploaded
            </span>
            <button
              type="button"
              onClick={() => setShowAllPasswordModal(true)}
              disabled={files.every((file) => !file.hasFile) || isSaving}
              className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Change Password for All PDFs
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Manage Documents
            </p>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              All PDF Slots
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Every slot is permanent. Delete removes only the uploaded file. The slot itself stays available for future uploads.
            </p>
          </div>

          <div className="space-y-4">
            {files.map((file) => {
              const effectiveProtected =
                masterProtected && file.protected

              return (
                <div
                  key={file.slot}
                  className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-white">
                            {file.displayName}
                          </h3>
                          <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {file.isSemester ? "Semester" : "Document"}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                              file.hasFile
                                ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                                : "border-slate-700 bg-slate-900 text-slate-500"
                            }`}
                          >
                            {file.hasFile ? "Uploaded" : "Not Uploaded"}
                          </span>
                        </div>

                        <p className="mt-1 break-all text-xs text-slate-500">
                          {file.fileName}
                        </p>

                        <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
                          <span>Size: {formatFileSize(file.sizeBytes)}</span>
                          <span>Updated: {formatDate(file.uploadedAt)}</span>
                          <span>
                            {file.isSemester
                              ? `SGPA: ${
                                  file.sgpa != null
                                    ? file.sgpa.toFixed(2)
                                    : "Not set"
                                }`
                              : SCHOOL_MARKSHEET_SLOTS.has(file.slot)
                                ? `Percentage: ${
                                    file.percentage != null
                                      ? `${file.percentage.toFixed(2)}%`
                                      : "Not set"
                                  }`
                                : "Not set"}
                          </span>
                          <span>
                            Portfolio: {file.hasFile && file.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                              effectiveProtected
                                ? "border-cyan-400/20 bg-cyan-400/5 text-cyan-300"
                                : "border-slate-700 bg-slate-900 text-slate-500"
                            }`}
                          >
                            Protection: {effectiveProtected ? "ON" : "OFF"}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                              file.enabled
                                ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                                : "border-slate-700 bg-slate-900 text-slate-500"
                            }`}
                          >
                            Portfolio Slot: {file.enabled ? "ON" : "OFF"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 xl:max-w-xl xl:justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSlot(file.slot)
                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            })
                          }}
                          className="rounded-xl border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400"
                        >
                          {file.hasFile ? "Replace PDF" : "Select"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePreview(file)}
                          disabled={!file.hasFile || isSaving || isUploading}
                          className="rounded-xl border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Preview
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAdminDownload(file)}
                          disabled={!file.hasFile || isSaving || isUploading}
                          className="rounded-xl border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Download
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPasswordModalFile(file)
                            setNewPdfPassword("")
                            setError("")
                          }}
                          disabled={!file.hasFile || isSaving || isUploading}
                          className="rounded-xl border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Change Password
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateIndividualProtection(
                              file.fileName,
                              !file.protected
                            )
                          }
                          disabled={!file.hasFile || isSaving || isUploading}
                          className={`relative h-9 w-16 shrink-0 rounded-full transition ${
                            file.protected ? "bg-cyan-400" : "bg-slate-700"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                          aria-label={`Toggle protection for ${file.displayName}`}
                        >
                          <span
                            className={`absolute top-1.5 h-6 w-6 rounded-full bg-white shadow-lg transition ${
                              file.protected ? "left-8" : "left-1.5"
                            }`}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateSlotEnabled(file.slot, !file.enabled)
                          }
                          disabled={isSaving || isUploading}
                          className={`relative h-9 w-16 shrink-0 rounded-full transition ${
                            file.enabled ? "bg-emerald-400" : "bg-slate-700"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                          aria-label={`Toggle portfolio slot for ${file.displayName}`}
                        >
                          <span
                            className={`absolute top-1.5 h-6 w-6 rounded-full bg-white shadow-lg transition ${
                              file.enabled ? "left-8" : "left-1.5"
                            }`}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(file)}
                          disabled={!file.hasFile || isSaving || isUploading}
                          className="rounded-xl border border-red-400/20 bg-red-400/5 px-3.5 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Protection
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {effectiveProtected ? "Password required" : "Direct download"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Portfolio
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {file.enabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Academic result
                        </p>

                        <div className="mt-1 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-white">
                            {file.isSemester && file.sgpa != null
                              ? `SGPA ${file.sgpa.toFixed(2)}`
                              : SCHOOL_MARKSHEET_SLOTS.has(file.slot) &&
                                  file.percentage != null
                                ? `Percentage ${file.percentage.toFixed(2)}%`
                                : "Not applicable"}
                          </p>

                          {file.isSemester && (
                            <button
                              type="button"
                              onClick={() => { setAcademicEdit({ file, type: "sgpa" }); setAcademicEditValue(file.sgpa != null ? String(file.sgpa) : "") }}
                              disabled={isSaving || isUploading}
                              className="rounded-lg border border-cyan-400/30 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Edit SGPA
                            </button>
                          )}

                          {SCHOOL_MARKSHEET_SLOTS.has(file.slot) && (
                            <button
                              type="button"
                              onClick={() => { setAcademicEdit({ file, type: "percentage" }); setAcademicEditValue(file.percentage != null ? String(file.percentage) : "") }}
                              disabled={isSaving || isUploading}
                              className="rounded-lg border border-cyan-400/30 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Edit Percentage
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {academicEdit && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md"
          onMouseDown={() => {
            if (!isSaving) {
              setAcademicEdit(null)
              setAcademicEditValue("")
            }
          }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/95 shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-800 bg-gradient-to-r from-cyan-400/10 via-blue-500/5 to-transparent px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                    Academic Result
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-white">
                    Edit {academicEdit.type === "sgpa" ? "SGPA" : "Percentage"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {academicEdit.file.displayName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAcademicEdit(null)
                    setAcademicEditValue("")
                  }}
                  disabled={isSaving}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/60 text-lg text-slate-400 transition hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>

            <form
              onSubmit={handleAcademicEditSubmit}
              className="space-y-5 px-6 py-6"
            >
              <div>
                <label
                  htmlFor="academic-edit-value"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  {academicEdit.type === "sgpa" ? "SGPA" : "Percentage"}
                </label>

                <div className="flex items-center overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/90 transition focus-within:border-cyan-400/70 focus-within:ring-4 focus-within:ring-cyan-400/10">
  <button
    type="button"
    onClick={() => {
      const current = Number(academicEditValue) || 0
      const next = Math.max(0, current - 0.01)
      setAcademicEditValue(next.toFixed(2))
    }}
    disabled={isSaving}
    className="m-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-lg font-bold text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
    aria-label="Decrease value"
  >
    -
  </button>

  <input
    id="academic-edit-value"
    type="text"
    value={academicEditValue}
    onChange={(event) =>
      setAcademicEditValue(
        event.target.value.replace(/[^\d.]/g, "")
      )
    }
    inputMode="decimal"
    autoFocus
    placeholder={
      academicEdit.type === "sgpa" ? "8.95" : "70.40"
    }
    className="min-w-0 flex-1 bg-transparent px-3 py-4 text-center text-lg font-bold tracking-wide text-white outline-none placeholder:text-slate-600/60"
  />

  <span className="pointer-events-none mr-1.5 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-bold tracking-wide text-cyan-300">
    {academicEdit.type === "sgpa" ? "/ 10" : "%"}
  </span>

  <button
    type="button"
    onClick={() => {
      const max =
        academicEdit.type === "sgpa" ? 10 : 100
      const current = Number(academicEditValue) || 0
      const next = Math.min(max, current + 0.01)
      setAcademicEditValue(next.toFixed(2))
    }}
    disabled={isSaving}
    className="m-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-lg font-bold text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
    aria-label="Increase value"
  >
    +
  </button>
</div>
<p className="mt-2 text-xs text-slate-500">
                  {academicEdit.type === "sgpa"
                    ? "Enter a value from 0 to 10."
                    : "Enter a value from 0 to 100."}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAcademicEdit(null)
                    setAcademicEditValue("")
                  }}
                  disabled={isSaving}
                  className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving || !academicEditValue.trim()}
                  className="flex-1 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {passwordModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  PDF Password
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  Change password
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {passwordModalFile.displayName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModalFile(null)}
                className="text-xl text-slate-500 hover:text-white"
                aria-label="Close"
              >
                  <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form onSubmit={submitIndividualPassword} className="mt-6 space-y-4">
              <input
                type="password"
                value={newPdfPassword}
                onChange={(event) => setNewPdfPassword(event.target.value)}
                placeholder="New password"
                autoFocus
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPasswordModalFile(null)}
                  className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAllPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Global PDF Password
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  Change Password for All PDFs
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  This updates the password of every currently uploaded PDF. Empty slots are skipped automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllPasswordModal(false)}
                className="text-xl text-slate-500 hover:text-white"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form onSubmit={submitAllPassword} className="mt-6 space-y-4">
              <input
                type="password"
                value={allPdfPassword}
                onChange={(event) => setAllPdfPassword(event.target.value)}
                placeholder="New password"
                autoFocus
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400"
              />
              <input
                type="password"
                value={allPdfPasswordConfirm}
                onChange={(event) =>
                  setAllPdfPasswordConfirm(event.target.value)
                }
                placeholder="Confirm password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAllPasswordModal(false)}
                  className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
                >
                  {isSaving ? "Changing..." : "Change All Passwords"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminPdfSecurity





