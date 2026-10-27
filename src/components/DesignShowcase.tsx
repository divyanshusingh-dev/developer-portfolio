
import { useState } from "react";

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
  const [isPaused, setIsPaused] = useState(false);

  const scrollingDesigns = [...designs, ...designs];

  return (
    <section
      id="design-showcase"
      className="relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16"
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

        <div
          className="showcase-slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (
              !event.currentTarget.contains(
                event.relatedTarget as Node | null
              )
            ) {
              setIsPaused(false);
            }
          }}
        >
          <div
            className="showcase-track"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {scrollingDesigns.map((design, index) => (
              <article
                key={`${design.image}-${index}`}
                aria-hidden={index >= designs.length ? true : undefined}
                className="showcase-card group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 transition-colors duration-300 hover:border-cyan-400/50"
              >
                <a
                  href={design.image}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={index >= designs.length ? -1 : undefined}
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
                    tabIndex={index >= designs.length ? -1 : undefined}
                    className="mt-4 inline-flex text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
                  >
                    View Design ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .showcase-slider {
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 3%,
            black 97%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 3%,
            black 97%,
            transparent
          );
        }

        .showcase-track {
          display: flex;
          width: max-content;
          gap: 24px;
          animation: showcase-horizontal-scroll 30s linear infinite;
          will-change: transform;
        }

        .showcase-card {
          flex: 0 0 320px;
          min-width: 0;
        }

        @keyframes showcase-horizontal-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 12px));
          }
        }

        @media (max-width: 640px) {
          .showcase-card {
            flex-basis: 260px;
          }

          .showcase-track {
            gap: 16px;
          }

          @keyframes showcase-horizontal-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(calc(-50% - 8px));
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .showcase-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
