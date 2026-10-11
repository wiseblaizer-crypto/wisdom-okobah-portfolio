
/* =========================================
   WISDOM OKOBAH — MAIN JAVASCRIPT
   Phase 1 | Step 5 | Version 1.0
   ========================================= */

document.documentElement.classList.add("js-enabled");

/* -----------------------------------------
   01. MOBILE NAVIGATION
----------------------------------------- */

function initializeMobileNavigation() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNavigation = document.getElementById(
    "mobile-navigation"
  );

  if (!menuToggle || !mobileNavigation) {
    return;
  }

  const desktopQuery = window.matchMedia(
    "(min-width: 64rem)"
  );

  let isOpen = false;

  /* ---------------------------------------
     02. UPDATE MENU STATE
  --------------------------------------- */

  function setMenuState(open, restoreFocus = false) {
    isOpen = open;

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );

    const menuLabel = menuToggle.querySelector(
      ".menu-toggle__label"
    );

    if (menuLabel) {
      menuLabel.textContent = isOpen
        ? "Close"
        : "Menu";
    }

    mobileNavigation.hidden = !isOpen;

    if (restoreFocus && !desktopQuery.matches) {
      menuToggle.focus();
    }
  }

  /* ---------------------------------------
     03. TOGGLE ON BUTTON CLICK
  --------------------------------------- */

  menuToggle.addEventListener("click", () => {
    setMenuState(!isOpen);
  });

  /* ---------------------------------------
     04. ESCAPE KEY SUPPORT
  --------------------------------------- */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      setMenuState(false, true);
    }
  });

  /* ---------------------------------------
     05. CLOSE AFTER LINK SELECTION
  --------------------------------------- */

  mobileNavigation.addEventListener(
    "click",
    (event) => {
      const clickedLink = event.target.closest("a");

      if (clickedLink && isOpen) {
        setMenuState(false);
      }
    }
  );

  /* ---------------------------------------
     06. HANDLE VIEWPORT CHANGES
  --------------------------------------- */

  function handleViewportChange(event) {
    if (event.matches) {
      setMenuState(false);
    }
  }

  desktopQuery.addEventListener(
    "change",
    handleViewportChange
  );

  /* ---------------------------------------
     07. INITIALIZE MENU
  --------------------------------------- */

  setMenuState(false);

  menuToggle.hidden = false;

  console.info(
    "Wisdom Okobah: mobile navigation initialized."
  );
}

/* -----------------------------------------
   08. START APPLICATION
----------------------------------------- */

initializeMobileNavigation();
