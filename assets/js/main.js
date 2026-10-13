
/* =========================================
   WISDOM OKOBAH — MAIN JAVASCRIPT
   ========================================= */

document.documentElement.classList.add("js-enabled");

/* Mobile navigation */

function initializeMobileNavigation() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNavigation = document.getElementById("mobile-navigation");

  if (!menuToggle || !mobileNavigation) {
    return;
  }

  const desktopQuery = window.matchMedia("(min-width: 64rem)");

  let isOpen = false;

  function setMenuState(open, restoreFocus = false) {
    isOpen = open;

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    const menuLabel = menuToggle.querySelector(".menu-toggle__label");

    if (menuLabel) {
      menuLabel.textContent = isOpen ? "Close" : "Menu";
    }

    mobileNavigation.hidden = !isOpen;

    if (restoreFocus && !desktopQuery.matches) {
      menuToggle.focus();
    }
  }

  menuToggle.addEventListener("click", () => {
    setMenuState(!isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      setMenuState(false, true);
    }
  });

  mobileNavigation.addEventListener("click", (event) => {
    const clickedLink = event.target.closest("a");

    if (clickedLink && isOpen) {
      setMenuState(false);
    }
  });

  function handleViewportChange(event) {
    if (event.matches) {
      setMenuState(false);
    }
  }

  desktopQuery.addEventListener("change", handleViewportChange);

  setMenuState(false);

  menuToggle.hidden = false;
}

initializeMobileNavigation();
