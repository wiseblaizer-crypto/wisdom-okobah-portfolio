
/* ==========================================
   WISDOM OKOBAH — PROJECT PREVIEW SCROLLING

   Desktop:
   - Auto-scroll website screenshots
   - Synchronize project information
   - Scroll either panel manually
   - Pause on hover or interaction

   Mobile:
   - Keep project text in normal page flow

   Accessibility:
   - Respect reduced motion
   - Pause when page is hidden
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const projects = document.querySelectorAll(
    ".work-page .services-project"
  );

  const desktop = window.matchMedia(
    "(min-width: 1024px)"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const SPEED = 38;
  const EDGE_PAUSE = 1500;
  const INTERACTION_PAUSE = 6000;

  projects.forEach((project) => {

    const preview = project.querySelector(
      ".project-browser__viewport"
    );

    const content = project.querySelector(
      ".services-project__content"
    );

    if (!preview || !content) return;

    let frame = null;
    let lastTime = null;
    let direction = 1;
    let edgePauseUntil = 0;
    let userPauseUntil = 0;

    let visible = false;
    let hovered = false;
    let focused = false;
    let resumeTimer = null;

    /* Used to prevent circular scroll updates */

    let expectedPreview = null;
    let expectedContent = null;

    function maxScroll(element) {
      return Math.max(
        0,
        element.scrollHeight - element.clientHeight
      );
    }

    function syncContentFromPreview() {

      if (!desktop.matches) return;

      const previewMax = maxScroll(preview);
      const contentMax = maxScroll(content);

      if (previewMax < 1 || contentMax < 1) {
        return;
      }

      const progress =
        preview.scrollTop / previewMax;

      const target = progress * contentMax;

      if (Math.abs(content.scrollTop - target) > 1) {
        expectedContent = target;
        content.scrollTop = target;
      }

    }

    function syncPreviewFromContent() {

      if (!desktop.matches) return;

      const previewMax = maxScroll(preview);
      const contentMax = maxScroll(content);

      if (previewMax < 1 || contentMax < 1) {
        return;
      }

      const progress =
        content.scrollTop / contentMax;

      const target = progress * previewMax;

      if (Math.abs(preview.scrollTop - target) > 1) {
        expectedPreview = target;
        preview.scrollTop = target;
      }

    }

    /* Screenshot drives text progress */

    preview.addEventListener(
      "scroll",
      () => {

        if (
          expectedPreview !== null &&
          Math.abs(
            preview.scrollTop - expectedPreview
          ) <= 2
        ) {
          expectedPreview = null;
          return;
        }

        expectedPreview = null;
        syncContentFromPreview();

      },
      { passive: true }
    );

    /* Manual text scrolling drives screenshot */

    content.addEventListener(
      "scroll",
      () => {

        if (
          expectedContent !== null &&
          Math.abs(
            content.scrollTop - expectedContent
          ) <= 2
        ) {
          expectedContent = null;
          return;
        }

        expectedContent = null;
        syncPreviewFromContent();

      },
      { passive: true }
    );

    function canAnimate() {
      return (
        visible &&
        !document.hidden &&
        !reducedMotion.matches &&
        !hovered &&
        !focused &&
        Date.now() >= userPauseUntil &&
        maxScroll(preview) > 1
      );
    }

    function stop() {

      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }

      lastTime = null;

    }

    function animate(timestamp) {

      frame = null;

      if (!canAnimate()) {
        stop();
        return;
      }

      if (lastTime === null) {
        lastTime = timestamp;
      }

      const delta = Math.min(
        timestamp - lastTime,
        50
      );

      lastTime = timestamp;

      if (timestamp < edgePauseUntil) {
        frame = requestAnimationFrame(animate);
        return;
      }

      const limit = maxScroll(preview);

      const next =
        preview.scrollTop +
        direction * SPEED * delta / 1000;

      preview.scrollTop = Math.max(
        0,
        Math.min(limit, next)
      );

      syncContentFromPreview();

      const atBottom =
        direction === 1 &&
        preview.scrollTop >= limit - 1;

      const atTop =
        direction === -1 &&
        preview.scrollTop <= 1;

      if (atBottom || atTop) {
        direction *= -1;
        edgePauseUntil = timestamp + EDGE_PAUSE;
      }

      frame = requestAnimationFrame(animate);

    }

    function start() {

      if (frame !== null || !canAnimate()) {
        return;
      }

      lastTime = null;
      frame = requestAnimationFrame(animate);

    }

    function pauseForInteraction() {

      userPauseUntil =
        Date.now() + INTERACTION_PAUSE;

      stop();

      clearTimeout(resumeTimer);

      resumeTimer = setTimeout(() => {
        start();
      }, INTERACTION_PAUSE + 50);

    }

    /* Hover pauses the entire project */

    project.addEventListener(
      "mouseenter",
      () => {
        hovered = true;
        stop();
      }
    );

    project.addEventListener(
      "mouseleave",
      () => {
        hovered = false;
        start();
      }
    );

    /* Keyboard focus pauses animation */

    project.addEventListener(
      "focusin",
      () => {
        focused = true;
        stop();
      }
    );

    project.addEventListener(
      "focusout",
      () => {

        setTimeout(() => {
          focused = project.contains(
            document.activeElement
          );

          if (!focused) start();
        }, 0);

      }
    );

    /* Manual interactions */

    [preview, content].forEach((element) => {

      element.addEventListener(
        "wheel",
        pauseForInteraction,
        { passive: true }
      );

      element.addEventListener(
        "touchstart",
        pauseForInteraction,
        { passive: true }
      );

      element.addEventListener(
        "pointerdown",
        pauseForInteraction,
        { passive: true }
      );

      element.addEventListener(
        "keydown",
        (event) => {

          if (
            [
              "ArrowUp",
              "ArrowDown",
              "PageUp",
              "PageDown",
              "Home",
              "End",
              " "
            ].includes(event.key)
          ) {
            pauseForInteraction();
          }

        }
      );

    });

    /* Animate only while project is visible */

    const observer = new IntersectionObserver(
      (entries) => {

        const entry = entries[0];

        visible =
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.2;

        if (visible) {
          start();
        } else {
          stop();
        }

      },
      {
        threshold: [0, 0.2, 0.5]
      }
    );

    observer.observe(preview);

    /* Screenshot image may load later */

    const image = preview.querySelector("img");

    if (image && !image.complete) {
      image.addEventListener(
        "load",
        start,
        { once: true }
      );
    }

    /* Visibility and motion settings */

    document.addEventListener(
      "visibilitychange",
      () => {
        document.hidden ? stop() : start();
      }
    );

    reducedMotion.addEventListener(
      "change",
      () => {
        reducedMotion.matches ? stop() : start();
      }
    );

    desktop.addEventListener(
      "change",
      () => {
        if (desktop.matches) {
          syncContentFromPreview();
        } else {
          content.scrollTop = 0;
        }
      }
    );

  });

});
