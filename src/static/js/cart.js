// @ts-nocheck
// Función para calcular el total basado en los productos visibles en el DOM
function updateCartTotal() {
  // Seleccionar específicamente los elementos del carrito (contenedores de productos)
  // que están dentro del contenedor principal del carrito
  const cartContent = document.querySelector(".cartContent");
  if (!cartContent) {
    console.log("No se encontró el contenedor del carrito");
    return 0;
  }

  // Seleccionar solo los productos dentro del contenedor del carrito
  const productElements = cartContent.querySelectorAll(
    ".bg-white.dark\\:bg-gray-900"
  );
  let total = 0;

  console.log(`Encontrados ${productElements.length} productos en el carrito`);

  productElements.forEach((product, index) => {
    try {
      // Obtener el elemento del precio usando la clase personalizada
      const priceElement = product.querySelector(".product-price");
      if (!priceElement) {
        console.log(`Producto ${index + 1}: Elemento de precio no encontrado`);
        return; // Saltar este producto
      }

      // Obtener el texto del precio
      const priceText = priceElement.innerText;
      if (!priceText) {
        console.log(`Producto ${index + 1}: Texto de precio no encontrado`);
        return; // Saltar este producto
      }

      // Eliminar el símbolo de la moneda y cualquier espacio
      let cleanPriceText = priceText.replace(/[$€£¥]/g, "").trim();

      // Normalizar el formato del número: reemplazar coma por punto para decimales
      // Si el formato es 199,00 -> convertir a 199.00 para el parseFloat
      cleanPriceText = cleanPriceText.replace(/,/g, ".");

      // Convertir el texto del precio a un número
      const price = parseFloat(cleanPriceText);

      // Obtener el elemento de cantidad
      const quantityElement = product.querySelector('[id^="quantity-"]');
      if (!quantityElement) {
        console.log(
          `Producto ${index + 1}: Elemento de cantidad no encontrado`
        );
        return; // Saltar este producto
      }

      // Obtener la cantidad
      const quantity = parseInt(quantityElement.innerText, 10);

      // Añadir al total si los valores son válidos
      if (!isNaN(price) && !isNaN(quantity)) {
        const subtotal = price * quantity;
        total += subtotal;
        console.log(
          `Producto ${
            index + 1
          }: precio ${price} x cantidad ${quantity} = ${subtotal}`
        );
      } else {
        console.log(
          `Producto ${
            index + 1
          }: Valores inválidos - precio: ${price}, cantidad: ${quantity}`
        );
      }
    } catch (error) {
      console.error(`Error al procesar producto ${index + 1}:`, error);
    }
  });

  // Actualizar el elemento del total en la página
  const cartTotalElement = document.querySelector(
    ".cartContentTotal .text-gray-900"
  );
  if (cartTotalElement) {
    cartTotalElement.innerHTML = `Total: ${formatPrice(total)}`;
    console.log("Total del carrito actualizado: " + formatPrice(total));
  } else {
    console.log("Elemento del total del carrito no encontrado");
  }

  return total;
}

// Hacer la función disponible globalmente para que pueda ser usada en global.js
window.updateCartTotal = updateCartTotal;

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Calcular el total inicial
  updateCartTotal();
});

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
      // Remove the product card from the DOM
      const productCard =
        document.getElementById(`product-${productId}`) ||
        event.target.closest(".bg-white.dark\\:bg-gray-900");
      if (productCard) {
        productCard.remove();
      }

      // Calcular y actualizar el total del carrito
      updateCartTotal();

      // Update the cart total if it exists on the page
      if (data.payload && data.payload.total !== undefined) {
        const cartTotalElement = document.querySelector(
          ".cartContentTotal .text-gray-900"
        );
        if (cartTotalElement) {
          cartTotalElement.innerHTML = `Total: ${formatPrice(
            data.payload.total
          )}`;
        }
      }

      // If no more products in cart, show empty cart
      if (
        data.payload &&
        data.payload.products &&
        data.payload.products.length === 0
      ) {
        renderEmptyCart();
      }

      // Show notification
      Toastify({
        text: "Product removed from cart",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#9f0808",
      }).showToast();

      // Update the cart count in navbar
      let cartCountElement = document.querySelector(".cart-count");
      if (cartCountElement) {
        let cartCount = Number(cartCountElement.textContent);
        // Decrease by the product quantity (if we knew it)
        // For simplicity, just setting it to match the new products length
        if (data.payload && data.payload.productsCount !== undefined) {
          cartCountElement.textContent = data.payload.productsCount;
        } else {
          cartCount--;
          cartCountElement.textContent = cartCount > 0 ? cartCount : 0;
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Import the formatPrice function from global.js
function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
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
  cartContent.remove();
  cartContentTotal.remove();
  mainCartContainer.insertAdjacentHTML("afterend", emptyCartHTML);
}
