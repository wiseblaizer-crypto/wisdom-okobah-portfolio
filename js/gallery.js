
/* ==========================================
   WORK PORTFOLIO — CREATIVE GALLERY
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const track = document.getElementById(
    "work-gallery-track"
  );

  const prevButton = document.getElementById(
    "gallery-prev"
  );

  const nextButton = document.getElementById(
    "gallery-next"
  );

  if (!track || !prevButton || !nextButton) {
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function updateButtons() {
    const maxScroll =
      track.scrollWidth - track.clientWidth;

    prevButton.disabled = track.scrollLeft <= 2;

    nextButton.disabled =
      track.scrollLeft >= maxScroll - 2;
  }

  function moveGallery(direction) {
    const card = track.querySelector(
      ".work-gallery__card"
    );

    if (!card) return;

    const styles = getComputedStyle(track);

    const gap = parseFloat(styles.columnGap) || 0;

    const distance =
      card.getBoundingClientRect().width + gap;

    track.scrollBy({
      left: direction * distance,
      behavior: reducedMotion.matches
        ? "instant"
        : "smooth"
    });
  }

  prevButton.addEventListener("click", () => {
    moveGallery(-1);
  });

  nextButton.addEventListener("click", () => {
    moveGallery(1);
  });

  track.addEventListener(
    "scroll",
    updateButtons,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateButtons
  );

  updateButtons();

});
