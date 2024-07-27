function buyCart(event, cartId) {
  event.preventDefault();
  console.log("Purchasing items in cart:", cartId);

  fetch(`/api/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartId: cartId,
    }),
  })
    .then((response) => {
      console.log("Purchase response status:", response.status);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to complete purchase");
      }
    })
    .then((data) => {
      console.log("Purchase successful, redirecting:", data);
      // Clear the main container and show a thank you message
      const mainContainer = document.querySelector("#main-content");
      // @ts-ignore
      mainContainer.innerHTML = `<h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">Thank you for your purchase! You will receive a confirmation email and order summary shortly.</h2>`;
    })
    .catch((error) => {
      console.error("Error during purchase:", error);
      alert("Error completing purchase. Please try again.");
    });
}
