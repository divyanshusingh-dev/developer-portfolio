
import { Link } from "react-router-dom";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/divyanshusingh-dev",
    label: "Visit my GitHub profile",
    icon: (
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/divyanshusingh077",
    label: "Visit my LinkedIn profile",
    icon: (
      <path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2ZM8 19H4.5V9H8ZM6.25 7.65a2.03 2.03 0 1 1 0-4.06 2.03 2.03 0 0 1 0 4.06ZM19.5 19H16v-4.87c0-1.16-.02-2.65-1.62-2.65-1.62 0-1.87 1.26-1.87 2.57V19H9V9h3.36v1.37h.05a3.68 3.68 0 0 1 3.3-1.81c3.53 0 4.19 2.32 4.19 5.34Z" />
    ),
  },
  {
    name: "X",
    href: "https://x.com/divyanshuxsingh",
    label: "Visit my X profile",
    icon: (
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.5l7.3-8.4L1.8 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/9473681245",
    label: "Chat with me on WhatsApp",
    icon: (
      <path d="M12.04 2a9.93 9.93 0 0 0-8.52 15.03L2 22l5.13-1.34A9.93 9.93 0 1 0 12.04 2Zm0 18.02a8.08 8.08 0 0 1-4.12-1.13l-.3-.18-3.06.8.82-2.98-.2-.31a8.1 8.1 0 1 1 6.86 3.8Zm4.45-6.06c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.14.24 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.51.58.18 1.11.1 1.53.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/divyanshusingh_0077/",
    label: "Visit my Instagram profile",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
    outline: true,
  },
  {
    name: "Email",
    href: "mailto:divyanshusingh2006r@gmail.com",
    label: "Send me an email",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    outline: true,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="premium-footer relative isolate overflow-hidden border-t border-white/[0.08] bg-[#020617] text-slate-300">

      <style>{`
        .premium-footer {
          --footer-cyan: #22d3ee;
          --footer-blue: #3b82f6;
        }

        .footer-orb {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          filter: blur(75px);
          animation: footerOrb 10s ease-in-out infinite alternate;
          will-change: transform;
        }

        .footer-orb-one {
          width: 300px;
          height: 300px;
          top: -170px;
          left: 8%;
          background: rgba(6, 182, 212, 0.12);
        }

        .footer-orb-two {
          width: 260px;
          height: 260px;
          right: 5%;
          bottom: -170px;
          background: rgba(37, 99, 235, 0.12);
          animation-delay: -5s;
        }

        @keyframes footerOrb {
          from { transform: translate3d(0, 0, 0) scale(0.95); }
          to { transform: translate3d(25px, -15px, 0) scale(1.08); }
        }

        .footer-light-line {
          position: absolute;
          top: 0;
          left: -35%;
          width: 35%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #22d3ee,
            #60a5fa,
            transparent
          );
          animation: footerLightSweep 8s ease-in-out infinite;
        }

        @keyframes footerLightSweep {
          0%, 15% { left: -35%; opacity: 0; }
          30% { opacity: 1; }
          75% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }

        .footer-glass {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.075);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition:
            transform 350ms ease,
            border-color 350ms ease,
            background 350ms ease,
            box-shadow 350ms ease;
        }

        .footer-glass:hover {
          transform: translateY(-4px);
          border-color: rgba(34, 211, 238, 0.32);
          background: rgba(34, 211, 238, 0.055);
          box-shadow: 0 12px 30px rgba(8, 145, 178, 0.09);
        }

        .footer-social-icon {
          transition: transform 350ms ease, color 350ms ease;
        }

        .footer-glass:hover .footer-social-icon {
          transform: scale(1.12) rotate(-5deg);
          color: #67e8f9;
        }

        .footer-social-arrow {
          transition: transform 300ms ease, opacity 300ms ease;
          opacity: 0.5;
        }

        .footer-glass:hover .footer-social-arrow {
          opacity: 1;
          transform: translate(2px, -2px);
        }

        .footer-brand-mark {
          transition: transform 350ms ease, box-shadow 350ms ease;
        }

        .footer-brand-mark:hover {
          transform: translateY(-3px) rotate(-4deg);
          box-shadow: 0 0 24px rgba(34, 211, 238, 0.18);
        }

        .footer-heading-line {
          width: 35px;
          height: 2px;
          border-radius: 10px;
          background: linear-gradient(90deg, #22d3ee, #3b82f6);
        }

        .footer-legal-link {
          position: relative;
          transition: color 250ms ease;
        }

        .footer-legal-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0;
          height: 1px;
          background: #22d3ee;
          transition: width 250ms ease;
        }

        .footer-legal-link:hover {
          color: #67e8f9;
        }

        .footer-legal-link:hover::after {
          width: 100%;
        }

        .footer-content {
          animation: footerContentIn 800ms ease both;
        }

        @keyframes footerContentIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .premium-footer *,
          .premium-footer *::before,
          .premium-footer *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }

          .footer-content {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      {/* Ambient background */}
      <div aria-hidden="true" className="footer-orb footer-orb-one" />
      <div aria-hidden="true" className="footer-orb footer-orb-two" />
      <div aria-hidden="true" className="footer-light-line" />

      <div className="footer-content relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">

        {/* Main section */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">

          {/* Brand section */}
          <div className="max-w-md">
            <Link
              to="/"
              aria-label="Divyanshu Singh - Home"
              className="group inline-flex items-center gap-3"
            >
              <span className="footer-brand-mark flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-400/[0.15] to-blue-500/[0.08] text-sm font-extrabold tracking-wide text-cyan-300">
                DS
              </span>

              <span className="text-xl font-bold tracking-tight text-white">
                Divyanshu
                <span className="ml-1 text-cyan-400">Singh</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Exploring the world of software development, blending creativity
              with technology to craft modern web experiences, intuitive
              interfaces, and innovative digital solutions.
            </p>

            <a
              href="mailto:divyanshusingh2006r@gmail.com"
              className="group mt-6 inline-flex items-center gap-2.5 text-sm font-medium text-slate-300 transition-colors duration-300 hover:text-cyan-300"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all duration-300 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/[0.08]">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              Contact me
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          {/* Social section */}
          <div>
            <div className="mb-6">
              <h2 className="text-base font-semibold tracking-wide text-white">
                Let's Connect
              </h2>
              <div className="footer-heading-line mt-3" />
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Feel free to connect or explore my work.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.name === "Email" ? undefined : "_blank"}
                  rel={social.name === "Email" ? undefined : "noopener noreferrer"}
                  aria-label={social.label}
                  className="footer-glass group flex min-h-[58px] items-center gap-2.5 rounded-xl px-3 py-3 text-sm text-slate-400"
                >
                  <svg
                    className="footer-social-icon h-[17px] w-[17px] shrink-0"
                    viewBox="0 0 24 24"
                    fill={social.outline ? "none" : "currentColor"}
                    stroke={social.outline ? "currentColor" : "none"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {social.icon}
                  </svg>

                  <span className="min-w-0 truncate transition-colors duration-300 group-hover:text-cyan-200">
                    {social.name}
                  </span>

                  <span
                    aria-hidden="true"
                    className="footer-social-arrow ml-auto text-xs text-cyan-400"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">

          <p className="text-xs leading-6 text-slate-500">
            © {currentYear}{" "}
            <Link
              to="/copyright"
              className="font-medium text-slate-300 transition-colors duration-300 hover:text-cyan-400"
            >
              Divyanshu Singh
            </Link>
            . All rights reserved.
          </p>

          <nav
            aria-label="Legal information"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            <Link to="/copyright" className="footer-legal-link text-xs text-slate-500">
              Copyright
            </Link>

            <Link to="/privacy-policy" className="footer-legal-link text-xs text-slate-500">
              Privacy Policy
            </Link>

            <Link to="/terms-of-use" className="footer-legal-link text-xs text-slate-500">
              Terms of Use
            </Link>
          </nav>
        </div>

      </div>
    </footer>
  );
}
