
import { useEffect, useRef } from "react";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const slider = sliderRef.current;

    if (!track || !slider) return;
console.log("DESIGN SLIDER INITIALIZED");
console.log("Track width:", track.scrollWidth);
console.log("Slider width:", slider.clientWidth);
console.log("Cards:", track.children.length);
    let frameId = 0;
    let previousTime = 0;
    let offset = 0;
    let loopWidth = 0;
    let paused = false;

    const speed = 35;

    const measure = () => {
      const firstGroup = track.children;

      if (firstGroup.length < designs.length * 2) return;

      const firstCard = firstGroup[0] as HTMLElement;
      const lastCard = firstGroup[designs.length - 1] as HTMLElement;
      const firstRect = firstCard.getBoundingClientRect();
      const lastRect = lastCard.getBoundingClientRect();

      loopWidth = lastRect.right - firstRect.left;

      if (loopWidth > 0) {
        offset = offset % loopWidth;
        track.style.transform = `translate3d(-${offset}px, 0, 0)`;
      }
    };

    const animate = (time: number) => {
      if (previousTime === 0) previousTime = time;

      const delta = Math.min(time - previousTime, 50);
      previousTime = time;

      if (!paused && loopWidth > 0) {
        offset += (speed * delta) / 1000;

        if (offset >= loopWidth) {
          offset %= loopWidth;
        }

        track.style.transform = `translate3d(-${offset}px, 0, 0)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    const pause = () => {
      paused = true;
    };

    const resume = () => {
      paused = false;
      previousTime = 0;
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(slider);

    slider.addEventListener("mouseenter", pause);
    slider.addEventListener("mouseleave", resume);

    measure();
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();

      slider.removeEventListener("mouseenter", pause);
      slider.removeEventListener("mouseleave", resume);
    };
  }, []);

  const scrollingDesigns = [...designs, ...designs];

  return (
    <section
      id="design-showcase"
      className="relative overflow-hidden px-5 py-16 sm:px-10 sm:py-20 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 sm:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-sm">
            Creative Work
          </p>

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Design Showcase
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            A selection of graphic designs, posters, banners and
            social media creatives.
          </p>
        </div>

        <div
          ref={sliderRef}
          className="showcase-slider"
        >
          <div
            ref={trackRef}
            className="showcase-track"
          >
            {scrollingDesigns.map((design, index) => (
              <article
                key={`${design.image}-${index}`}
                aria-hidden={index >= designs.length ? true : undefined}
                className="showcase-card group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 transition-colors duration-300 hover:border-cyan-400/50"
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
                    draggable={false}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </a>

                <div className="p-4 sm:p-5">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-400 sm:text-xs">
                    {design.category}
                  </p>

                  <h3 className="text-base font-semibold text-white sm:text-lg">
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

        <p className="mt-5 text-center text-xs text-slate-500">
          Explore my creative work
          <span className="ml-2 text-cyan-400">→</span>
        </p>
      </div>

      <style>{`
        .showcase-slider {
          position: relative;
          width: 100%;
          overflow: hidden;
          isolation: isolate;
        }

        .showcase-track {
          display: flex;
          width: max-content;
          gap: 24px;
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }

        .showcase-card {
          flex: 0 0 320px;
          min-width: 0;
        }

        @media (max-width: 640px) {
          .showcase-slider {
            width: calc(100% + 20px);
            margin-left: -10px;
            padding: 0 10px;
          }

          .showcase-track {
            gap: 16px;
          }

          .showcase-card {
            flex: 0 0 78vw;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .showcase-card {
            flex: 0 0 280px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .showcase-track {
            will-change: transform !important;
          }
        }
      `}</style>
    </section>
  );
}
