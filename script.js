// ! Navbar Elements

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const themeBtn = document.getElementById("themeBtn");


// ! Mobile Menu

menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
        menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        menuBtn.setAttribute("aria-label", "Close menu");
    } else {
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        menuBtn.setAttribute("aria-label", "Open menu");
    }

});


// ! Close Menu When Link Is Clicked

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.classList.remove("active");

        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        menuBtn.setAttribute("aria-label", "Open menu");

    });

});


// ! Dark Mode

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
}


// ! Theme Toggle

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {

        themeBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';

        localStorage.setItem("theme", "dark");

    } else {

        themeBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';

        localStorage.setItem("theme", "light");

    }

});
// ! Hero Shop Button

const shopNowBtn = document.getElementById("shopNowBtn");

shopNowBtn.addEventListener("click", function () {

    document.getElementById("shop").scrollIntoView({
        behavior: "smooth"
    });

});


// ! Hero Category Button

const categoryBtn = document.getElementById("categoryBtn");

categoryBtn.addEventListener("click", function () {

    document.getElementById("categories").scrollIntoView({
        behavior: "smooth"
    });

});

/* ==============================
   SHOPEASE PRODUCTS
============================== */

(function () {

    const productsGrid = document.getElementById("productsGrid");
    const productsMessage = document.getElementById("productsMessage");
    const viewAllBtn = document.getElementById("viewAllBtn");
    const cartCount = document.getElementById("cartCount");

    const API_URL = "https://fakestoreapi.com/products";

    let allProducts = [];
    let showAllProducts = false;

    // Get saved cart and wishlist

    let cart = JSON.parse(localStorage.getItem("shopeaseCart")) || [];

    let wishlist = JSON.parse(localStorage.getItem("shopeaseWishlist")) || [];

    // Update navbar cart count

    function updateCartCount() {

        if (cartCount) {
            cartCount.textContent = cart.length;
        }

    }

    // Save wishlist

    function saveWishlist() {

        localStorage.setItem(
            "shopeaseWishlist",
            JSON.stringify(wishlist)
        );

    }

    // Save cart

    function saveCart() {

        localStorage.setItem(
            "shopeaseCart",
            JSON.stringify(cart)
        );

        updateCartCount();

    }

    // Load Products From API

    async function getProducts() {

        try {

            productsMessage.textContent = "Loading our favorites...";

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Products could not be loaded.");
            }

            allProducts = await response.json();

            productsMessage.textContent = "";

            displayProducts();

        } catch (error) {

            productsMessage.textContent =
                "Unable to load products. Please try again later.";

            console.error(error);

        }

    }

    // !!!*! Display Products

    function displayProducts() {

        productsGrid.innerHTML = "";

        const productsToShow = showAllProducts
            ? allProducts
            : allProducts.slice(0, 3);

        productsToShow.forEach((product, index) => {

            const isFavorite = wishlist.includes(product.id);

            const isBestSeller = index === 1;

            const card = document.createElement("article");

            card.className = "product-card";

            card.innerHTML = `

                <div class="product-visual">

                    ${isBestSeller ? `
                        <span class="best-seller">
                            Best Seller
                        </span>
                    ` : ""}

                    <button
                        class="wishlist-btn ${isFavorite ? "active" : ""}"
                        data-id="${product.id}"
                        aria-label="Add to wishlist"
                        aria-pressed="${isFavorite}"
                    >
                        ${isFavorite ? "♥" : "♡"}
                    </button>

                    <img
                        src="${product.image}"
                        alt="${product.title}"
                        class="product-image"
                        loading="lazy"
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
                                ★ ${product.rating.rate}
                                (${product.rating.count} reviews)
                            </p>

                        </div>

                    </div>

                    <button
                        class="add-cart-btn"
                        data-id="${product.id}"
                        aria-label="Add ${product.title} to cart"
                    >
                        <svg
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>

                </div>

            `;

            productsGrid.appendChild(card);

        });

        // * Update View All Button

        viewAllBtn.style.display =
            allProducts.length > 3 ? "flex" : "none";

        viewAllBtn.querySelector("span:first-child").textContent =
            showAllProducts ? "Show Less Products" : "View All Products";

        viewAllBtn.querySelector(".view-arrow").textContent =
            showAllProducts ? "↑" : "→";

    }

    // !!!!!!! Wishlist and Add to Cart Events

    productsGrid.addEventListener("click", function (event) {

        // * Wishlist Button

        const wishlistBtn = event.target.closest(".wishlist-btn");

        if (wishlistBtn) {

            const productId = Number(wishlistBtn.dataset.id);

            if (wishlist.includes(productId)) {

                wishlist = wishlist.filter(id => id !== productId);

            } else {

                wishlist.push(productId);

            }

            saveWishlist();

            displayProducts();

        }

        // ! Add to Cart Button

        const cartBtn = event.target.closest(".add-cart-btn");

        if (cartBtn) {

            const productId = Number(cartBtn.dataset.id);

            const selectedProduct = allProducts.find(
                product => product.id === productId
            );

            if (selectedProduct) {

                cart.push({
                    id: selectedProduct.id,
                    title: selectedProduct.title,
                    price: selectedProduct.price,
                    image: selectedProduct.image,
                    quantity: 1
                });

                saveCart();

                cartBtn.classList.add("added");

                cartBtn.innerHTML = "✓";

                setTimeout(() => {

                    cartBtn.classList.remove("added");

                    cartBtn.innerHTML = `
                        <svg
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    `;

                }, 1000);

                // Notify other cart scripts

                window.dispatchEvent(
                    new CustomEvent("shopease:add-to-cart", {
                        detail: selectedProduct
                    })
                );

            }

        }

    });

    // ** View All Products Button

    viewAllBtn.addEventListener("click", function () {

        showAllProducts = !showAllProducts;

        displayProducts();

    });

    // Initial Functions

    updateCartCount();

    getProducts();

})();
