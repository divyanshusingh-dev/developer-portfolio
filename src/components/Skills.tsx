function Skills() {
  const skillGroups = [
    {
      title: "Frontend",
      number: "01",
      description:
        "Building modern, responsive and user-friendly interfaces.",
      skills: [
        "React",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "Tailwind CSS",
      ],
    },
    {
      title: "Backend",
      number: "02",
      description:
        "Creating APIs and working with server-side technologies.",
      skills: ["Node.js", "Express.js", "MongoDB"],
    },
    {
      title: "Tools",
      number: "03",
      description:
        "Development tools I use to build and manage projects.",
      skills: ["Git", "GitHub", "Vite", "VS Code"],
    },
  ]

  return (
    <section
      id="skills"
      className="relative overflow-hidden border-t border-slate-800 bg-slate-950/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      {/* Background Glow */}

      <div className="pointer-events-none absolute left-1/4 top-0 -z-10 h-56 w-56 rounded-full bg-cyan-500/5 blur-[110px]" />

      <div className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="mx-auto max-w-6xl">
        {/* Heading */}

        <div className="mb-10">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Skills
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Technologies I work with
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Technologies and tools I use to build modern, responsive and
            practical applications.
          </p>

          <div className="mt-4 h-px w-16 bg-cyan-400/50" />
        </div>

        {/* Skill Cards */}

        <div className="grid gap-5 md:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-cyan-500/5"
            >
              {/* Hover Glow */}

              <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

              {/* Header */}

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-semibold tracking-widest text-cyan-400/60">
                    {group.number}
                  </p>

                  <h3 className="mt-1.5 text-xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-400">
                    {group.title}
                  </h3>
                </div>

                <span className="shrink-0 rounded-full border border-slate-700 bg-slate-950/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  {group.skills.length} Skills
                </span>
              </div>

              {/* Description */}

              <p className="relative mt-4 text-sm leading-6 text-slate-400">
                {group.description}
              </p>

              {/* Divider */}

              <div className="relative mt-5 h-px w-full bg-slate-800" />

              {/* Skills */}

              <div className="relative mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:text-cyan-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Bottom Accent */}

              <div className="absolute bottom-0 left-0 h-px w-0 bg-cyan-400 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* Skill Summary */}

        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-500">
              Current Focus
            </span>

            <span className="text-sm font-medium text-slate-300">
              Frontend Development · React · TypeScript · Responsive UI
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills