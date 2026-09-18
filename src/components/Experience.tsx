function Experience() {
  return (
    <section
      id="experience"
      className="border-t border-slate-800 bg-slate-950 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Experience
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            My experience
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            My practical experience and professional development journey.
          </p>
        </div>

        {/* Experience Card */}
        <div className="relative border-l border-slate-800 pl-8">

          {/* Timeline Dot */}
          <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40" />

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition duration-300 hover:border-cyan-400/40">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                  Experience
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  Graphic Design Experience
                </h3>

                <p className="mt-2 text-slate-400">
                  Graphic Designer
                </p>
              </div>

              <span className="w-fit rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-400">
                2+ Years
              </span>

            </div>

            {/* Responsibilities */}
            <div className="mt-7 border-t border-slate-800 pt-6">

              <ul className="space-y-3 text-slate-400">
                <li>
                  • Designed social media posts, banners, posters, and promotional materials using Adobe Photoshop and Canva.
                </li>

                <li>
                  • Created branding assets, maintained visual consistency, and delivered high-quality visual content within deadlines.
                </li>

                <li>
                  • Collaborated with clients to understand their design requirements and provided creative solutions.
                </li>

                <li>
                  • Gained experience in graphic design principles, color theory, typography, and layout design.
                </li>
              </ul>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default Experience