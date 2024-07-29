// @ts-nocheck
function removeWholeProductFromCart(event, productId) {
  event.preventDefault();

  fetch(`/api/carts/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "removeWholeProduct",
      productId: productId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function removeCart(event, cartId) {
  event.preventDefault();

  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        Toastify({
          text: "Cart cleared",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#9f0808",
        }).showToast();
        renderEmptyCart();
      } else {
        throw new Error("Failed to clear cart");
      }
    })
    .catch((error) => {
      console.error("Error clearing cart:", error);
      alert("Error clearing cart. Please try again.");
    });
}

function renderEmptyCart() {
  const mainCartContainer = document.querySelector("#mainCartContainer");
  const cartContent = document.querySelector(".cartContent");
  const cartContentTotal = document.querySelector(".cartContentTotal");
  const emptyCartHTML = `
    <div class="container mx-auto px-4 md:px-6 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-16 w-16 text-gray-500 dark:text-gray-400 mx-auto mb-4"
      >
        <circle cx="8" cy="21" r="1"></circle>
        <circle cx="19" cy="21" r="1"></circle>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
      </svg>
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Your cart is empty</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8">Start shopping to add items to your cart</p>
      <a class="bg-black text-gray-50 hover:bg-gray-800 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900 px-6 py-3 rounded-md font-medium" href="/products" rel="ugc">Continue Shopping</a>
    </div>`;
    cartContent.remove()
    cartContentTotal.remove()
    mainCartContainer.insertAdjacentHTML('afterend', emptyCartHTML);
}
