
import { useEffect, useRef } from "react"
import type { CSSProperties } from "react"
import { Award, ExternalLink, Sparkles } from "lucide-react"

const credentials = [
  {
    title: "Introduction to Artificial Intelligence",
    issuer: "Microsoft",
    type: "AI / Technology",
    note: "Add the official credential URL or certificate image to verify this credential.",
  },
  {
    title: "Adobe Photoshop",
    issuer: "Infosys Springboard",
    type: "Design",
    note: "Add the official credential URL or certificate image to verify this credential.",
  },
  {
    title: "W3.CSS Beginners",
    issuer: "W3Schools",
    type: "Web Development",
    note: "Add the official credential URL or certificate image to verify this credential.",
  },
  {
    title: "Graphics Designing (Photoshop & Canva)",
    issuer: "SVGOI / ISTE",
    type: "Graphic Design",
    note: "Add the official credential URL or certificate image to verify this credential.",
  },
  {
    title: "Digital Poster Making",
    issuer: "SVGOI",
    type: "Achievement · 27 Feb 2025",
    note: "Add a photo or scan of the certificate for visitors to view.",
  },
  {
    title: "MY Bharat Budget Quest 2026",
    issuer: "MY Bharat",
    type: "Quiz / Participation · 20 Feb 2026",
    note: "Add the official credential URL or certificate image to verify this credential.",
  },
]

