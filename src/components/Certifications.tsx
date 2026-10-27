import { Award, ExternalLink } from "lucide-react"

const credentials = [
  { title: "Introduction to Artificial Intelligence", issuer: "Microsoft", type: "AI / Technology", note: "Add the official credential URL or certificate image to verify this credential." },
  { title: "Adobe Photoshop", issuer: "Infosys Springboard", type: "Design", note: "Add the official credential URL or certificate image to verify this credential." },
  { title: "W3.CSS Beginners", issuer: "W3Schools", type: "Web Development", note: "Add the official credential URL or certificate image to verify this credential." },
  { title: "Graphics Designing (Photoshop & Canva)", issuer: "SVGOI / ISTE", type: "Graphic Design", note: "Add the official credential URL or certificate image to verify this credential." },
  { title: "Digital Poster Making", issuer: "SVGOI", type: "Achievement · 27 Feb 2025", note: "Add a photo or scan of the certificate for visitors to view." },
  { title: "MY Bharat Budget Quest 2026", issuer: "MY Bharat", type: "Quiz / Participation · 20 Feb 2026", note: "Add the official credential URL or certificate image to verify this credential." },
]

function Certifications() {
  return (
    <section id="certifications" className="border-t border-slate-800/80 bg-slate-950/35 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">Learning & Recognition</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Certifications & achievements</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Selected learning and achievement records. Credential links and certificate scans should be added before presenting an item as independently verified.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((item) => (
            <article key={item.title} className="group rounded-2xl border border-slate-800 bg-slate-900/55 p-5 transition hover:-translate-y-1 hover:border-cyan-400/30">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-300"><Award size={21} /></div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">{item.type}</p>
              <h3 className="mt-2 text-base font-semibold leading-6 text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{item.issuer}</p>
              <p className="mt-3 text-xs leading-5 text-slate-500">{item.note}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500"><ExternalLink size={12} /> Credential link pending</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Certifications
