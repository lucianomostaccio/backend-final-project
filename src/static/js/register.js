// @ts-nocheck
document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("profilePicture");
  const fileChosen = document.getElementById("file-chosen");

  fileInput.addEventListener("change", function (e) {
    if (this.files && this.files[0]) {
      fileChosen.textContent = this.files[0].name;
    } else {
      fileChosen.textContent = "No file chosen";
    }
  });
});

// @ts-ignore
const formRegister = document.querySelector("form");

formRegister?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/api/users", {
    method: "POST",
    // @ts-ignore
    body: new FormData(formRegister),
  });

  if (response.status === 201) {
    // @ts-ignore
    // @ts-ignore
    const { payload: user } = await response.json();
    alert("Registration successful");

    window.location.href = "/login";
  } else {
    const error = await response.json();
    alert(error.message);
  }
});

function previewImage() {
  let preview = document.querySelector("#imagePreview");
  let fileInput = document.querySelector("#profilePicture");
  let fileChosen = document.querySelector("#file-chosen");

  if (fileInput.files && fileInput.files[0]) {
    let file = fileInput.files[0];
    fileChosen.textContent = file.name;

    let reader = new FileReader();

    reader.onloadend = function () {
      preview.innerHTML =
        '<img class="profile_picture modal-trigger rounded-full w-12 h-12 object-cover" src="' +
        reader.result +
        '" alt="Preview Profile Picture">';
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "";
    preview.style.display = "none";
    fileChosen.textContent = "No file chosen";
  }
}
