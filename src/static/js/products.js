document.addEventListener("DOMContentLoaded", function () {
  const addToCartForms = document.querySelectorAll(".addToCartButton");
  const main = document.querySelector("main");
  // @ts-ignore
  main.classList.remove("flex", "items-center", "justify-center");
  
  addToCartForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get the action URL from the form
      // @ts-ignore
      const actionUrl = form.action;


      // Extract the product ID from the action URL
      const url = new URL(actionUrl);
      const productId = url.pathname.split("/")[2];

      try {
        // Send the product ID to the server
        const response = await fetch(`/api/products/${productId}/add-to-cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          alert("Product added to cart successfully!");
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Failed to add product to cart: ${errorData.message || ""}`);
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("Error adding product to cart. Please try again.");
      }
    });
  });
});
