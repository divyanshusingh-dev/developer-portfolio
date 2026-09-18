function Skills() {
  const skillGroups = [
    {
      title: "Frontend",
      number: "01",
      description: "Building modern and responsive user interfaces.",
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
      description: "Creating APIs and working with server-side technologies.",
      skills: ["Node.js", "Express.js", "MongoDB"],
    },
    {
      title: "Tools",
      number: "03",
      description: "Tools I use for development and project management.",
      skills: ["Git", "GitHub", "Vite", "VS Code"],
    },
  ]

  return (
    <section
      id="skills"
      className="border-t border-slate-800 bg-transparent px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Skills
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Technologies I work with
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            A selection of technologies and tools I use to build modern,
            responsive and practical applications.
          </p>
        </div>

        {/* Skill Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-7 transition duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/5"
            >

              {/* Glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

              {/* Header */}
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                    {group.number}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-white transition duration-300 group-hover:text-cyan-400">
                    {group.title}
                  </h3>
                </div>

                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-500">
                  {group.skills.length} Skills
                </span>
              </div>

              {/* Description */}
              <p className="relative mt-4 text-sm leading-6 text-slate-400">
                {group.description}
              </p>

              {/* Skills */}
              <div className="relative mt-7 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 transition duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/5 hover:text-cyan-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Skills