
import { useEffect, useRef, useState } from "react";

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

function DesignCard({
  design,
  index,
}: {
  design: (typeof designs)[number];
  index: number;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      className="showcase-card group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 transition-colors duration-300 hover:border-cyan-400/50"
      aria-hidden={index >= designs.length ? true : undefined}
    >
      <a
        href={imageError ? undefined : design.image}
        target="_blank"
        rel="noreferrer"
        tabIndex={index >= designs.length || imageError ? -1 : undefined}
        aria-label={`Open ${design.title}`}
        className="block overflow-hidden"
        onClick={(event) => {
          if (imageError) event.preventDefault();
        }}
      >
        {imageError ? (
          <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 bg-slate-800 text-slate-400">
            <span className="text-4xl">🖼️</span>
            <span className="text-sm">Image not found</span>
            <span className="px-3 text-center text-xs">
              Check: {design.image}
            </span>
          </div>
        ) : (
          <img
            src={design.image}
            alt={design.alt}
            loading={index < designs.length ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onError={() => setImageError(true)}
            className="showcase-image aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </a>

      <div className="p-4 sm:p-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-400 sm:text-xs">
          {design.category}
        </p>

        <h3 className="text-base font-semibold text-white sm:text-lg">
          {design.title}
        </h3>

        <a
          href={imageError ? undefined : design.image}
          target="_blank"
          rel="noreferrer"
          tabIndex={index >= designs.length || imageError ? -1 : undefined}
          onClick={(event) => {
            if (imageError) event.preventDefault();
          }}
          className="mt-4 inline-flex text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
        >
          View Design ↗
        </a>
      </div>
    </article>
  );
}

export default function DesignShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const slider = sliderRef.current;

    if (!track || !slider) return;

    let frameId = 0;
    let previousTime = 0;
    let offset = 0;
    let loopWidth = 0;
    let paused = false;

    const speed = 65;

    const measure = () => {
      const firstCard = track.children[0] as HTMLElement;
      const lastCard = track.children[designs.length - 1] as HTMLElement;

      if (!firstCard || !lastCard) return;

      const firstRect = firstCard.getBoundingClientRect();
      const lastRect = lastCard.getBoundingClientRect();

      loopWidth = lastRect.right - firstRect.left;

      if (loopWidth > 0) {
        offset %= loopWidth;
        track.style.transform = `translate3d(-${offset}px, 0, 0)`;
      }
    };

    const animate = (time: number) => {
      if (!previousTime) previousTime = time;

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

    const observer = new ResizeObserver(measure);
    observer.observe(slider);

    slider.addEventListener("mouseenter", pause);
    slider.addEventListener("mouseleave", resume);
    slider.addEventListener("touchstart", pause, { passive: true });
    slider.addEventListener("touchend", resume, { passive: true });
    slider.addEventListener("touchcancel", resume, { passive: true });

    measure();
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();

      slider.removeEventListener("mouseenter", pause);
      slider.removeEventListener("mouseleave", resume);
      slider.removeEventListener("touchstart", pause);
      slider.removeEventListener("touchend", resume);
      slider.removeEventListener("touchcancel", resume);
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

        <div ref={sliderRef} className="showcase-slider">
          <div ref={trackRef} className="showcase-track">
            {scrollingDesigns.map((design, index) => (
              <DesignCard
                key={`${design.image}-${index}`}
                design={design}
                index={index}
              />
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

        .showcase-image {
          display: block;
          background: #0f172a;
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
      `}</style>
    </section>
  );
}
