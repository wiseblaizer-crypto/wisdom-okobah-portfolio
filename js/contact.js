
const form = document.querySelector("#contact-form");
const urlInput = document.querySelector("#reference-url");
const statusMessage = document.querySelector("#form-status");

// ==========================================
// 1. NORMALIZE WEBSITE URL
// ==========================================

function normalizeUrl() {
    if (!urlInput) return;

    const value = urlInput.value.trim();

    if (!value) {
        urlInput.value = "";
        return;
    }

    if (/^[a-z][a-z0-9+.-]*:/i.test(value) || /\s/.test(value)) {
        urlInput.value = value;
        return;
    }

    if (/^(?:localhost|(?:[a-z0-9-]+\.)+[a-z]{2,})(?::\d+)?(?:[/?#].*)?$/i.test(value)) {
        urlInput.value = `https://${value}`;
    }
}

urlInput?.addEventListener("blur", normalizeUrl);

function showFieldError(field, message) {
    const wrapper = field.closest(".contact-form__field");

    if (!wrapper) return;

    let error = wrapper.querySelector(".contact-form__error");

    if (!error) {
        error = document.createElement("span");
        error.className = "contact-form__error";
        error.id = `${field.id}-error`;

        wrapper.appendChild(error);
    }

    error.textContent = message;

    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", error.id);
}


// ==========================================
// 3. CLEAR FIELD ERROR
// ==========================================

function clearFieldError(field) {
    const wrapper = field.closest(".contact-form__field");
    const error = wrapper?.querySelector(".contact-form__error");

    if (error) {
        error.remove();
    }

    field.removeAttribute("aria-invalid");

    if (
        field.getAttribute("aria-describedby") ===
        `${field.id}-error`
    ) {
        field.removeAttribute("aria-describedby");
    }
}


// ==========================================
// 4. VALIDATE INDIVIDUAL FIELD
// ==========================================

function validateField(field) {
    clearFieldError(field);

    if (field.checkValidity()) {
        return true;
    }

    let message = field.validationMessage;

    if (field.validity.valueMissing) {
        message = "This field is required.";
    } else if (field.validity.typeMismatch) {
        message = field.type === "email"
            ? "Enter a valid email address."
            : "Enter a valid URL.";
    }

    showFieldError(field, message);

    return false;
}


// ==========================================
// 5. HANDLE FORM SUBMISSION
// ==========================================


const submitButton = document.querySelector("#contact-submit");

form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Prevent duplicate submissions.
    if (submitButton?.disabled) return;

    // Clear previous status.
    if (statusMessage) {
        statusMessage.textContent = "";
        statusMessage.removeAttribute("data-state");
    }

    // Validate all fields.
    const fields = [
        ...form.querySelectorAll(
    ".contact-form__field input, .contact-form__field select, .contact-form__field textarea"
)
    ];

    let firstInvalidField = null;

    fields.forEach((field) => {
        const valid = validateField(field);

        if (!valid && !firstInvalidField) {
            firstInvalidField = field;
        }
    });

    if (firstInvalidField) {
        if (statusMessage) {
            statusMessage.textContent =
                "Please correct the highlighted fields.";
            statusMessage.dataset.state = "error";
        }

        firstInvalidField.focus();
        return;
    }

    // Verify that a real Formspree endpoint exists.
    const endpoint = form.action;

    if (
        !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+\/?$/.test(endpoint)
    ) {
        if (statusMessage) {
            statusMessage.textContent =
                "The contact form is not configured yet.";
            statusMessage.dataset.state = "error";
        }
        return;
    }

    // Start sending.
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
    }

    if (statusMessage) {
        statusMessage.textContent =
            "Sending your project enquiry...";
        statusMessage.dataset.state = "loading";
    }

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            body: new FormData(form),
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Formspree rejected the submission.");
        }

        // Only show success after a successful response.
        if (statusMessage) {
            statusMessage.textContent =
                "Your enquiry has been sent successfully. Thank you for reaching out!";
            statusMessage.dataset.state = "success";
        }

        // Clear fields only after success.
        form.reset();

        // Remove previous validation errors.
        fields.forEach(clearFieldError);

    } catch (error) {
        console.error("Contact form submission failed:", error);

        if (statusMessage) {
            statusMessage.textContent =
                "Your enquiry could not be sent. Please try again.";
            statusMessage.dataset.state = "error";
        }

        // Keep all entered values so the visitor can retry.

    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Send Project Enquiry";
        }
    }
});


// ==========================================
// 6. CLEAR ERRORS WHILE TYPING
// ==========================================

form?.addEventListener("input", (event) => {
    const field = event.target;

    if (!field.matches("input, select, textarea")) {
        return;
    }

    if (field.getAttribute("aria-invalid") === "true") {
        if (field.checkValidity()) {
            clearFieldError(field);
        }
    }
});


// ==========================================
// 7. CLEAR ERRORS WHEN VALUES CHANGE
// ==========================================

form?.addEventListener("change", (event) => {
    const field = event.target;

    if (!field.matches("input, select, textarea")) {
        return;
    }

    if (field.getAttribute("aria-invalid") === "true") {
        if (field.checkValidity()) {
            clearFieldError(field);
        }
    }
});
