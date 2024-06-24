// @ts-nocheck
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");
  const formLogin = document.querySelector("#loginForm");
  const emailInput = document.querySelector('input[name="email"]');
  const rememberCheckbox = document.getElementById("remember");

  // Load saved data when the page loads
  emailInput.value = localStorage.getItem("email") || "";
  rememberCheckbox.checked = localStorage.getItem("remember") === "true";

  formLogin.addEventListener("submit", async (event) => {
    console.log("form submitted");
    event.preventDefault();

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

    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(formLogin)),
    });

    if (response.status === 201) {
      console.log("reponse successfull");
      const session = await response.json();
      window.location.href = "/home";
    } else if (response.status === 401) {
      console.log("reponse failed");
      alert("Invalid credentials");
    } else {
      const error = await response.text();
      alert(`Error: ${error}`);
    }
  });
});
