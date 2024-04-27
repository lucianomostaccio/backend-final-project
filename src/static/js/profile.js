const formLogout = document.querySelector("#form-logout");

formLogout?.addEventListener("submit", async (event) => {
  event.preventDefault();


  try {
    const response = await fetch("/api/sessions/current", {
      method: "DELETE",
    });


    if (response.status === 204) {
      window.location.href = "/login";
    } else {
      const error = await response.json();
      console.error("Error during logout:", error); // Log any errors during logout
      alert(error.message);
    }
  } catch (error) {
    console.error("Error closing the session:", error); // Log errors caught in the catch block
  }
});
