// @ts-nocheck
//modal for images
document.addEventListener("DOMContentLoaded", () => {
  // Check the dark mode status from localStorage on DOMContentLoaded
  toggleDarkMode(true);

  //use event delegation to add event listener to all images
  document.body.addEventListener("click", function (event) {
    if (event.target && event.target.matches("img.modal-trigger")) {
      showModal(event.target.src, event.target.alt || "");
    }
  });

  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const span = document.getElementsByClassName("close")[0];

  function showModal(src) {
    modal.style.display = "flex";
    modalImg.src = src;
  }

  span.onclick = () => (modal.style.display = "none");

  //searchbar
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector(".search-input");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
    }
  });
});

//update cart in real time
function addProductToCart(event, productId) {
  event.preventDefault();
  console.log("addtocart selected");

  fetch(`/api/carts/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "addProduct",
      productId: productId,
    }),
    credentials: "include", // Include cookies in the request
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response data:", data);
      if (data.showToast) {
        Toastify({
          text: data.message,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      }
      if (data && data.payload && data.payload.products) {
        const product = data.payload.products.find(
          (item) => item.productId === productId
        );
        if (product) {
          // Use Toastify to show a success message
          Toastify({
            text: "Product added to cart",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#4fbe87",
          }).showToast();
          const quantityDisplay = document.querySelector(
            `#quantity-${productId}`
          );
          console.log("adding product to navbar icon");
          let cartCountElement = document.querySelector(".cart-count");
          let cartCount = Number(cartCountElement.textContent);
          console.log("cartCount:", cartCount);
          cartCount++;
          cartCountElement.textContent = cartCount;

          if (quantityDisplay) {
            quantityDisplay.textContent = product.quantity;
            const removeBtn = document.querySelector(
              `#remove-btn-${productId}`
            );
            if (product.quantity > 1) {
              removeBtn.removeAttribute("disabled");
            } else {
              removeBtn.setAttribute("disabled", "disabled");
            }
          }
        }
      } else {
        console.error("Invalid data format:", data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function removeProductFromCart(event, productId) {
  event.preventDefault();
  console.log("remove unit from cart selected");

  fetch(`/api/carts/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "removeProduct",
      productId: productId,
    }),
    credentials: "include", // Include cookies in the request
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response data:", data);
      if (data && data.payload && data.payload.products) {
        const product = data.payload.products.find(
          (item) => item.productId === productId
        );
        if (product) {
          Toastify({
            text: "Product removed from cart",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#9f0808",
          }).showToast();
          const quantityDisplay = document.querySelector(
            `#quantity-${productId}`
          );
          quantityDisplay.textContent = product.quantity;

          let cartCountElement = document.querySelector(".cart-count");
          let cartCount = Number(cartCountElement.textContent);
          cartCount--;
          cartCountElement.textContent = cartCount;

          const removeBtn = document.querySelector(`#remove-btn-${productId}`);
          if (product.quantity > 1) {
            removeBtn.removeAttribute("disabled");
          } else {
            removeBtn.setAttribute("disabled", "disabled");
          }
        }
      } else {
        console.error("Invalid data format:", data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//dark mode toggle
function toggleDarkMode(initialCheck = false) {
  let isDarkMode;

  if (initialCheck) {
    // On initial check, read the dark mode setting from localStorage
    isDarkMode = localStorage.getItem("darkMode") === "true";
    document.documentElement.classList.toggle("dark", isDarkMode);
  } else {
    // On button click, toggle the dark mode
    isDarkMode = document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", isDarkMode);
  }

  // Update icons based on the dark mode status
  document.getElementById("dark-mode-icon").style.display = isDarkMode
    ? "block"
    : "none";
  document.getElementById("light-mode-icon").style.display = isDarkMode
    ? "none"
    : "block";
}

// Event listener for dark mode toggle
document
  .querySelector("#dark-mode-toggle")
  .addEventListener("click", function () {
    toggleDarkMode();
  });

// JavaScript to toggle the mobile menu on navbar
document
  .getElementById("mobile-menu-button")
  .addEventListener("click", function () {
    document.getElementById("mobile-menu").classList.toggle("hidden");
  });

// Close mobile menu when clicking outside
document.addEventListener("click", function (event) {
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  if (
    !mobileMenu.contains(event.target) &&
    !mobileMenuButton.contains(event.target)
  ) {
    mobileMenu.classList.add("hidden");
  }
});

function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("hidden");
}
