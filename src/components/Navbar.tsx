import { useEffect, useState } from "react"



function Navbar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [isScrolled, setIsScrolled] = useState(false)

  const [activeSection, setActiveSection] = useState("home")

  const [scrollProgress, setScrollProgress] = useState(0)



  const navLinks = [

    { name: "Home", href: "#home" },

    { name: "About", href: "#about" },

    { name: "Skills", href: "#skills" },

    { name: "Projects", href: "#projects" },

    { name: "Experience", href: "#experience" },

    { name: "Education", href: "#education" },

    { name: "Contact", href: "#contact" },

  ]



  /* ================= SCROLL EFFECTS ================= */

  useEffect(() => {

    const handleScroll = () => {

      setIsScrolled(window.scrollY > 20)



      const scrollTop = window.scrollY

      const documentHeight =

        document.documentElement.scrollHeight - window.innerHeight



      const progress =

        documentHeight > 0

          ? (scrollTop / documentHeight) * 100

          : 0



      setScrollProgress(progress)

    }



    window.addEventListener("scroll", handleScroll)

    handleScroll()



    return () => {

      window.removeEventListener("scroll", handleScroll)

    }

  }, [])



  /* ================= ACTIVE SECTION ================= */

  useEffect(() => {

    const sections = navLinks

      .map((link) => document.querySelector(link.href))

      .filter((section): section is Element => Boolean(section))



    const observer = new IntersectionObserver(

      (entries) => {

        const visibleSections = entries

          .filter((entry) => entry.isIntersecting)

          .sort(

            (a, b) =>

              b.intersectionRatio - a.intersectionRatio

          )



        if (visibleSections.length > 0) {

          setActiveSection(

            visibleSections[0].target.id

          )

        }

      },

      {

        root: null,

        rootMargin: "-20% 0px -60% 0px",

        threshold: [0.1, 0.25, 0.5, 0.75],

      }

    )



    sections.forEach((section) => {

      observer.observe(section)

    })



    return () => {

      observer.disconnect()

    }

  }, [])



  /* ================= CLOSE MOBILE MENU ================= */

  const handleLinkClick = () => {

    setIsMenuOpen(false)

  }



  return (

    <>

      {/* ================================================= */}

      {/* SCROLL PROGRESS BAR */}

      {/* ================================================= */}



      <div className="fixed left-0 top-0 z-[60] h-[2px] w-full bg-transparent">

        <div

          className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-[width] duration-100"

          style={{

            width: `${scrollProgress}%`,

          }}

        />

      </div>



      {/* ================================================= */}

      {/* NAVBAR */}

      {/* ================================================= */}



      <header

        className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${

          isScrolled

            ? "border-slate-700/30 bg-transparent backdrop-blur-md"

            : "border-transparent bg-transparent"

        }`}

      >

        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">



          {/* ================= LOGO ================= */}



          <a

            href="#home"

            onClick={handleLinkClick}

            className="group flex items-center gap-1.5"

          >

            <span className="text-lg font-bold tracking-tight text-white transition duration-300 group-hover:text-cyan-400 sm:text-xl">

              Divyanshu

            </span>



            <span className="text-lg font-bold text-cyan-400 sm:text-xl">

              Singh

            </span>

          </a>



          {/* ================= DESKTOP NAV ================= */}



          <div className="hidden items-center gap-1 lg:flex">

            {navLinks.map((link) => {

              const sectionId = link.href.replace("#", "")

              const isActive =

                activeSection === sectionId



              return (

                <a

                  key={link.name}

                  href={link.href}

                  className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${

                    isActive

                      ? "bg-cyan-400/10 text-cyan-400"

                      : "text-slate-300 hover:bg-cyan-400/5 hover:text-cyan-400"

                  }`}

                >

                  {link.name}



                  {/* Active / Hover Underline */}

                  <span

                    className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-cyan-400 transition-all duration-300 ${

                      isActive

                        ? "w-1/2"

                        : "w-0 group-hover:w-1/2"

                    }`}

                  />

                </a>

              )

            })}

          </div>



          {/* ================================================= */}

          {/* DESKTOP ACTION BUTTONS */}

          {/* ================================================= */}



          <div className="hidden items-center gap-2 lg:flex">



            {/* ================= ADMIN LOGIN ================= */}



            <a

              href="/admin-pdf-security"

              className="group inline-flex items-center gap-2 rounded-lg border border-purple-400/40 bg-purple-400/5 px-4 py-2 text-sm font-semibold text-purple-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400 hover:bg-purple-400 hover:text-white hover:shadow-lg hover:shadow-purple-400/20"

            >

              {/* Lock Icon */}

              <svg

                xmlns="http://www.w3.org/2000/svg"

                className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"

                viewBox="0 0 24 24"

                fill="none"

                stroke="currentColor"

                strokeWidth="2"

              >

                <rect

                  width="18"

                  height="11"

                  x="3"

                  y="11"

                  rx="2"

                />

                <path d="M7 11V7a5 5 0 0 1 10 0v4" />

              </svg>



              Admin Login

            </a>



            {/* ================= LET'S TALK ================= */}



            <a

              href="#contact"

              className="inline-flex items-center rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2 text-sm font-semibold text-cyan-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-400 hover:text-slate-950 hover:shadow-lg hover:shadow-cyan-400/20"

            >

              Let's Talk

            </a>



          </div>



          {/* ================================================= */}

          {/* MOBILE MENU BUTTON */}

          {/* ================================================= */}



          <button

            type="button"

            aria-label={

              isMenuOpen

                ? "Close menu"

                : "Open menu"

            }

            aria-expanded={isMenuOpen}

            onClick={() =>

              setIsMenuOpen(!isMenuOpen)

            }

            className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-transparent transition-all duration-300 lg:hidden ${

              isMenuOpen

                ? "border-cyan-400 text-cyan-400"

                : "border-slate-700/70 text-slate-200 hover:border-cyan-400 hover:text-cyan-400"

            }`}

          >

            {isMenuOpen ? (

              /* X ICON */

              <svg

                xmlns="http://www.w3.org/2000/svg"

                className="h-5 w-5"

                viewBox="0 0 24 24"

                fill="none"

                stroke="currentColor"

                strokeWidth="2"

              >

                <path

                  strokeLinecap="round"

                  strokeLinejoin="round"

                  d="M6 18L18 6M6 6l12 12"

                />

              </svg>

            ) : (

              /* MENU ICON */

              <svg

                xmlns="http://www.w3.org/2000/svg"

                className="h-5 w-5"

                viewBox="0 0 24 24"

                fill="none"

                stroke="currentColor"

                strokeWidth="2"

              >

                <path

                  strokeLinecap="round"

                  strokeLinejoin="round"

                  d="M4 6h16M4 12h16M4 18h16"

                />

              </svg>

            )}

          </button>

        </nav>



        {/* ================================================= */}

        {/* MOBILE MENU */}

        {/* ================================================= */}



        <div

          className={`overflow-hidden border-t border-slate-800/30 bg-transparent backdrop-blur-md transition-all duration-300 lg:hidden ${

            isMenuOpen

              ? "max-h-[700px] opacity-100"

              : "max-h-0 border-t-0 opacity-0"

          }`}

        >

          <div className="space-y-1 px-4 py-4 sm:px-6">



            {/* ================= NAV LINKS ================= */}



            {navLinks.map((link) => {

              const sectionId =

                link.href.replace("#", "")



              const isActive =

                activeSection === sectionId



              return (

                <a

                  key={link.name}

                  href={link.href}

                  onClick={handleLinkClick}

                  className={`group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${

                    isActive

                      ? "bg-cyan-400/10 text-cyan-400"

                      : "text-slate-300 hover:bg-cyan-400/5 hover:pl-5 hover:text-cyan-400"

                  }`}

                >

                  <span>{link.name}</span>



                  <span

                    className={`transition-all duration-300 ${

                      isActive

                        ? "translate-x-1 text-cyan-400"

                        : "text-slate-600 group-hover:translate-x-1 group-hover:text-cyan-400"

                    }`}

                  >

                    →

                  </span>

                </a>

              )

            })}



            {/* ================================================= */}

            {/* MOBILE ADMIN LOGIN */}

            {/* ================================================= */}



            <a

              href="/admin-pdf-security"

              onClick={handleLinkClick}

              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-purple-400/40 bg-purple-400/5 px-4 py-3 text-sm font-semibold text-purple-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400 hover:bg-purple-400 hover:text-white hover:shadow-lg hover:shadow-purple-400/20"

            >

              {/* Lock Icon */}

              <svg

                xmlns="http://www.w3.org/2000/svg"

                className="h-4 w-4"

                viewBox="0 0 24 24"

                fill="none"

                stroke="currentColor"

                strokeWidth="2"

              >

                <rect

                  width="18"

                  height="11"

                  x="3"

                  y="11"

                  rx="2"

                />

                <path d="M7 11V7a5 5 0 0 1 10 0v4" />

              </svg>



              Admin Login

            </a>



            {/* ================================================= */}

            {/* MOBILE LET'S TALK */}

            {/* ================================================= */}



            <a

              href="#contact"

              onClick={handleLinkClick}

              className="mt-2 flex w-full items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-3 text-sm font-semibold text-cyan-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-400 hover:text-slate-950"

            >

              Let's Talk

            </a>



          </div>

        </div>

      </header>

    </>

  )

}



export default Navbar