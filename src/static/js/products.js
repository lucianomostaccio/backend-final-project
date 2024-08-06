// @ts-nocheck
document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  main.classList.remove("flex", "items-center", "justify-center");
  loadProducts();
  closeMenus();
  applyUrlFilters();
  setupClearSearchButton();
  setupViewAllProductsButton();
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
let currentSearch = "";

// Load products
async function loadProducts() {
  try {
    const url = new URL(window.location.href);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    let apiUrl = "/api/products";

    if (category) {
      apiUrl += `?category=${encodeURIComponent(category)}`;
    }
    if (search) {
      apiUrl += category ? "&" : "?";
      apiUrl += `search=${encodeURIComponent(search)}`;
      currentSearch = search;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.payload && Array.isArray(data.payload)) {
      products = data.payload;
    } else {
      console.error(
        "data format is not valid. Expected an array in payload:",
        data
      );
      products = [];
    }

    renderProducts(products);
    updateClearSearchButtonVisibility();
  } catch (error) {
    console.error("Error loading products:", error);
    productGrid.innerHTML =
      "<p class=dark:text-gray-300>Error loading products.</p>";
  }
}

// Render products
function renderProducts(productsToRender) {
  if (!Array.isArray(productsToRender)) {
    console.error("renderProducts got an invalid argument:", productsToRender);
    productGrid.innerHTML =
      "<p class=dark:text-gray-300>Error rendering products.</p>";
    return;
  }

  if (productsToRender.length === 0) {
    productGrid.innerHTML =
      "<p class=dark:text-gray-300> No products were found.</p>";
    return;
  }

  productGrid.innerHTML = productsToRender
    .map(
      (product) => `
    <div class="product-card file:bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
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
    console.error("products are not a valid array", products);
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
    console.error("sortProducts got an invalid argument:", productsToSort);
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

// Function to apply filters from URL
function applyUrlFilters() {
  const url = new URL(window.location.href);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");

  if (category) {
    const checkbox = document.querySelector(
      `input[name="category"][value="${category}"]`
    );
    const pageTitleCategory = document.querySelector("#titleProductsPage");
    if (pageTitleCategory) {
      pageTitleCategory.textContent = category;
    }
    const filterButtonProducts = document.querySelector("#filter-button");
    if (filterButtonProducts) {
      filterButtonProducts.style.display = "none";
    }
    if (checkbox) {
      checkbox.checked = true;
      filters.categories = [category];
    }
  }

  if (search) {
    currentSearch = search;
    const searchInput = document.querySelector(".search-input");
    const pageTitleCategory = document.querySelector("#titleProductsPage");
    pageTitleCategory.textContent = `Search: ${search}`;
    if (searchInput) {
      searchInput.value = search;
    }
  }
  applyFilters();
  updateClearSearchButtonVisibility();
}

// Function to setup Clear Search button
function setupClearSearchButton() {
  const filterButton = document.querySelector("#filter-button");
  if (filterButton) {
    const clearSearchButton = document.createElement("button");
    clearSearchButton.id = "clear-search-button";
    clearSearchButton.className = filterButton.className; // use same classes as filter button
    clearSearchButton.classList.add(
      "dark:text-gray-300",
      "hover:border-red-500"
    );
    clearSearchButton.textContent = "Clear Search";
    clearSearchButton.style.display = "none";
    filterButton.parentNode.insertBefore(clearSearchButton, filterButton);

    clearSearchButton.addEventListener("click", clearSearch);
  }
}

// Function to clear search
function clearSearch() {
  const url = new URL(window.location.href);
  url.searchParams.delete("search");
  window.history.pushState({}, "", url);
  currentSearch = "";
  const searchInput = document.querySelector(".search-input");
  const pageTitleCategory = document.querySelector("#titleProductsPage");
  pageTitleCategory.textContent = "All Products";
  if (searchInput) {
    searchInput.value = "";
  }
  loadProducts();
}

// Function to update Clear Search button visibility
function updateClearSearchButtonVisibility() {
  const clearSearchButton = document.querySelector("#clear-search-button");
  if (clearSearchButton) {
    clearSearchButton.style.display = currentSearch ? "inline-flex" : "none";
  }
}

// Function to setup View All Products button
function setupViewAllProductsButton() {
  const filterButton = document.querySelector("#filter-button");
  const url = new URL(window.location.href);
  const category = url.searchParams.get("category");

  if (filterButton && category) {
    const viewAllProductsButton = document.createElement("button");
    viewAllProductsButton.id = "view-all-products-button";
    viewAllProductsButton.className = filterButton.className; // use same classes as filter button
    viewAllProductsButton.classList.remove(
      "hover:border-green-500"
    );
    viewAllProductsButton.classList.add(
      "dark:text-gray-300",
      "hover:border-red-500"
    );
    viewAllProductsButton.textContent = "Clear - View All";
    filterButton.parentNode.insertBefore(viewAllProductsButton, filterButton);

    viewAllProductsButton.addEventListener("click", viewAllProducts);
    filterButton.style.display = "none"; // Hide filter button initially
  }
}

// Function to view all products
function viewAllProducts() {
  const url = new URL(window.location.href);
  url.searchParams.delete("category");
  window.history.pushState({}, "", url);
  const pageTitleCategory = document.querySelector("#titleProductsPage");
  pageTitleCategory.textContent = "All Products";
  loadProducts();

  // Hide the View All Products button and show the filter button
  const viewAllProductsButton = document.querySelector(
    "#view-all-products-button"
  );
  const filterButton = document.querySelector("#filter-button");
  if (viewAllProductsButton) {
    viewAllProductsButton.style.display = "none";
  }
  if (filterButton) {
    filterButton.style.display = "flex";
  }
}
