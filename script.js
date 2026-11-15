// ===============================
// NAVBAR
// ===============================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        const icon = menuBtn.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }

        menuBtn.setAttribute(
            "aria-label",
            navLinks.classList.contains("active") ? "Close menu" : "Open menu"
        );
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");

            const icon = menuBtn.querySelector("i");

            if (icon) {
                icon.classList.add("fa-bars");
                icon.classList.remove("fa-xmark");
            }

            menuBtn.setAttribute("aria-label", "Open menu");
        });
    });
}


// ===============================
// DARK / LIGHT MODE
// ===============================

const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-theme");
        document.documentElement.setAttribute("data-theme", "dark");

        if (themeBtn) {
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    } else {
        document.body.classList.remove("dark-theme");
        document.documentElement.setAttribute("data-theme", "light");

        if (themeBtn) {
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-theme");
        const newTheme = isDark ? "light" : "dark";

        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    });
}


// ===============================
// HERO BUTTON
// ===============================

const categoryBtn = document.getElementById("categoryBtn");

if (categoryBtn) {
    categoryBtn.addEventListener("click", () => {
        document.getElementById("products")?.scrollIntoView({
            behavior: "smooth"
        });
    });
}


// ===============================
// TESTIMONIAL SLIDER
// ===============================

const testimonialSlider = document.getElementById("testimonialSlider");
const reviewPrev = document.getElementById("reviewPrev");
const reviewNext = document.getElementById("reviewNext");

if (testimonialSlider && reviewPrev && reviewNext) {
    reviewNext.addEventListener("click", () => {
        testimonialSlider.scrollBy({
            left: 320,
            behavior: "smooth"
        });
    });

    reviewPrev.addEventListener("click", () => {
        testimonialSlider.scrollBy({
            left: -320,
            behavior: "smooth"
        });
    });
}


// ===============================
// SHOP EASE PRODUCTS
// ===============================

const productsGrid = document.getElementById("productsGrid");
const productsMessage = document.getElementById("productsMessage");
const categoryFilters = document.getElementById("categoryFilters");

const API_URL = "https://fakestoreapi.com/products";

let allProducts = [];
let selectedCategory = "all";

