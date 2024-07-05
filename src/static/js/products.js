document.addEventListener("DOMContentLoaded", function () {
  const main = document.querySelector("main");
  // @ts-ignore
  main.classList.remove("flex", "items-center", "justify-center");
});

function addProductToCart(event, productId) {
  event.preventDefault();

  fetch(`/api/carts/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "addProduct",
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
