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

// function buyCart(event, cartId) {
//   event.preventDefault();

//   // Assuming the API endpoint to create a ticket and handle the purchase is `/api/tickets`
//   fetch(`/api/tickets`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       cartId: cartId  
//     })
//   })
//   .then((response) => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error('Failed to complete purchase');
//     }
//   })
//   .then((data) => {
//     alert("Thank you for your purchase!");
//     window.location.href = '/thank-you';  // Redirect to a thank-you page or similar
//   })
//   .catch((error) => {
//     console.error("Error during purchase:", error);
//     alert("Error completing purchase. Please try again.");
//   });
// }

function buyCart(event, cartId) {
  event.preventDefault();
  console.log("Purchasing items in cart:", cartId);

  fetch(`/api/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartId: cartId  
    })
  })
  .then((response) => {
    console.log("Purchase response status:", response.status);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to complete purchase');
    }
  })
  .then((data) => {
    console.log("Purchase successful, redirecting:", data);
    alert("Thank you for your purchase!");
    window.location.reload();
  })
  .catch((error) => {
    console.error("Error during purchase:", error);
    alert("Error completing purchase. Please try again.");
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

// function buyCart(event, cartId) {
//   event.preventDefault();

//   fetch(`/api/carts/${cartId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       if (response.ok) {
//         alert("THANK YOU FOR YOUR PURCHASE!");
//         window.location.reload();
//       } else {
//         throw new Error("Failed to clear cart");
//       }
//     })
//     .catch((error) => {
//       console.error("Error clearing cart:", error);
//       alert("Error clearing cart. Please try again.");
//     });
// 