let cart = JSON.parse(localStorage.getItem("shopeaseCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("shopeaseWishlist")) || [];

const isAllProductsPage =
    document.body.dataset.page === "all-products" ||
    window.location.pathname.endsWith("all-products.html");


// ===============================
// CART ELEMENTS
// ===============================

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const cartCloseBtn = document.getElementById("cartCloseBtn");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartContinueBtn = document.getElementById("cartContinueBtn");


// ===============================
// SAVE CART
// ===============================

function saveCart() {
    localStorage.setItem("shopeaseCart", JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}


// ===============================
// CART BADGE
// ===============================

function updateCartCount() {
    if (!cartCount) return;

    const totalItems = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    cartCount.textContent = totalItems;

    if (totalItems > 0) {
        cartCount.style.display = "flex";
    } else {
        cartCount.style.display = "none";
    }
}


// ===============================
// OPEN CART
// ===============================

function openCart() {
    if (!cartOverlay) return;

    displayCartItems();
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}


// ===============================
// CLOSE CART
// ===============================

function closeCart() {
    if (!cartOverlay) return;

    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
}

if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", closeCart);
}

if (cartContinueBtn) {
    cartContinueBtn.addEventListener("click", closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", (event) => {
        if (event.target === cartOverlay) {
            closeCart();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeCart();
    }
});


// ===============================
// DISPLAY CART PRODUCTS
// ===============================

function displayCartItems() {
    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartTotal.textContent = "$0.00";
        return;
    }

    let total = 0;

    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        return `
            <div class="cart-item">
                <img
                    src="${item.image}"
                    alt="${item.title}"
                    class="cart-item-image"
                >

                <div class="cart-item-info">
                    <h4>${item.title}</h4>

                    <p class="cart-item-price">
                        $${item.price.toFixed(2)}
                    </p>

                    <div class="cart-quantity">
                        <button
                            type="button"
                            data-action="decrease"
                            data-id="${item.id}"
                        >−</button>

                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            data-action="increase"
                            data-id="${item.id}"
                        >+</button>
                    </div>
                </div>

                <button
                    type="button"
                    class="remove-cart-btn"
                    data-action="remove"
                    data-id="${item.id}"
                    aria-label="Remove product"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }).join("");

    cartTotal.textContent = `$${total.toFixed(2)}`;
}


// ===============================
// CART QUANTITY AND REMOVE
// ===============================

if (cartItems) {
    cartItems.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const productId = Number(button.dataset.id);
        const action = button.dataset.action;

        const product = cart.find(item => item.id === productId);

        if (!product) return;

        if (action === "increase") {
            product.quantity++;
        }

        if (action === "decrease") {
            product.quantity--;

            if (product.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
        }

        if (action === "remove") {
            cart = cart.filter(item => item.id !== productId);
        }

        saveCart();
    });
}


// ===============================
// ADD PRODUCT TO CART
// ===============================

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
}


// ===============================
// SAVE WISHLIST
// ===============================

function saveWishlist() {
    localStorage.setItem("shopeaseWishlist", JSON.stringify(wishlist));
}


// ===============================
// CATEGORY FILTERS
// ===============================

function displayCategoryFilters() {
    if (!categoryFilters) return;

    const categories = [
        ...new Set(allProducts.map(product => product.category))
    ];

    categoryFilters.innerHTML = `
        <button
            class="category-filter-btn active"
            data-category="all"
        >
            All
        </button>

        ${categories.map(category => `
            <button
                class="category-filter-btn"
                data-category="${category}"
            >
                ${category}
            </button>
        `).join("")}
    `;
}

if (categoryFilters) {
    categoryFilters.addEventListener("click", (event) => {
        const button = event.target.closest(".category-filter-btn");

        if (!button) return;

        selectedCategory = button.dataset.category;

        categoryFilters.querySelectorAll(".category-filter-btn")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        displayProducts();
    });
}


// ===============================
// GET FILTERED PRODUCTS
// ===============================

function getFilteredProducts() {
    if (selectedCategory === "all") {
        return allProducts;
    }

    return allProducts.filter(product => {
        return product.category === selectedCategory;
    });
}


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts() {
    if (!productsGrid) return;

    const filteredProducts = getFilteredProducts();

    const productsToShow = isAllProductsPage
        ? filteredProducts
        : filteredProducts.slice(0, 3);

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = "";
        productsMessage.textContent = "No products found.";
        return;
    }

    if (productsMessage) {
        productsMessage.textContent = "";
    }

    productsGrid.innerHTML = productsToShow.map(product => {
        const isWishlisted = wishlist.includes(product.id);

        return `
            <article class="product-card">

                <div class="product-visual">

                    <button
                        type="button"
                        class="wishlist-btn ${isWishlisted ? "active" : ""}"
                        data-action="wishlist"
                        data-id="${product.id}"
                        aria-label="Add to wishlist"
                    >
                        <i class="fa-${isWishlisted ? "solid" : "regular"} fa-heart"></i>
                    </button>

                    <img
                        src="${product.image}"
                        alt="${product.title}"
                        class="product-image"
                    >

                </div>

                <div class="product-info">

                    <h3 class="product-name">
                        ${product.title}
                    </h3>

                    <div class="product-bottom">

                        <div>
                            <p class="product-price">
                                $${product.price.toFixed(2)}
                            </p>

                            <p class="product-rating">
                                <i class="fa-solid fa-star"></i>
                                ${product.rating.rate}
                                <span>(${product.rating.count})</span>
                            </p>
                        </div>

                        <button
                            type="button"
                            class="add-cart-btn"
                            data-action="add-cart"
                            data-id="${product.id}"
                        >
                            <i class="fa-solid fa-plus"></i>
                        </button>

                    </div>

                </div>

            </article>
        `;
    }).join("");
}


// ===============================
// PRODUCT BUTTONS
// ===============================

if (productsGrid) {
    productsGrid.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const productId = Number(button.dataset.id);
        const action = button.dataset.action;

        const product = allProducts.find(item => item.id === productId);

        if (!product) return;

        // Add to cart
        if (action === "add-cart") {
            addToCart(product);

            button.classList.add("added");
            button.innerHTML = '<i class="fa-solid fa-check"></i>';

            setTimeout(() => {
                button.classList.remove("added");
                button.innerHTML = '<i class="fa-solid fa-plus"></i>';
            }, 1000);
        }

        // Wishlist
        if (action === "wishlist") {
            if (wishlist.includes(productId)) {
                wishlist = wishlist.filter(id => id !== productId);
            } else {
                wishlist.push(productId);
            }

            saveWishlist();
            displayProducts();
        }
    });
}


// ===============================
// FETCH PRODUCTS FROM API
// ===============================

async function getProducts() {
    if (!productsGrid) return;

    if (productsMessage) {
        productsMessage.textContent = "Loading products...";
    }

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch products");
        }

        allProducts = await response.json();

        if (productsMessage) {
            productsMessage.textContent = "";
        }

        displayCategoryFilters();
        displayProducts();

    } catch (error) {
        if (productsMessage) {
            productsMessage.textContent = "Unable to load products. Please try again.";
        }

        console.error(error);
    }
}


// !  INITIALIZE
updateCartCount();
displayCartItems();
getProducts();