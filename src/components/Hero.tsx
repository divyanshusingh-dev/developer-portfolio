import { useEffect, useRef, useState, type FormEvent } from "react"

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com"

function Hero() {
  const roles = [
    "Jr. Software Developer",
    "Frontend Developer",
    "React Developer",
    "Web Developer",
  ]

  const [roleIndex, setRoleIndex] = useState(0)
  const [typedRole, setTypedRole] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const [password, setPassword] = useState("")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isCheckingResume, setIsCheckingResume] = useState(false)
  const [isDownloadingResume, setIsDownloadingResume] = useState(false)
  const [resumeError, setResumeError] = useState("")

  const passwordInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const currentRole = roles[roleIndex]
    const typingSpeed = isDeleting ? 50 : 85

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setTypedRole(
          currentRole.slice(
            0,
            typedRole.length + 1
          )
        )

        if (typedRole === currentRole) {
          setTimeout(() => {
            setIsDeleting(true)
          }, 1400)
        }
      } else {
        setTypedRole(
          currentRole.slice(
            0,
            typedRole.length - 1
          )
        )

        if (typedRole === "") {
          setIsDeleting(false)

          setRoleIndex(
            (prev) =>
              (prev + 1) % roles.length
          )
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [typedRole, isDeleting, roleIndex])

  useEffect(() => {
    if (showPasswordModal) {
      setTimeout(() => {
        passwordInputRef.current?.focus()
      }, 100)
    }
  }, [showPasswordModal])

  const closePasswordModal = () => {
    if (isDownloadingResume) return

    setShowPasswordModal(false)
    setPassword("")
    setResumeError("")
    setIsCheckingResume(false)
  }

  const downloadResume = async (
    enteredPassword: string
  ) => {
    try {
      setIsDownloadingResume(true)
      setResumeError("")

      const response = await fetch(
        `${API_BASE}/api/protected-pdf`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fileName: "resume.pdf",
            password: enteredPassword,
          }),
        }
      )

      const contentType =
        response.headers.get("content-type") || ""

      if (!response.ok) {
        let errorMessage =
          "Unable to download resume."

        if (
          contentType.includes(
            "application/json"
          )
        ) {
          const data =
            await response.json()

          errorMessage =
            data.message ||
            errorMessage
        }

        throw new Error(errorMessage)
      }

      if (
        !contentType.includes(
          "application/pdf"
        )
      ) {
        throw new Error(
          "Invalid PDF response received from the server."
        )
      }

      const blob =
        await response.blob()

      if (!blob.size) {
        throw new Error(
          "The resume PDF is empty."
        )
      }

      const blobUrl =
        window.URL.createObjectURL(blob)

      const link =
        document.createElement("a")

      link.href = blobUrl
      link.download = "resume.pdf"

      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(blobUrl)

      setShowPasswordModal(false)
      setPassword("")
      setResumeError("")
    } catch (error) {
      console.error(
        "Resume download error:",
        error
      )

      setResumeError(
        error instanceof Error
          ? error.message
          : "Unable to download resume."
      )
    } finally {
      setIsDownloadingResume(false)
    }
  }

  const handleResumeDownload =
    async () => {
      try {
        setIsCheckingResume(true)
        setResumeError("")

        const response = await fetch(
          `${API_BASE}/api/protected-pdf/status/resume.pdf`
        )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to check resume status."
          )
        }

        if (data.protected) {
          setPassword("")
          setResumeError("")
          setShowPasswordModal(true)

          return
        }

        await downloadResume("")
      } catch (error) {
        console.error(
          "Resume status error:",
          error
        )

        setResumeError(
          error instanceof Error
            ? error.message
            : "Unable to access resume."
        )
      } finally {
        setIsCheckingResume(false)
      }
    }

  const handlePasswordSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!password.trim()) {
      setResumeError(
        "Please enter the password."
      )

      return
    }

    await downloadResume(password)
  }

  return (
    <>
      <section
        id="home"
        className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        {/* Background Glow */}

        <div className="pointer-events-none absolute left-[5%] top-[15%] -z-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="pointer-events-none absolute bottom-[5%] right-[5%] -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[130px]" />

        {/* Main Container */}

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT CONTENT */}

          <div className="min-w-0 text-center lg:text-left">
            {/* Availability */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400 bg-green-400/5 px-4 py-2 text-xs font-medium text-green-400 backdrop-blur-sm sm:text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>

              Available for Opportunities
            </div>

            {/* Greeting */}

            <p className="text-base font-medium text-slate-400 sm:text-lg">
              Hi, I'm
            </p>

            {/* NAME */}

            <h1 className="mt-2 whitespace-nowrap text-[clamp(2rem,8vw,3.75rem)] font-black leading-tight tracking-tight text-white">
              <span>Divyanshu </span>

              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Singh
              </span>
            </h1>

            {/* Typing Role */}

            <div className="mt-5 flex min-h-[36px] items-center justify-center lg:justify-start">
              <span className="text-base font-semibold text-slate-300 sm:text-xl">
                {typedRole}
              </span>

              <span className="ml-1 h-5 w-[2px] animate-pulse bg-cyan-400 sm:h-6" />
            </div>

            {/* Description */}

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8 lg:mx-0">
              I build modern, responsive and user-friendly web
              applications with a focus on clean code, creative
              interfaces and practical solutions.
            </p>

            {/* Buttons */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              {/* Projects */}

              <a
                href="#projects"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20 sm:w-auto"
              >
                View Projects

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>

              {/* Contact */}

              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-900/40 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-cyan-400/5 hover:text-cyan-400 sm:w-auto"
              >
                Contact Me
              </a>

              {/* Resume */}

              <button
                type="button"
                onClick={handleResumeDownload}
                disabled={
                  isCheckingResume ||
                  isDownloadingResume
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-6 py-3.5 text-sm font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isCheckingResume
                  ? "Checking..."
                  : "Resume"}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v12"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m7 10 5 5 5-5"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 21h14"
                  />
                </svg>
              </button>
            </div>

            {/* Resume Error */}

            {resumeError && (
              <div className="mt-4 w-full max-w-xl rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-left text-sm text-red-300 lg:max-w-none">
                {resumeError}
              </div>
            )}

            {/* Social Links */}

            <div className="mt-8 flex items-center justify-center gap-5 lg:justify-start">
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-slate-600">
                Connect
              </span>

              {/* GitHub */}

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:text-cyan-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.455-1.158-1.11-1.467-1.11-1.467-.908-.621.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.6 9.6 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.414-.012 2.741 0 .268.18.58.688.482A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z" />
                </svg>
              </a>

              {/* LinkedIn */}

              <a
                href="https://linkedin.com/in/divyanshusingh077"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:text-cyan-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.049c.476-.9 1.637-1.853.37-1.85 3.605 0 4.27 2.372 4.27 5.456v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V8.999h3.564v11.453ZM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                </svg>
              </a>

              {/* Email */}

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=divyanshusingh2006r@gmail.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Email"
                className="text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:text-cyan-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect
                    width="20"
                    height="16"
                    x="2"
                    y="4"
                    rx="2"
                  />

                  <path d="m22 7-10 5L2 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* RIGHT CODE CARD */}

          <div className="relative w-full min-w-0">
            {/* Glow */}

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

            {/* Code Window */}

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
              <div className="overflow-x-auto px-4 py-5 font-mono text-xs leading-6 sm:px-5 sm:py-6 sm:text-sm sm:leading-7">
                {/* Header */}

                <div className="flex h-14 items-center justify-between border-b border-slate-700/70 px-4 sm:h-16 sm:px-5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>

                  <span className="font-mono text-xs text-slate-500 sm:text-sm">
                    developer.ts
                  </span>
                </div>

                {/* Code */}

                <div className="overflow-x-auto px-5 py-6 font-mono text-xs leading-7 sm:px-6 sm:py-7 sm:text-sm sm:leading-8">
                  <div className="whitespace-nowrap">
                    <span className="text-purple-400">
                      const
                    </span>{" "}
                    <span className="text-cyan-400">
                      developer
                    </span>{" "}
                    <span className="text-slate-300">
                      =
                    </span>{" "}
                    <span className="text-slate-300">
                      {"{"}
                    </span>
                  </div>

                  <div className="ml-5 whitespace-nowrap sm:ml-6">
                    <span className="text-slate-400">
                      name:
                    </span>{" "}
                    <span className="text-emerald-400">
                      "Divyanshu Singh"
                    </span>
                    <span className="text-slate-300">
                      ,
                    </span>
                  </div>

                  <div className="ml-5 whitespace-nowrap sm:ml-6">
                    <span className="text-slate-400">
                      role:
                    </span>{" "}
                    <span className="text-emerald-400">
                      "Jr. Software Developer"
                    </span>
                    <span className="text-slate-300">
                      ,
                    </span>
                  </div>

                  <div className="ml-5 whitespace-nowrap sm:ml-6">
                    <span className="text-slate-400">
                      focus:
                    </span>{" "}
                    <span className="text-emerald-400">
                      "Web Development"
                    </span>
                    <span className="text-slate-300">
                      ,
                    </span>
                  </div>

                  <div className="ml-5 whitespace-nowrap sm:ml-6">
                    <span className="text-slate-400">
                      learning:
                    </span>{" "}
                    <span className="text-emerald-400">
                      "Backend & Cloud"
                    </span>
                  </div>

                  <div className="text-slate-300">
                    {"}"}
                  </div>

                  {/* Divider */}

                  <div className="my-5 h-px w-full bg-slate-700/70" />

                  {/* Learning Loop */}

                  <div className="whitespace-nowrap">
                    <span className="text-purple-400">
                      while
                    </span>{" "}
                    <span className="text-slate-300">
                      (
                    </span>
                    <span className="text-cyan-400">
                      learning
                    </span>
                    <span className="text-slate-300">
                      ) {"{"}
                    </span>
                  </div>

                  <div className="ml-5 whitespace-nowrap text-slate-400 sm:ml-6">
                    build();
                  </div>

                  <div className="ml-5 whitespace-nowrap text-slate-400 sm:ml-6">
                    improve();
                  </div>

                  <div className="ml-5 whitespace-nowrap text-slate-400 sm:ml-6">
                    repeat();
                  </div>

                  <div className="text-slate-300">
                    {"}"}
                  </div>

                  {/* Status */}

                  <div className="mt-5 flex items-center gap-2 whitespace-nowrap text-emerald-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                    <span>
                      Ready to build
                    </span>

                    <span className="animate-pulse">
                      _
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Accent */}

              <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}

        <a
          href="#about"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-600 transition hover:text-cyan-400 sm:flex"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
            Scroll
          </span>

          <span className="flex h-8 w-5 items-start justify-center rounded-full border border-slate-700 p-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
          </span>
        </a>
      </section>

      {/* Resume Password Modal */}

      {showPasswordModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Protected Resume
                </p>

                <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  Enter Password
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Enter the password to download the protected resume.
                </p>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={isDownloadingResume}
                className="rounded-lg border border-slate-700 px-3 py-2 text-slate-400 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close password dialog"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handlePasswordSubmit}
            >
              <label
                htmlFor="hero-resume-password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <input
                ref={passwordInputRef}
                id="hero-resume-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  )

                  setResumeError("")
                }}
                placeholder="Enter password"
                autoComplete="off"
                disabled={isDownloadingResume}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />

              {resumeError && (
                <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                  {resumeError}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={isDownloadingResume}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isDownloadingResume}
                  className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDownloadingResume
                    ? "Downloading..."
                    : "Unlock & Download"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Hero