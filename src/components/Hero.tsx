import { useEffect, useRef, useState, type FormEvent } from "react"



const API_BASE =

  window.location.hostname === "localhost" ||

  window.location.hostname === "127.0.0.1"

    ? "http://localhost:5000"

    : "https://developer-portfolio-8.onrender.com"



function Hero() {

  const roles = [

    "Jr. Software Developer",
"Graphic Designer",
    "Frontend Developer",

    "React Developer",

    "Web Developer",
"Graphic Designer",

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

          currentRole.slice(0, typedRole.length + 1)

        )



        if (typedRole === currentRole) {

          setTimeout(() => {

            setIsDeleting(true)

          }, 1400)

        }

      } else {

        setTypedRole(

          currentRole.slice(0, typedRole.length - 1)

        )



        if (typedRole === "") {

          setIsDeleting(false)



          setRoleIndex(

            (prev) => (prev + 1) % roles.length

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

          const data = await response.json()



          errorMessage =

            data.message || errorMessage

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



      const blob = await response.blob()



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



  const handleResumeDownload = async () => {

    try {

      setIsCheckingResume(true)

      setResumeError("")



      const response = await fetch(

        `${API_BASE}/api/protected-pdf/status/resume.pdf`

      )



      const data = await response.json()



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
 className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-12 lg:px-8 lg:pt-32 lg:pb-16"
>

        {/* Background Glow */}



        <div className="pointer-events-none absolute left-[8%] top-[15%] -z-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-[110px]" />



        <div className="pointer-events-none absolute bottom-[5%] right-[8%] -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />



        {/* Main Container */}



        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">

          {/* LEFT CONTENT */}



          <div className="min-w-0 text-center lg:text-left">



            {/* Availability */}



            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-400/5 px-3.5 py-1.5 text-[11px] font-medium text-green-400 backdrop-blur-sm sm:text-xs">

              <span className="relative flex h-2 w-2">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />

              </span>



              Available for Opportunities

            </div>



            {/* Greeting */}



            <p className="text-sm font-medium text-slate-400 sm:text-base">

              Hi, I'm

            </p>



            {/* NAME */}



            <h1 className="mt-1 text-[clamp(2rem,6vw,3.35rem)] font-bold leading-tight tracking-tight text-white">Divyanshu Singh</h1>



            {/* Typing Role */}



            <div className="mt-3 flex min-h-[30px] items-center justify-center lg:justify-start">

              <span className="text-sm font-semibold text-slate-300 sm:text-lg">

                {typedRole}

              </span>



              <span className="ml-1 h-5 w-[2px] animate-pulse bg-cyan-400" />

            </div>



            {/* Description */}



            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-slate-400 sm:text-base sm:leading-7 lg:mx-0">

              I build modern, responsive and user-friendly web

              applications with a focus on clean code, creative

              interfaces and practical solutions.

            </p>



            {/* Buttons */}



            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">

              {/* Projects */}



              <a

                href="#projects"

                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20 sm:w-auto"

              >

                View Projects



                <span className="transition-transform duration-300 group-hover:translate-x-1">

                  →

                </span>

              </a>



              {/* Contact */}



              <a

                href="#contact"

                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-900/40 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-cyan-400/5 hover:text-cyan-400 sm:w-auto"

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

                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"

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

              <div className="mx-auto mt-4 max-w-lg rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-left text-sm text-red-300 lg:mx-0">

                {resumeError}

              </div>

            )}



            {/* Social Links */}



            <div className="mt-7 flex items-center justify-center gap-5 lg:justify-start">

              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-600">

                Connect

              </span>



              {/* GitHub */}



              <a

                href="https://github.com/divyanshusingh-dev"

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
  rel="noopener noreferrer"
  aria-label="LinkedIn"
  title="LinkedIn"
  className="text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:text-cyan-400"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.53v16.94c0 .85.69 1.53 1.55 1.53h16.9c.86 0 1.55-.68 1.55-1.53V3.53c0-.85-.69-1.53-1.55-1.53ZM7.93 18.46H4.96V9h2.97v9.46ZM6.45 7.71a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.01 10.75h-2.97v-4.6c0-1.1-.02-2.51-1.53-2.51-1.53 0-1.77 1.19-1.77 2.43v4.68H9.22V9h2.85v1.29h.04c.4-.75 1.37-1.53 2.81-1.53 3.01 0 3.56 1.98 3.56 4.56v5.14Z" />
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


<a
  href="https://www.instagram.com/divyanshusingh_0077/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Instagram"
  title="Follow me on Instagram"
  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/20 hover:bg-pink-500/10 hover:text-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="18" cy="6" r="0.8" fill="currentColor" />
  </svg>
</a>

<a
  href="https://wa.me/9473681245"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="WhatsApp"
  title="WhatsApp"
  className="inline-flex items-center justify-center text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:text-green-400"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .15 5.34.15 11.9c0 2.1.55 4.15 1.6 5.96L.05 24l6.29-1.65a11.9 11.9 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9a11.83 11.83 0 0 0-3.45-8.43ZM12.07 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98.99-3.64-.23-.37a9.88 9.88 0 0 1-1.52-5.28c0-5.46 4.45-9.9 9.91-9.9a9.83 9.83 0 0 1 7.01 2.91 9.84 9.84 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.92 9.9Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
  </svg>
</a>

            </div>

          </div>



          {/* RIGHT CODE CARD */}



          <div className="relative w-full min-w-0">

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />



            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">

              {/* Window Header */}



              <div className="flex h-12 items-center justify-between border-b border-slate-700/70 px-4 sm:h-14 sm:px-5">

                <div className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />

                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />

                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                </div>



                <span className="font-mono text-[11px] text-slate-500 sm:text-xs">

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



                <div className="my-5 h-px w-full bg-slate-700/70" />



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



              {/* Bottom Accent */}



              <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

            </div>

          </div>

        </div>



        {/* Scroll Indicator */}



        <a

          href="#about"

          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-600 transition hover:text-cyan-400 sm:flex"

        >

          <span className="text-[9px] font-semibold uppercase tracking-[0.3em]">

            Scroll

          </span>



          <span className="flex h-7 w-5 items-start justify-center rounded-full border border-slate-700 p-1">

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



            <form onSubmit={handlePasswordSubmit}>

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

                  setPassword(event.target.value)

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