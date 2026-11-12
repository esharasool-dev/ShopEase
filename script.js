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
    document.documentElement.setAttribute("data-theme", "dark");
    themeBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
} else {
    document.documentElement.setAttribute("data-theme", "light");
}

// ! Theme Toggle

themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        themeBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }
});

// ! Hero Category Button

const categoryBtn = document.getElementById("categoryBtn");

categoryBtn.addEventListener("click", function () {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
});

// ! Testimonials Slider

const testimonialSlider = document.getElementById("testimonialSlider");
const reviewPrev = document.getElementById("reviewPrev");
const reviewNext = document.getElementById("reviewNext");

function moveReviews(direction) {
    const reviewCard = testimonialSlider.querySelector(".testimonial-card");

    if (reviewCard) {
        const cardWidth = reviewCard.offsetWidth + 20;

        testimonialSlider.scrollBy({
            left: direction * cardWidth,
            behavior: "smooth"
        });
    }
}

reviewPrev.addEventListener("click", function () {
    moveReviews(-1);
});

reviewNext.addEventListener("click", function () {
    moveReviews(1);
});

/* ==============================
   SHOPEASE PRODUCTS
============================== */

(function () {
    const productsGrid = document.getElementById("productsGrid");
    const productsMessage = document.getElementById("productsMessage");
    const viewAllBtn = document.getElementById("viewAllBtn");
    const categoryFilters = document.getElementById("categoryFilters");
    const cartCount = document.getElementById("cartCount");

    const API_URL = "https://fakestoreapi.com/products";

    let allProducts = [];
    let showAllProducts = false;
    let selectedCategory = "all";

    // ! Get saved cart and wishlist

    let cart = JSON.parse(localStorage.getItem("shopeaseCart")) || [];
    let wishlist = JSON.parse(localStorage.getItem("shopeaseWishlist")) || [];

    // ! Update navbar cart count

    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cart.reduce(function (total, item) {
                return total + (item.quantity || 1);
            }, 0);
        }
    }

    // ! Save wishlist

    function saveWishlist() {
        localStorage.setItem("shopeaseWishlist", JSON.stringify(wishlist));
    }

    // ! Save cart

    function saveCart() {
        localStorage.setItem("shopeaseCart", JSON.stringify(cart));
        updateCartCount();
    }

    // ! Get products of the selected category

    function getFilteredProducts() {
        if (selectedCategory === "all") {
            return allProducts;
        }

        return allProducts.filter(function (product) {
            return product.category === selectedCategory;
        });
    }

    // ! Create category filter buttons from API categories

    function displayCategoryFilters() {
        const categories = [];

        allProducts.forEach(function (product) {
            if (!categories.includes(product.category)) {
                categories.push(product.category);
            }
        });

        categoryFilters.innerHTML = "";

        const allButton = document.createElement("button");
        allButton.type = "button";
        allButton.className = "category-filter-btn active";
        allButton.dataset.category = "all";
        allButton.textContent = "All";
        categoryFilters.appendChild(allButton);

        categories.forEach(function (category) {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "category-filter-btn";
            button.dataset.category = category;

            button.textContent = category
                .split(" ")
                .map(function (word) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                })
                .join(" ");

            categoryFilters.appendChild(button);
        });
    }

    // ! Load Products From API

    async function getProducts() {
        try {
            productsMessage.textContent = "Loading our favorites...";

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Products could not be loaded.");
            }

            allProducts = await response.json();

            displayCategoryFilters();
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

        const filteredProducts = getFilteredProducts();

        const productsToShow = showAllProducts
            ? filteredProducts
            : filteredProducts.slice(0, 3);

        if (filteredProducts.length === 0) {
            productsMessage.textContent = "No products found in this category.";
        } else {
            productsMessage.textContent = "";
        }

        productsToShow.forEach(function (product, index) {
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
                        type="button"
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
                        type="button"
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
            filteredProducts.length > 3 ? "flex" : "none";

        viewAllBtn.querySelector("span:first-child").textContent =
            showAllProducts ? "Show Less Products" : "View All Products";

        viewAllBtn.querySelector(".view-arrow").textContent =
            showAllProducts ? "↑" : "→";
    }

    // ! Category Filter Button Click

    categoryFilters.addEventListener("click", function (event) {
        const filterButton = event.target.closest(".category-filter-btn");

        if (!filterButton) {
            return;
        }

        selectedCategory = filterButton.dataset.category;
        showAllProducts = false;

        const allFilterButtons = categoryFilters.querySelectorAll(".category-filter-btn");

        allFilterButtons.forEach(function (button) {
            button.classList.remove("active");
        });

        filterButton.classList.add("active");

        displayProducts();
    });

    // ! Wishlist and Add to Cart Events

    productsGrid.addEventListener("click", function (event) {
        // * Wishlist Button

        const wishlistBtn = event.target.closest(".wishlist-btn");

        if (wishlistBtn) {
            const productId = Number(wishlistBtn.dataset.id);

            if (wishlist.includes(productId)) {
                wishlist = wishlist.filter(function (id) {
                    return id !== productId;
                });
            } else {
                wishlist.push(productId);
            }

            saveWishlist();
            displayProducts();
            return;
        }

        // ! Add to Cart Button

        const cartBtn = event.target.closest(".add-cart-btn");

        if (cartBtn) {
            const productId = Number(cartBtn.dataset.id);

            const selectedProduct = allProducts.find(function (product) {
                return product.id === productId;
            });

            if (selectedProduct) {
                const existingCartItem = cart.find(function (item) {
                    return item.id === productId;
                });

                if (existingCartItem) {
                    existingCartItem.quantity += 1;
                } else {
                    cart.push({
                        id: selectedProduct.id,
                        title: selectedProduct.title,
                        price: selectedProduct.price,
                        image: selectedProduct.image,
                        quantity: 1
                    });
                }

                saveCart();

                cartBtn.classList.add("added");
                cartBtn.innerHTML = "✓";

                setTimeout(function () {
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

                // ! Notify other cart scripts

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

    // ! Initial Functions

    updateCartCount();
    getProducts();
})();


