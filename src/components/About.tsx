function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-slate-800 bg-slate-950 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      {/* Background Glow */}

      <div className="pointer-events-none absolute left-0 top-1/4 -z-10 h-64 w-64 rounded-full bg-cyan-500/5 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-blue-500/5 blur-[130px]" />

      <div className="mx-auto max-w-6xl">
        {/* Heading */}

        <div className="mb-10">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
            About Me
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Who I am
          </h2>

          <div className="mt-4 h-px w-16 bg-cyan-400/50" />
        </div>

        {/* Main Content */}

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* About Text */}

          <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/20 sm:p-7">
            <div className="flex items-start gap-4">
              {/* Number */}

              <div className="hidden shrink-0 text-xs font-bold tracking-widest text-cyan-400/60 sm:block">
                01
              </div>

              <div>
                <h3 className="text-xl font-bold leading-snug text-white sm:text-2xl">
                  I'm a developer who enjoys building useful things.
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                  I'm a BCA student and aspiring software developer interested
                  in creating modern, responsive and user-friendly web
                  applications.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                  I enjoy learning new technologies, solving programming
                  problems and turning ideas into practical digital
                  experiences. My current focus is on frontend development
                  with React, TypeScript and Tailwind CSS, along with backend
                  technologies such as Node.js, Express.js and MongoDB.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                  I believe in continuous learning and improving through
                  hands-on projects and real-world development experience.
                </p>
              </div>
            </div>

            {/* Bottom Accent */}

            <div className="mt-7 h-px w-full bg-gradient-to-r from-cyan-400/30 via-slate-700/50 to-transparent" />
          </div>

          {/* Quick Info */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur-sm sm:p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Quick Info
              </h3>

              <span className="text-xs font-mono text-cyan-400/60">
                02
              </span>
            </div>

            <div className="mt-6 divide-y divide-slate-800">
              {/* Role */}

              <div className="py-4 first:pt-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Role
                </p>

                <p className="mt-1.5 text-sm font-medium text-slate-200">
                  Jr. Software Developer
                </p>
              </div>

              {/* Education */}

              <div className="py-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Education
                </p>

                <p className="mt-1.5 text-sm font-medium text-slate-200">
                  BCA
                </p>
              </div>

              {/* Focus */}

              <div className="py-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Focus
                </p>

                <p className="mt-1.5 text-sm font-medium text-slate-200">
                  Web Development
                </p>
              </div>

              {/* Goal */}

              <div className="py-4 last:pb-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Goal
                </p>

                <p className="mt-1.5 text-sm font-medium text-slate-200">
                  Software Development
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Highlights */}

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Approach
            </p>

            <p className="mt-1 text-sm font-medium text-slate-200">
              Learn · Build · Improve
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Frontend
            </p>

            <p className="mt-1 text-sm font-medium text-slate-200">
              React · TypeScript · Tailwind
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Backend
            </p>

            <p className="mt-1 text-sm font-medium text-slate-200">
              Node.js · Express · MongoDB
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
    
export default About