document.addEventListener("DOMContentLoaded", function () {
  const editForms = document.querySelectorAll(".editForm");

  editForms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const newRole = formData.get("role");
      const userId = this.action.substring(this.action.lastIndexOf("/") + 1);

      fetch(`/api/admin/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to update role: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // @ts-ignore
          Toastify({
            text: "Role updated successfully!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#28a745",
          }).showToast();

          // Update role in the DOM
          const userCard = document.querySelector(`[data-user-id="${userId}"]`);
          if (userCard) {
            const roleSpan = userCard.querySelector("span");
            // Update the text content with the new data
            // @ts-ignore
            roleSpan.textContent = `USER: ${data.first_name} ${data.last_name} <br>ROLE: ${data.role}`;
          }
        })
        .catch((error) => {
          console.error("Error updating role:", error);
          // @ts-ignore
          Toastify({
            text: "Failed to update role. Please try again.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#dc3545",
          }).showToast();
        });
    });
  });

  const removeForms = document.querySelectorAll(".removeForm");

  removeForms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const userId = this.action.substring(this.action.lastIndexOf("/") + 1);

      fetch(`/api/admin/${userId}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to remove user: ${response.status}`);
          }
          // @ts-ignore
          Toastify({
            text: "User removed successfully!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#dc3545",
          }).showToast();

          // Remove user card from the DOM
          const userCard = document.querySelector(`[data-user-id="${userId}"]`);
          if (userCard) {
            userCard.remove();
          }
        })
        .catch((error) => {
          console.error("Error removing user:", error);
          // @ts-ignore
          Toastify({
            text: "Failed to remove user. Please try again.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#dc3545",
          }).showToast();
        });
    });
  });

  // Add user selection functionality
  const userSelect = document.getElementById("userSelect");
  const userCards = document.querySelectorAll(".productTitle");

  // @ts-ignore
  userSelect.addEventListener("change", function () {
    // @ts-ignore
    const selectedId = this.value;

    userCards.forEach((card) => {
      // Check if "all users" (value == "") is selected or a specific user
      if (selectedId === "") {
        // Show all cards and reset responsive classes
        card.classList.remove("hidden", "w-full");
        card.classList.add("sm:w-1/2", "md:w-1/3", "lg:w-1/4");
      } else if (card.getAttribute("data-user-id") === selectedId) {
        // Only show the selected user's card with full width
        card.classList.remove("hidden", "sm:w-1/2", "md:w-1/3", "lg:w-1/4");
        card.classList.add("w-full");
      } else {
        // Hide cards that don't match the selected user
        card.classList.add("hidden");
        card.classList.remove("w-full", "sm:w-1/2", "md:w-1/3", "lg:w-1/4");
      }
    });
  });
});
