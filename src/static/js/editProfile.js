// @ts-nocheck
const formEditProfile = document.querySelector("#form-edit-profile");
const inputs = document.querySelectorAll(".profileInput");

//first, we load current profile data
window.addEventListener("load", async (event) => {
  const response = await fetch("/api/users/current");

  const result = await response.json();
  const user = result.payload;

  //bring current data to inputs
  inputs[0].value = user.first_name;
  inputs[1].value = user.last_name;
  inputs[2].value = user.email;
  inputs[3].value = user.age;
});

//secondly, we handle edit submitting
formEditProfile?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newPassword = document.querySelector("[name='newPassword']").value;
  const repeatNewPassword = document.querySelector(
    "[name='repeatNewPassword']"
  ).value;

  if (newPassword !== repeatNewPassword) {
    alert("The new passwords do not match.");
    return;
  }

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
      window.location.href = "/edit";
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

//Finally, for the change password dropdown:
document
  .querySelector(".dropdown-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
      dropdownContent.classList.remove("show");
    } else {
      dropdownContent.style.display = "block";
      dropdownContent.classList.add("show");
    }
  });
