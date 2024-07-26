// @ts-nocheck
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector("#contactForm");
  const successMessage = document.querySelector("#successMessage");
  const contactUsTitle = document.querySelector("#contactUsTitle");

  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formObject.nameContact,
          email: formObject.emailContact,
          text: formObject.messageContact,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        contactForm.reset();
        contactForm.style.display = "none";
        successMessage.classList.remove("hidden");
        contactUsTitle.style.display = "none";
      } else {
        const error = await response.json();
        console.error(
          "Error:",
          error.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  });
});
