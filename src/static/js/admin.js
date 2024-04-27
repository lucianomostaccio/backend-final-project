document.addEventListener("DOMContentLoaded", function () {
  const editRoleForms = document.querySelectorAll(".edit-role-form");
  const removeUserForms = document.querySelectorAll(".remove-user-form");

  editRoleForms.forEach((form) => {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const userId = form.dataset.userId;
      const newRole = form.querySelector("input[name='role']").value;

      try {
        const response = await fetch(`/admin/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        });

        if (!response.ok) {
          throw new Error("Failed to update role");
        }

        // Reload the page to reflect changes
        window.location.reload();
      } catch (error) {
        console.error("Error updating role:", error.message);
        // Handle error if needed
      }
    });
  });

  removeUserForms.forEach((form) => {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const userId = form.dataset.userId;

      try {
        const response = await fetch(`/admin/${userId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to remove user");
        }

        // Reload the page to reflect changes
        window.location.reload();
      } catch (error) {
        console.error("Error removing user:", error.message);
        // Handle error if needed
      }
    });
  });
});
