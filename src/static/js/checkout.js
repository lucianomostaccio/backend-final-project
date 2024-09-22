// @ts-nocheck
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
      const cartCount = document.querySelector(".cart-count");
      mainContainer.innerHTML = `<h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">Thank you for your purchase!</h2> <br> <p class="text-gray-500 dark:text-gray-400 mb-8">You will receive a confirmation email and order summary shortly.</p> <br>       <a class=" text-center bg-black text-gray-50 hover:bg-gray-800 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900 px-6 py-3 rounded-md font-medium" href="/products" rel="ugc">Continue Shopping</a>`;
      cartCount.textContent = "0";
    })
    .catch((error) => {
      console.error("Error during purchase:", error);
      alert("Error completing purchase. Please try again.");
    });
}
