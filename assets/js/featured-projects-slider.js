
/* =========================================
   FEATURED PROJECTS — PREMIUM SLIDER
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById(
    "featured-projects-slider"
  );

  if (!slider) return;

  const track = slider.querySelector(
    ".featured-projects__track"
  );

  const slides = Array.from(
    track?.querySelectorAll(".project-card") || []
  );

  const previousButton = document.getElementById(
    "project-prev"
  );

  const nextButton = document.getElementById(
    "project-next"
  );

  const currentCounter = document.getElementById(
    "project-current"
  );

  const totalCounter = document.getElementById(
    "project-total"
  );

  const status = document.getElementById(
    "project-status"
  );

  const navigation = document.querySelector(
    ".featured-projects__navigation"
  );

  if (
    !track ||
    !slides.length ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }

  slider.tabIndex = 0;

  /* ---------------------------------------
     SLIDER SETTINGS
  --------------------------------------- */

  const INTERVAL = 5000;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let currentIndex = 0;
  let autoplayTimer = null;

  let isHovered = false;
  let isFocused = false;
  let isVisible = true;

  let touchStartX = 0;

  const totalSlides = slides.length;

  /* ---------------------------------------
     UPDATE COUNTER
  --------------------------------------- */

  function formatNumber(number) {
    return String(number).padStart(2, "0");
  }

  if (totalCounter) {
    totalCounter.textContent = formatNumber(
      totalSlides
    );
  }

  /* ---------------------------------------
     DISPLAY SELECTED PROJECT
  --------------------------------------- */

  function showSlide(index, announce = false) {
    currentIndex =
      (index + totalSlides) % totalSlides;

    track.style.transform = `translateX(-${
      currentIndex * 100
    }%)`;

    if (currentCounter) {
      currentCounter.textContent = formatNumber(
        currentIndex + 1
      );
    }

    if (announce && status) {
      status.textContent = `Project ${currentIndex + 1} of ${totalSlides}`;
    }

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;

      slide.setAttribute(
        "aria-hidden",
        String(!isActive)
      );

      if ("inert" in slide) {
        slide.inert = !isActive;
      }
    });
  }

  /* ---------------------------------------
     AUTOPLAY
  --------------------------------------- */

  function stopAutoplay() {
    if (autoplayTimer !== null) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function canAutoplay() {
    return (
      totalSlides > 1 &&
      !isHovered &&
      !isFocused &&
      isVisible &&
      !document.hidden &&
      !reducedMotion.matches
    );
  }

  function startAutoplay() {
    stopAutoplay();

    if (!canAutoplay()) return;

    autoplayTimer = window.setInterval(() => {
      showSlide(currentIndex + 1);
    }, INTERVAL);
  }

  /* ---------------------------------------
     MANUAL NAVIGATION
  --------------------------------------- */

  previousButton.addEventListener("click", () => {
    showSlide(currentIndex - 1, true);
    startAutoplay();
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentIndex + 1, true);
    startAutoplay();
  });

  /* ---------------------------------------
     PAUSE ON HOVER
  --------------------------------------- */

  const interactionArea =
    navigation?.parentElement || slider;

  interactionArea.addEventListener(
    "mouseenter",
    () => {
      isHovered = true;
      stopAutoplay();
    }
  );

  interactionArea.addEventListener(
    "mouseleave",
    () => {
      isHovered = false;
      startAutoplay();
    }
  );

  /* ---------------------------------------
     PAUSE ON KEYBOARD FOCUS
  --------------------------------------- */

  interactionArea.addEventListener(
    "focusin",
    () => {
      isFocused = true;
      stopAutoplay();
    }
  );

  interactionArea.addEventListener(
    "focusout",
    (event) => {
      if (
        !interactionArea.contains(
          event.relatedTarget
        )
      ) {
        isFocused = false;
        startAutoplay();
      }
    }
  );

  /* ---------------------------------------
     MOBILE SWIPE
  --------------------------------------- */

  slider.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
      isHovered = true;
      stopAutoplay();
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (event) => {
      const touchEndX =
        event.changedTouches[0].screenX;

      const difference = touchStartX - touchEndX;

      if (Math.abs(difference) > 50) {
        showSlide(
          currentIndex + (difference > 0 ? 1 : -1),
          true
        );
      }

      isHovered = false;
      startAutoplay();
    },
    { passive: true }
  );

  slider.addEventListener("touchcancel", () => {
    isHovered = false;
    startAutoplay();
  });

  slider.addEventListener("keydown", (event) => {
    if (event.target !== slider) return;

    const keyActions = {
      ArrowLeft: () => showSlide(currentIndex - 1, true),
      ArrowRight: () => showSlide(currentIndex + 1, true),
      Home: () => showSlide(0, true),
      End: () => showSlide(totalSlides - 1, true)
    };

    const action = keyActions[event.key];

    if (action) {
      event.preventDefault();
      action();
      startAutoplay();
    }
  });

  /* ---------------------------------------
     PAUSE WHEN TAB IS HIDDEN
  --------------------------------------- */

  document.addEventListener(
    "visibilitychange",
    startAutoplay
  );

  /* ---------------------------------------
     PAUSE WHEN SLIDER IS OFFSCREEN
  --------------------------------------- */

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        startAutoplay();
      },
      { threshold: 0.1 }
    );

    observer.observe(slider);
  }

  /* ---------------------------------------
     ACCESSIBILITY
  --------------------------------------- */

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener(
      "change",
      startAutoplay
    );
  }

  if (reducedMotion.matches) {
    track.style.transition = "none";
  }

  /* ---------------------------------------
     INITIALIZE
  --------------------------------------- */

  showSlide(0);
  startAutoplay();
});
