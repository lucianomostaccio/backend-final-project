document.addEventListener("DOMContentLoaded", function () {
    const editForms = document.querySelectorAll('.editForm');  
  
    editForms.forEach((form) => {
      form.addEventListener("submit", function (event) {
        event.preventDefault(); 
        const formData = new FormData(this);
        const newRole = formData.get("role"); 
        const userId = this.action.substring(this.action.lastIndexOf('/') + 1);
        
        fetch(`/api/admin/${userId}`, {  
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to update role');
          return response.json();
        })
        .then((data) => {
          alert("Role updated successfully!");
          location.reload();
        })
        .catch((error) => console.error("Error updating role:", error));
      });
    });
  
    const removeForms = document.querySelectorAll('.removeForm'); 
  
    removeForms.forEach((form) => {
      form.addEventListener("submit", function (event) {
        event.preventDefault(); 
        const userId = this.action.substring(this.action.lastIndexOf('/') + 1);
  
        fetch(`/api/admin/${userId}`, {  
          method: "DELETE",
        })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to remove user');
          alert("User removed successfully!");
          location.reload();
        })
        .catch((error) => console.error("Error removing user:", error));
      });
    });
  });
  