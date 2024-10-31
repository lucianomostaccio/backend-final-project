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
        body: JSON.stringify({ role: newRole }), // Ensure 'role' is sent
        credentials: "include", // if needed
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to update role");
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
        .catch((error) => console.error("Error updating role:", error));
    });
  });

  const removeForms = document.querySelectorAll(".removeForm");

  removeForms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const userId = this.action.substring(this.action.lastIndexOf("/") + 1);

      fetch(`/api/admin/${userId}`, {
        method: "DELETE",
        credentials: "include", // if needed
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to remove user");
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
        .catch((error) => console.error("Error removing user:", error));
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
      // Verifica si se selecciona "all users" (value == "") o un usuario específico
      if (selectedId === "") {
        // Muestra todas las tarjetas y restablece las clases responsivas
        card.classList.remove("hidden", "w-full");
        card.classList.add("sm:w-1/2", "md:w-1/3", "lg:w-1/4");
      } else if (card.getAttribute("data-user-id") === selectedId) {
        // Solo muestra la tarjeta del usuario seleccionado con ancho completo
        card.classList.remove("hidden", "sm:w-1/2", "md:w-1/3", "lg:w-1/4");
        card.classList.add("w-full");
      } else {
        // Oculta las tarjetas que no coinciden con el usuario seleccionado
        card.classList.add("hidden");
        card.classList.remove("w-full", "sm:w-1/2", "md:w-1/3", "lg:w-1/4");
      }
    });
  });
  
});

