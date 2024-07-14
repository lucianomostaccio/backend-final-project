// @ts-nocheck
document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  main.classList.remove("flex", "items-center", "justify-center");
  loadProducts();
  closeMenus();
});

//filter and sort products:
// DOM elements
const filterButton = document.getElementById("filter-button");
const sortButton = document.getElementById("sort-button");
const filterMenu = document.getElementById("filter-menu");
const sortMenu = document.getElementById("sort-menu");
const productGrid = document.querySelector(".grid");

// State
let products = [];
let filters = {
  categories: [],
  featured: false,
  trending: false,
};
let currentSort = "";

// Load products
async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    const data = await response.json();

    // Verificar la estructura de la respuesta y extraer los productos
    if (data && data.payload && Array.isArray(data.payload)) {
      products = data.payload;
    } else {
      console.error(
        "El formato de los datos de productos es inesperado:",
        data
      );
      products = [];
    }

    renderProducts(products);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    productGrid.innerHTML =
      "<p>Error al cargar los productos. Por favor, intenta de nuevo más tarde.</p>";
  }
}

// Render products
function renderProducts(productsToRender) {
  if (!Array.isArray(productsToRender)) {
    console.error(
      "renderProducts recibió un argumento no válido:",
      productsToRender
    );
    productGrid.innerHTML =
      "<p>Error al mostrar los productos. Por favor, intenta de nuevo más tarde.</p>";
    return;
  }

  productGrid.innerHTML = productsToRender
    .map(
      (product) => `
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <img src="${getFirstValidThumbnail(
        product.thumbnails
      )}" alt="Product image" width="400" height="400" class="rounded-t-lg object-cover w-full h-56" style="aspect-ratio: 400 / 400; object-fit: cover;">
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-50">${
          product.title
        }</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4 flex-grow">${
          product.description
        }</p>
        <div class="flex items-center justify-between mt-auto">
          <span class="text-xl font-bold text-gray-900 dark:text-gray-50">${formatPrice(
            product.price
          )}</span>
          <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 bg-gray-400 text-gray-50 hover:bg-gray-600 dark:bg-primary-400 dark:text-gray-900 dark:hover:bg-primary-500" type="button" onclick="addProductToCart(event, '${
            product._id
          }')">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Apply filters
function applyFilters() {
  if (!Array.isArray(products)) {
    console.error("Los productos no son un array válido:", products);
    return;
  }

  let filteredProducts = products.filter((product) => {
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);
    const featuredMatch = !filters.featured || product.featured;
    const trendingMatch = !filters.trending || product.trending;
    return categoryMatch && featuredMatch && trendingMatch;
  });

  if (currentSort) {
    filteredProducts = sortProducts(filteredProducts, currentSort);
  }

  renderProducts(filteredProducts);
}

// Order products
function sortProducts(productsToSort, sortOption) {
  if (!Array.isArray(productsToSort)) {
    console.error(
      "sortProducts recibió un argumento no válido:",
      productsToSort
    );
    return productsToSort;
  }

  switch (sortOption) {
    case "price-asc":
      return productsToSort.sort((a, b) => a.price - b.price);
    case "price-desc":
      return productsToSort.sort((a, b) => b.price - a.price);
    case "name-asc":
      return productsToSort.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return productsToSort.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return productsToSort;
  }
}

// Function to close all menus
function closeMenus(exceptMenu) {
  [filterMenu, sortMenu].forEach((menu) => {
    if (menu !== exceptMenu) {
      menu.classList.add("hidden");
    }
  });
}

// Fuction to handle clicks outside the menus
function handleOutsideClick(event) {
  if (
    !filterButton.contains(event.target) &&
    !filterMenu.contains(event.target) &&
    !sortButton.contains(event.target) &&
    !sortMenu.contains(event.target)
  ) {
    closeMenus();
  }
}

// Event Listeners for filters and sorting options
filterButton.addEventListener("click", (event) => {
  event.stopPropagation();
  filterMenu.classList.toggle("hidden");
  closeMenus(filterMenu);
});

sortButton.addEventListener("click", (event) => {
  event.stopPropagation();
  sortMenu.classList.toggle("hidden");
  closeMenus(sortMenu);
});

document.querySelectorAll('input[name="category"]').forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      filters.categories.push(e.target.value);
    } else {
      filters.categories = filters.categories.filter(
        (cat) => cat !== e.target.value
      );
    }
    applyFilters();
  });
});

document.getElementById("featured-filter").addEventListener("change", (e) => {
  filters.featured = e.target.checked;
  applyFilters();
});

document.getElementById("trending-filter").addEventListener("change", (e) => {
  filters.trending = e.target.checked;
  applyFilters();
});

document.querySelectorAll(".sort-option").forEach((option) => {
  option.addEventListener("click", (e) => {
    e.preventDefault();
    currentSort = e.target.dataset.sort;
    applyFilters();
    sortMenu.classList.add("hidden");
  });
});

// Event Listeners for clicks
document.addEventListener("click", handleOutsideClick);

// Aux functions
function getFirstValidThumbnail(thumbnails) {
  return Array.isArray(thumbnails) && thumbnails.length > 0
    ? thumbnails.find((thumbnail) => thumbnail !== "") ||
        "/path/to/default/image.jpg"
    : "/path/to/default/image.jpg";
}

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}
