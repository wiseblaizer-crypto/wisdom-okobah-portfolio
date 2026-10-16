
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#testimonials");
  if (!section) return;

  const entries = [
    {
      type: "CLIENT TESTIMONIAL",
      quote:
        "A huge thank you to Wisdom @ceo_fyncrest for bringing my vision for the new Hey Lady™ website to life. I wanted something clean, elevated, timeless, and true to who Hey Lady™ is, and you absolutely delivered.",
      client: "Laetania Richardson",
      project: "Hey Lady · Website Redesign",
      monogram: "HL"
    },
    {
      type: "CLIENT TESTIMONIAL",
      quote:
        "Working with Wisdom was an absolute pleasure from start to finish. He brought my vision for IAmAprilShowers.com to life with incredible creativity, professionalism, and attention to detail, and the final result exceeded every expectation I had. If you’re looking for someone who truly cares about delivering excellence, I highly recommend Wisdom—you won’t be disappointed.",
      client: "April Showers",
      project: "I Am April Showers · Website Redesign",
      monogram: "AS"
    },
    {
      type: "CLIENT TESTIMONIAL",
      quote:
        "Wisdom brought a thoughtful and professional approach to the development of our Wohnplatz e-commerce website. The design feels modern, clean, and aligned with our brand, while making it easy for customers to explore our products. We appreciate the attention to detail and the care put into creating a polished shopping experience.",
      client: "Wohnplatz.ch",
      project: "Swiss-owned E-commerce Brand",
      monogram: "W"
    }
  ];

  const quote = section.querySelector("#testimonial-quote");
  const client = section.querySelector("#testimonial-client");
  const project = section.querySelector("#testimonial-project");
  const monogram = section.querySelector("#testimonial-monogram");
  const type = section.querySelector("#testimonial-type");
  const count = section.querySelector("#testimonial-count");
  const content = section.querySelector("#testimonial-content");

  const selectors = [
    ...section.querySelectorAll("[data-testimonial-select]")
  ];

  const progress = [
    ...section.querySelectorAll(".testimonials__progress span")
  ];

  const previous = section.querySelector("#testimonial-prev");
  const next = section.querySelector("#testimonial-next");

  let activeIndex = 0;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function showEntry(index) {
    activeIndex = (index + entries.length) % entries.length;

    const entry = entries[activeIndex];

    quote.textContent = entry.quote;
    client.textContent = entry.client;
    project.textContent = entry.project;
    monogram.textContent = entry.monogram;
    type.textContent = entry.type;

    if (content && !reducedMotion.matches) {
      content.classList.remove("is-entering");
      void content.offsetWidth;
      content.classList.add("is-entering");
    }

    count.textContent =
      `${String(activeIndex + 1).padStart(2, "0")} / ` +
      `${String(entries.length).padStart(2, "0")}`;

    selectors.forEach((button, i) => {
      const isActive = i === activeIndex;
      button.classList.toggle("is-active", isActive);
      if (isActive) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    progress.forEach((bar, i) => {
      bar.classList.toggle("is-active", i === activeIndex);
    });
  }

  selectors.forEach((button, index) => {
    button.addEventListener("click", () => showEntry(index));
  });

  previous.addEventListener("click", () => {
    showEntry(activeIndex - 1);
  });

  next.addEventListener("click", () => {
    showEntry(activeIndex + 1);
  });

  showEntry(0);
});
