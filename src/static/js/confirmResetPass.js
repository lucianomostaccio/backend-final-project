// @ts-ignore
const formResetPwd = document.querySelector("#resetPassForm");

function getToken() {
  const path = window.location.pathname;
  const token = path.substring(path.lastIndexOf("/") + 1);
  console.log("Token obtained by getToken: ", token);
  return token;
}

formResetPwd?.addEventListener("submit", async (event) => {
  event.preventDefault();

  // @ts-ignore
  const formData = new FormData(formResetPwd);
  const newPassword = formData.get("new_password");
  console.log("newPassword", newPassword);
  const repeatPassword = formData.get("repeat_password");
  console.log("repeatPassword", repeatPassword);

  // Validar que las contraseñas coincidan
  if (newPassword !== repeatPassword) {
    alert("Passwords do not match.");
    return;
  }

  const token = getToken();
  console.log("2 token obtained by getToken: ", token);

  const response = await fetch(`/api/users/confirmresetpass/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword }),
  });

  if (response.ok) {
    alert("Password reset successful. Please login.");
    window.location.href = "/login";
  } else {
    const error = await response.json();
    alert(error.message || "Failed to reset password");
  }
});
