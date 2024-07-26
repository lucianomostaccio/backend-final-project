document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector("#contactForm");

  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    // @ts-ignore
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
        alert("Thanks for your message!");
        // @ts-ignore
        contactForm.reset();
      } else {
        const error = await response.json();
        alert(error.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
