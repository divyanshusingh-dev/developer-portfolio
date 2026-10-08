function Experience() {
  return (
    <section
      id="experience"
      className="border-t border-slate-800 bg-slate-950 px-6 py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Experience
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            My Experience
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            My practical experience and professional development journey.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-3 top-0 hidden h-full w-px bg-slate-800 sm:block" />

          <div className="relative sm:pl-12">
            {/* Timeline Dot */}
            <div className="absolute left-0 top-7 hidden h-7 w-7 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-950 sm:flex">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50" />
            </div>

            {/* Experience Card */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900 sm:p-7">
              {/* Card Header */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Professional Experience
                  </p>

                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    Graphic Design Experience
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Graphic Designer
                  </p>
                </div>

                {/* Duration */}
                <div className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2">
                  <span className="text-xs font-medium text-cyan-300">
                    2+ Years
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-slate-800" />

              {/* Responsibilities */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Key Responsibilities
                </p>

                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm leading-6 text-slate-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>
                      Designed social media posts, banners, posters, and
                      promotional materials using Adobe Photoshop and Canva.
                    </span>
                  </li>

                  <li className="flex gap-3 text-sm leading-6 text-slate-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>
                      Created branding assets, maintained visual consistency,
                      and delivered high-quality visual content within
                      deadlines.
                    </span>
                  </li>

                  <li className="flex gap-3 text-sm leading-6 text-slate-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>
                      Collaborated with clients to understand their design
                      requirements and provided creative solutions.
                    </span>
                  </li>

                  <li className="flex gap-3 text-sm leading-6 text-slate-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>
                      Gained experience in graphic design principles, color
                      theory, typography, and layout design.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Tools */}
              <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-5">
                <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Tools
                </span>

                {["Adobe Photoshop", "Canva"].map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-slate-400 transition-colors duration-200 group-hover:border-slate-600 group-hover:text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Highlight */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Experience
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              2+ Years
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Design Tools
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              Photoshop · Canva
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Core Focus
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              Visual Design · Branding
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience