
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
  const trackRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const slider = sliderRef.current;

    if (!track || !slider) return;

    let animationFrame;
    let offset = 0;
    let previousTime = 0;
    let loopWidth = 0;
    let paused = false;

    const speed = 45; // Pixels per second

    const measureWidth = () => {
      loopWidth = track.scrollWidth / 2;

      if (loopWidth > 0) {
        offset = offset % loopWidth;
      }
    };

    const animate = (time) => {
      if (!previousTime) previousTime = time;

      const delta = Math.min(time - previousTime, 40);
      previousTime = time;

      if (!paused && loopWidth > 0) {
        offset += (speed * delta) / 1000;

        if (offset >= loopWidth) {
          offset -= loopWidth;
        }

        track.style.transform = `translate3d(-${offset}px, 0, 0)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    // Pause on desktop hover
    const handleMouseEnter = () => {
      paused = true;
    };

    const handleMouseLeave = () => {
      paused = false;
      previousTime = 0;
    };

    // Pause while touching on mobile
    const handleTouchStart = () => {
      paused = true;
    };

    const handleTouchEnd = () => {
      paused = false;
      previousTime = 0;
    };

    slider.addEventListener("mouseenter", handleMouseEnter);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    slider.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });
    slider.addEventListener("touchcancel", handleTouchEnd, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(measureWidth);

    resizeObserver.observe(track);

    measureWidth();

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      slider.removeEventListener("mouseenter", handleMouseEnter);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchend", handleTouchEnd);
      slider.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  const scrollingDesigns = [...designs, ...designs];

  return (
    <section
      id="design-showcase"
      className="relative overflow-hidden px-5 py-16 sm:px-10 sm:py-20 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
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

        {/* Auto Moving Slider */}
        <div
          ref={sliderRef}
          className="showcase-slider relative w-full overflow-hidden"
        >
          <div
            ref={trackRef}
            className="showcase-track flex w-max gap-6"
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
                    className="showcase-image aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
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

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-slate-500">
          Explore my creative work
          <span className="ml-2 text-cyan-400">→</span>
        </p>
      </div>

      {/* Responsive Styling */}
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
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }

        .showcase-card {
          flex: 0 0 320px;
          min-width: 0;
        }

        .showcase-image {
          display: block;
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

          .showcase-image {
            pointer-events: none;
            -webkit-user-drag: none;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .showcase-card {
            flex: 0 0 280px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .showcase-track {
            will-change: auto;
          }
        }
      `}</style>
    </section>
  );
}
