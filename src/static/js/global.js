// @ts-nocheck

//modal for images
document.addEventListener("DOMContentLoaded", () => {
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
});

//update cart in real time
document.addEventListener("DOMContentLoaded", () => {
  const addToCartForms = document.querySelectorAll(".addToCartButton");
  const cartQuantityElement = document.getElementById("cartQuantity");

  addToCartForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("addtocart selected");

      const actionUrl = form.getAttribute("action");

      try {
        const response = await fetch(actionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Incluir las cookies en la solicitud
        });

        if (response.ok) {
          const updatedCart = await response.json();
          const newQuantity = updatedCart.products.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          cartQuantityElement.textContent = newQuantity;
        } else {
          console.error("Error updating cart:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});

//dark mode toggle
document
  .querySelector("#dark-mode-toggle")
  .addEventListener("click", function () {
    const isDarkMode = document.documentElement.classList.toggle("dark");

    document.getElementById("dark-mode-icon").style.display = isDarkMode
      ? "block"
      : "none";
    document.getElementById("light-mode-icon").style.display = isDarkMode
      ? "none"
      : "block";
  });
