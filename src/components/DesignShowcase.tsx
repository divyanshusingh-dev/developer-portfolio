
const designs = [
  {
    title: "College Event Poster",
    category: "Poster Design",
    image: "/designs/poster-1.jpg",
    alt: "College event poster design",
  },
  {
    title: "College Banner",
    category: "Banner Design",
    image: "/designs/banner-1.jpg",
    alt: "College banner design",
  },
  {
    title: "Social Media Post",
    category: "Social Media Design",
    image: "/designs/social-media-post.jpg",
    alt: "Social media graphic design",
  },
];
export default function DesignShowcase() {
  return (
    <section
      id="design-showcase"
      className="relative px-6 py-20 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Creative Work
          </p>

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Design Showcase
          </h2>

          <p className="mt-4 max-w-2xl text-slate-400">
            A selection of graphic designs, posters, banners and
            social media creatives.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <article
              key={design.image}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50"
            >
              <a
                href={design.image}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${design.title}`}
                className="block overflow-hidden"
              >
                <img
                  src={design.image}
                  alt={design.alt}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </a>

              <div className="p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  {design.category}
                </p>

                <h3 className="text-lg font-semibold text-white">
                  {design.title}
                </h3>

                <a
                  href={design.image}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-medium text-slate-300 transition hover:text-cyan-400"
                >
                  View Design ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
