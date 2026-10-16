
/* =========================================
   SCROLL REVEAL ANIMATION SYSTEM
   ========================================= */

function initializeScrollReveals() {
  document.documentElement.classList.add("js-animations");

  const pageRevealSelectors = [
    ".services-page .services-section__intro",
    ".services-page .services-bento__card",
    ".services-page .services-why__intro",
    ".services-page .services-why__value",
    ".services-page .services-work__intro",
    ".services-page .work-preview",
    ".services-page .services-faq__intro",
    ".services-page .services-faq__list",
    ".services-page .services-cta__content",
    ".services-page .services-cta__visual",
    ".work-page .services-work__intro",
    ".work-page .services-project",
    ".work-page .work-marquee__intro",
    ".work-page .work-cta__inner",
    ".about-page .about-story__heading",
    ".about-page .about-story__content",
    ".about-page .about-story__milestones",
    ".about-page .about-expertise__intro",
    ".about-page .about-expertise__panel",
    ".about-page .about-approach__intro",
    ".about-page .about-approach__principles",
    ".contact-enquiry__panel",
    ".contact-enquiry__form-panel",
    ".contact-whatsapp__layout",
    ".contact-process__intro",
    ".contact-process__step",
    ".contact-closing__container"
  ];

  pageRevealSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal");

      if (index % 5) {
        element.classList.add(`reveal-delay-${index % 5}`);
      }
    });
  });

  const revealElements = document.querySelectorAll(".reveal");

  // Stop if there are no elements to animate.
  if (!revealElements.length) return;

  // Respect reduced-motion preferences.
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Keep content visible if IntersectionObserver is unavailable.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          // Animate only once.
          observerInstance.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeScrollReveals, {
    once: true
  });
} else {
  initializeScrollReveals();
}
