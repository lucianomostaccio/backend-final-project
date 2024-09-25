// @ts-ignore
const formResetPwd = document.querySelector("#confirmResetPassForm");

function getToken() {
  const path = window.location.pathname;
  const token = path.substring(path.lastIndexOf("/") + 1);
  return token;
}

formResetPwd?.addEventListener("submit", async (event) => {
  event.preventDefault();

  // @ts-ignore
  const formData = new FormData(formResetPwd);
  const newPassword = formData.get("new_password");
  const repeatPassword = formData.get("repeat_password");

  // Check if passwords match
  if (newPassword !== repeatPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Get token from URL
  const token = getToken();

  // Send request to reset password
  const response = await fetch(`/api/users/confirmresetpass/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword }),
  });

  // Handle response
  if (response.ok) {
    alert("Password reset successful. Please login.");
    window.location.href = "/login";
  } else {
    const error = await response.json();
    alert(error.message || "Failed to reset password");
  }
});
