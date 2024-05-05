// @ts-nocheck
const formEditProfile = document.querySelector("#form-edit-profile");
const inputs = document.querySelectorAll("input");

//first, we load current profile data
window.addEventListener("load", async (event) => {
  const response = await fetch("/api/users/current");

  const result = await response.json();
  const user = result.payload;

  //bring current data to inputs
  inputs[0].value = user.first_name;
  inputs[1].value = user.last_name;
  inputs[2].value = user.email;
  inputs[5].value = user.age;
});

//secondly, we handle edit submitting
formEditProfile?.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData(formEditProfile);
    formData.append("email", inputs[2].value);
    console.log("Form data:", formData);

    const body = formData;

    const response = await fetch("/api/users/edit", {
      method: "PUT",
      body,
    });

    if (response.status === 200) {
      alert("Profile updated successfully");
      window.location.href = "/profile";
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (error) {
    console.error("Error during profile update:", error);
    alert("An error occurred during profile update. Please try again later.");
  }
});

function previewImage() {
  let preview = document.querySelector("#imagePreview");
  let fileInput = document.querySelector("#newProfilePicture");
  let file = fileInput.files[0];
  let reader = new FileReader();

  reader.onloadend = function () {
    preview.innerHTML =
      '<img class="profile_picture modal-trigger" src="' +
      reader.result +
      '" alt="Profile picture preview">';
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "";
  }
}
