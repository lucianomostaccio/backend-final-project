function removeProductFromCart(event, cartId, productId) {
  event.preventDefault();

  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "removeProduct",
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
        window.location.reload();
      } else {
        throw new Error("Failed to clear cart");
      }
    })
    .catch((error) => {
      console.error("Error clearing cart:", error);
      alert("Error clearing cart. Please try again.");
    });
}

function buyCart(event, cartId) {
  event.preventDefault();

  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        alert("THANK YOU FOR YOUR PURCHASE!");
        window.location.reload();
      } else {
        throw new Error("Failed to clear cart");
      }
    })
    .catch((error) => {
      console.error("Error clearing cart:", error);
      alert("Error clearing cart. Please try again.");
    });
}
