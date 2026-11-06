
useEffect(() => {
  const track = trackRef.current;
  const slider = sliderRef.current;

  if (!track || !slider) return;

  let frameId = 0;
  let previousTime = 0;
  let offset = 0;
  let loopWidth = 0;
  let paused = false;

  const speed = 65; // pixels per second

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
        offset -= loopWidth;
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
