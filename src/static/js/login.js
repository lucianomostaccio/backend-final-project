// @ts-nocheck
document.addEventListener("DOMContentLoaded", function () {
  const formLogin = document.querySelector("form");
  const emailInput = document.querySelector('input[name="email"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const rememberCheckbox = document.getElementById("remember");

  if (!formLogin || !emailInput || !passwordInput || !rememberCheckbox) {
    console.error("One or more elements not found:", {
      formLogin,
      emailInput,
      passwordInput,
      rememberCheckbox,
    });
    return;
  }

  // Load saved data when the page loads
  emailInput.value = localStorage.getItem("email") || "";
  passwordInput.value = localStorage.getItem("password") || "";
  rememberCheckbox.checked = localStorage.getItem("remember") === "true";

  formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Set local storage according to checkbox status
    if (rememberCheckbox.checked) {
      localStorage.setItem("email", emailInput.value);
      localStorage.setItem("password", passwordInput.value);
      localStorage.setItem("remember", "true");
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      localStorage.removeItem("remember");
    }

    const formData = new URLSearchParams(new FormData(formLogin));

    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (response.status === 201) {
      const session = await response.json();
      window.location.href = "/products";
    } else if (response.status === 401) {
      alert("Invalid credentials");
    } else {
      const error = await response.text();
      alert(`Error: ${error}`);
    }
  });
});