function Certifications() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const elements = section.querySelectorAll(".cert-reveal")

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("cert-show"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cert-show")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="cert-premium relative isolate overflow-hidden border-t border-slate-800/80 bg-slate-950 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <style>{`
        .cert-premium {
          --cert-cyan: 34, 211, 238;
          background-image:
            radial-gradient(ellipse at 12% 20%, rgba(8,145,178,.10), transparent 38%),
            radial-gradient(ellipse at 90% 75%, rgba(14,116,144,.10), transparent 35%);
        }

        .cert-grid-bg {
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: .15;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(148,163,184,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,.08) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }

        .cert-orb {
          position: absolute;
          z-index: -1;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: rgba(6,182,212,.10);
          filter: blur(90px);
          pointer-events: none;
          animation: certOrbFloat 9s ease-in-out infinite alternate;
        }

        .cert-orb-one {
          top: 8%;
          left: -140px;
        }

        .cert-orb-two {
          right: -150px;
          bottom: 5%;
          animation-delay: -4s;
        }

        @keyframes certOrbFloat {
          from { transform: translate3d(0, -15px, 0); }
          to { transform: translate3d(35px, 35px, 0); }
        }

        .cert-reveal {
          opacity: 0;
          transform: translateY(38px);
          transition:
            opacity .8s ease,
            transform .8s cubic-bezier(.2,.75,.25,1);
          transition-delay: var(--delay, 0ms);
        }

        .cert-reveal.cert-show {
          opacity: 1;
          transform: translateY(0);
        }

        .cert-heading {
          animation: certHeadingIn .9s cubic-bezier(.2,.75,.25,1) both;
        }

        @keyframes certHeadingIn {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cert-title-line {
          width: 68px;
          height: 3px;
          border-radius: 99px;
          background: linear-gradient(90deg, #22d3ee, #0e7490, transparent);
          animation: certLineGrow 1.2s ease both;
          transform-origin: left;
        }

        @keyframes certLineGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .cert-card {
          position: relative;
          isolation: isolate;
          border: 1px solid rgba(148,163,184,.14);
          background: linear-gradient(
            145deg,
            rgba(30,41,59,.72),
            rgba(15,23,42,.78)
          );
          box-shadow: 0 8px 30px rgba(0,0,0,.12);
          transition:
            transform .45s cubic-bezier(.2,.75,.25,1),
            border-color .4s ease,
            box-shadow .4s ease;
        }

        .cert-card::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(34,211,238,0),
            rgba(34,211,238,.55),
            rgba(99,102,241,.25),
            rgba(34,211,238,0)
          );
          opacity: 0;
          transition: opacity .45s ease;
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .cert-card:hover {
          transform: translateY(-10px) scale(1.015);
          border-color: rgba(34,211,238,.35);
          box-shadow:
            0 22px 55px rgba(0,0,0,.32),
            0 0 35px rgba(34,211,238,.08);
        }

        .cert-card:hover::before {
          opacity: 1;
        }

        .cert-shine {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
        }

        .cert-shine::after {
          content: "";
          position: absolute;
          top: -80%;
          left: -100%;
          width: 65%;
          height: 260%;
          transform: rotate(25deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.07),
            transparent
          );
          transition: left .8s ease;
        }

        .cert-card:hover .cert-shine::after {
          left: 150%;
        }

        .cert-number {
          color: rgba(148,163,184,.30);
          transition: color .4s ease, transform .4s ease;
        }

        .cert-card:hover .cert-number {
          color: rgba(34,211,238,.8);
          transform: translateY(-3px);
        }

        .cert-icon-wrap {
          position: relative;
          transition: transform .45s ease;
        }

        .cert-icon-ring {
          position: absolute;
          inset: -5px;
          border: 1px dashed rgba(34,211,238,.35);
          border-radius: 16px;
          opacity: 0;
          transition: opacity .4s ease;
        }

        .cert-card:hover .cert-icon-wrap {
          transform: scale(1.08) rotate(-5deg);
        }

        .cert-card:hover .cert-icon-ring {
          opacity: 1;
          animation: certRingSpin 9s linear infinite;
        }

        @keyframes certRingSpin {
          to { transform: rotate(360deg); }
        }

        .cert-award-icon {
          animation: certAwardFloat 3.5s ease-in-out infinite;
        }

        @keyframes certAwardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .cert-link {
          transition: color .3s ease, gap .3s ease;
        }

        .cert-link svg {
          transition: transform .3s ease;
        }

        .cert-card:hover .cert-link svg {
          transform: translate(3px, -3px);
        }

        .cert-bottom-glow {
          position: absolute;
          bottom: 0;
          left: 15%;
          width: 70%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,211,238,.6), transparent);
          opacity: 0;
          transition: opacity .4s ease;
        }

        .cert-card:hover .cert-bottom-glow {
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .cert-premium *,
          .cert-premium *::before,
          .cert-premium *::after {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }

          .cert-reveal {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <div className="cert-grid-bg" />
      <div className="cert-orb cert-orb-one" />
      <div className="cert-orb cert-orb-two" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="cert-heading mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5">
            <Sparkles size={13} className="text-cyan-300" />
            <span className="text-[10px] font-semibold uppercase tracking-[.22em] text-cyan-300">
              Learning & Recognition
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Certifications
             & achievements
          </h2>

          <div className="cert-title-line mt-5" />

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Every achievement represents a step forward in my learning journey,
            creativity, and professional growth.
          </p>
        </div>

        {/* Certificate Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((item, index) => (
            <article
              key={item.title}
              style={{ "--delay": `${index * 110}ms` } as CSSProperties}
              className="cert-reveal cert-card group rounded-2xl p-5 sm:p-6"
            >
              <div className="cert-shine" />

              <div className="relative flex items-start justify-between">
                <div className="cert-icon-wrap flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <div className="cert-icon-ring" />
                  <Award className="cert-award-icon" size={23} />
                </div>

                <span className="cert-number text-2xl font-bold tracking-tight">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-7 text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">
                {item.type}
              </p>

              <h3 className="mt-2 min-h-[48px] text-lg font-semibold leading-6 text-white transition-colors duration-300 group-hover:text-cyan-200">
                {item.title}
              </h3>

              <p className="mt-2 text-sm font-medium text-slate-400">
                {item.issuer}
              </p>

              <div className="my-5 h-px bg-gradient-to-r from-slate-700/80 via-slate-700/40 to-transparent" />

              <p className="min-h-[40px] text-xs leading-5 text-slate-500">
                {item.note}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  Credential
                </span>

                <span className="cert-link inline-flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-cyan-300">
                  Link pending
                  <ExternalLink size={13} />
                </span>
              </div>

              <div className="cert-bottom-glow" />
            </article>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="cert-reveal mt-10 flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
          <Sparkles size={14} className="text-cyan-400" />
          <p className="text-xs text-slate-500">
            Always learning. Always growing. Always building.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Certifications
