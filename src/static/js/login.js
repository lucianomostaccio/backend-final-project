// @ts-nocheck
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");
  const formLogin = document.querySelector("#loginForm");
  const emailInput = document.querySelector('input[name="email"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const rememberCheckbox = document.getElementById("remember");
  const passwordError = document.getElementById("passwordError");

  // Load saved data when the page loads
  emailInput.value = localStorage.getItem("email") || "";
  rememberCheckbox.checked = localStorage.getItem("remember") === "true";

  formLogin.addEventListener("submit", async (event) => {
    console.log("form submitted");
    event.preventDefault();

    // Reset error message
    passwordError.textContent = "";
    passwordError.classList.add("hidden");

    // Set local storage according to checkbox status
    if (rememberCheckbox.checked) {
      console.log("remembered, saving to localstorage");
      localStorage.setItem("email", emailInput.value);
      // localStorage.setItem("password", passwordInput.value);
      localStorage.setItem("remember", "true");
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("remember");
    }

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(formLogin)),
      });

      const data = await response.json();
      console.log(response.status)

      if (response.status === 201) {
        console.log("response successful");
        window.location.href = "/home";
      } else if (response.status === 401) {
        console.log("authentication failed");
        passwordError.textContent = data.message;
        passwordError.classList.remove("hidden");
        passwordInput.value = ""; // Clear the password field
      } 
    } catch (error) {
      console.error("Error during login:", error);
      passwordError.textContent = "Email or password incorrect. Please try again."; 
      passwordError.classList.remove("hidden");
      passwordInput.value = ""; // Clear the password field
    }
  });
});
