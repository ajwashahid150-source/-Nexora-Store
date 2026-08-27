/* ==========================================================================
   NEXORA STOREFRONT - MAIN APPLICATION LOGIC
   ========================================================================== */

// --- FALLBACK MOCK DATA ---
// Provided to guarantee 100% reliability if the external API is offline or rate-limited.
const MOCK_PRODUCTS = [
    {
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday essentials in the zippered front pocket, and adjust the ergonomic straps for all-day comfort.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        rating: { rate: 3.9, count: 120 }
    },
    {
        id: 2,
        title: "Mens Casual Premium Slim Fit T-Shirts",
        price: 22.3,
        description: "Slim-fit t-shirt crafted from breathable cotton-blend fabric. Double-needle stitched neck and hems for extra durability. Perfect as a standalone summer top or layered under jackets.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        rating: { rate: 4.1, count: 259 }
    },
    {
        id: 3,
        title: "John Hardy Men's Legends Naga Gold & Silver Bracelet",
        price: 695.0,
        description: "From the Legends Collection, the Naga Dragon represents protection and prosperity. Handcrafted in Bali from sterling silver and 18-karat yellow gold accents, this woven chain bracelet is an artistic statement.",
        category: "jewelery",
        image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        rating: { rate: 4.6, count: 400 }
    },
    {
        id: 4,
        title: "Solid Gold Petite Micropave Ring",
        price: 168.0,
        description: "Elegant and dainty solid 14k yellow gold band set with shimmering micropave diamonds. Its timeless silhouette makes it beautiful alone or stacked with other rings.",
        category: "jewelery",
        image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
        rating: { rate: 3.9, count: 70 }
    },
    {
        id: 5,
        title: "WD 2TB Elements Portable External Hard Drive",
        price: 64.0,
        description: "USB 3.0 and USB 2.0 compatibility for high-speed file transfers. High capacity storage in a compact, matte-black case. formatted NTFS for Windows, reformatable for Mac OS.",
        category: "electronics",
        image: "https://fakestoreapi.com/img/61IBJVmL-AL._AC_SY879_.jpg",
        rating: { rate: 4.7, count: 500 }
    },
    {
        id: 6,
        title: "SanDisk SSD PLUS 1TB Internal SSD",
        price: 109.0,
        description: "Upgrade your laptop or desktop with fast read/write speeds of up to 535MB/s. Boosts boot-up, shutdown, and application loading response times for a more efficient working day.",
        category: "electronics",
        image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
        rating: { rate: 4.8, count: 320 }
    },
    {
        id: 7,
        title: "Silicon Power 256GB SSD 3D NAND",
        price: 29.99,
        description: "High-performance SATA III internal solid state drive. 3D NAND flash technology improves reliability, power efficiency, and endurance. Ideal for budget PC builds.",
        category: "electronics",
        image: "https://fakestoreapi.com/img/71kWymZ+cYL._AC_SX679_.jpg",
        rating: { rate: 4.8, count: 320 }
    },
    {
        id: 8,
        title: "Rainy Day Insulated Women's Windbreaker Jacket",
        price: 39.99,
        description: "Lightweight, packable women's raincoat designed to withstand wind and light showers. Features adjustable toggle hood, zippered pockets, and elastic cuffs for a secure fit.",
        category: "women's clothing",
        image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
        rating: { rate: 3.8, count: 679 }
    }
];

// --- APPLICATION STATE ---
const state = {
    products: [],
    categories: [],
    cart: [],
    searchQuery: '',
    selectedCategory: 'All',
    isLoading: false,
    error: null,
    apiSimulatedFailure: false // Toggle to simulate API errors for testing
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    setupGlobalEvents();
    // Start routing
    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);
    // Initial data fetch
    fetchProducts();
});

// --- STATE ACTIONS ---

// Fetch products from API with Error Handling & Fallback
async function fetchProducts(force = false) {
    if (state.products.length > 0 && !force) return;

    state.isLoading = true;
    state.error = null;
    renderCurrentRoute(); // Trigger render to show loading skeleton

    try {
        // Allow simulated failure for review/testing
        if (state.apiSimulatedFailure) {
            throw new Error("Simulated network connection failure");
        }

        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error(`Server returned code: ${response.status}`);
        }
        const data = await response.json();
        
        // Success
        state.products = data;
        const derived = new Set(data.map(p => p.category));
        state.categories = ['All', ...derived];
    } catch (err) {
        console.warn("API request failed. Falling back to local cache catalog.", err);
        state.error = "Unable to connect to Server. Would you like to retry or load the offline catalog?";
    } finally {
        state.isLoading = false;
        renderCurrentRoute();
    }
}

// Load Mock Offline Catalog
function loadOfflineCatalog() {
    state.products = MOCK_PRODUCTS;
    const derived = new Set(MOCK_PRODUCTS.map(p => p.category));
    state.categories = ['All', ...derived];
    state.error = null;
    state.isLoading = false;
    showToast("Loaded offline catalog data successfully!", "info");
    router();
}

// Cart Management
function initCart() {
    const stored = localStorage.getItem('nexora_cart');
    if (stored) {
        try {
            state.cart = JSON.parse(stored);
        } catch (e) {
            state.cart = [];
            localStorage.setItem('nexora_cart', JSON.stringify([]));
        }
    } else {
        state.cart = [];
    }
    updateCartBadge();
}

function saveCart() {
    localStorage.setItem('nexora_cart', JSON.stringify(state.cart));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalQty;
        // Animation pop on change
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 150);
    }
}

function addToCart(productId, quantity = 1, silent = false) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        state.cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: quantity,
            image: product.image,
            category: product.category
        });
    }

    saveCart();
    if (!silent) {
        showToast(`Added "${product.title.substring(0, 20)}..." to your cart.`, "success");
    }
    renderCurrentRoute();
}

function updateItemQuantity(productId, amount) {
    const item = state.cart.find(item => item.id === productId);
    if (!item) return;

    const newQty = item.quantity + amount;
    if (newQty < 1) {
        removeFromCart(productId);
    } else {
        item.quantity = newQty;
        saveCart();
        showToast("Cart updated successfully.", "info");
        renderCurrentRoute();
    }
}

function removeFromCart(productId, silent = false) {
    const index = state.cart.findIndex(item => item.id === productId);
    if (index === -1) return;

    const title = state.cart[index].title;
    state.cart.splice(index, 1);
    saveCart();
    
    if (!silent) {
        showToast(`Removed "${title.substring(0, 20)}..." from your cart.`, "error");
    }
    renderCurrentRoute();
}

function clearCart(silent = false) {
    state.cart = [];
    saveCart();
    if (!silent) {
        showToast("Your shopping cart has been cleared.", "error");
    }
    renderCurrentRoute();
}

// --- CLIENT SIDE ROUTER ---
function router() {
    const hash = window.location.hash || '#home';
    const appContainer = document.getElementById('app-container');
    
    // Close mobile nav menu
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) navMenu.classList.remove('open');

    // Parse path parameters and search query params
    // format expected: #home, #product/3, #home?category=electronics
    let routePath = hash;
    let queryParams = {};

    if (hash.includes('?')) {
        const parts = hash.split('?');
        routePath = parts[0];
        const params = new URLSearchParams(parts[1]);
        for (const [key, val] of params.entries()) {
            queryParams[key] = val;
        }
    }

    // Scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Global navigation states
    updateActiveNavLink(routePath);

    // Dynamic routing resolver
    if (routePath === '#home' || routePath === '#products' || routePath === '') {
        if (queryParams.category) {
            state.selectedCategory = decodeURIComponent(queryParams.category);
        }
        renderHome(appContainer);
    } else if (routePath.startsWith('#product/')) {
        const id = parseInt(routePath.replace('#product/', ''), 10);
        renderProductDetail(appContainer, id);
    } else if (routePath === '#cart') {
        renderCart(appContainer);
    } else if (routePath === '#checkout') {
        renderCheckout(appContainer);
    } else if (routePath === '#success') {
        renderSuccess(appContainer);
    } else {
        // Fallback View
        appContainer.innerHTML = '';
        appContainer.appendChild(createEmptyState("Page Not Found", "The link you followed may be broken or the view doesn't exist.", "Return to Shop", "#home"));
    }
}

// Force redraw current active screen (e.g. state changes)
function renderCurrentRoute() {
    router();
}

function updateActiveNavLink(currentRoute) {
    const links = {
        '#home': document.getElementById('nav-link-home'),
        '#products': document.getElementById('nav-link-products'),
    };
    
    // Reset all links
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    
    if (currentRoute === '#home' || currentRoute === '' || currentRoute === '#products') {
        if (links['#home']) links['#home'].classList.add('active');
        if (links['#products']) links['#products'].classList.add('active');
    }
}

function setupGlobalEvents() {
    // Mobile hamburger menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    // Navbar logo resets homepage filters
    const logo = document.getElementById('nav-logo');
    if (logo) {
        logo.addEventListener('click', () => {
            state.selectedCategory = 'All';
            state.searchQuery = '';
        });
    }

    // Attach footer category triggers
    document.querySelectorAll('.footer-cat-link').forEach(el => {
        el.addEventListener('click', (e) => {
            const cat = e.currentTarget.getAttribute('data-category');
            if (cat) {
                state.selectedCategory = cat;
                state.searchQuery = '';
            }
        });
    });
}

// --- VIEW RENDERING ENGINE ---

// HOME VIEW
function renderHome(container) {
    container.innerHTML = '';

    // Show loading skeleton grid if downloading products
    if (state.isLoading) {
        container.appendChild(createLoadingState());
        return;
    }

    // Show error component if fetch failed
    if (state.error) {
        container.appendChild(createErrorState(state.error, () => {
            state.apiSimulatedFailure = false;
            fetchProducts(true);
        }));
        return;
    }

    // 1. Hero Banner Component (Only shown when not searching/filtering)
    const isFiltered = state.selectedCategory !== 'All' || state.searchQuery.trim() !== '';
    if (!isFiltered) {
        container.appendChild(createHeroSection());
        container.appendChild(createBenefitsSection());
    }

    // 2. Product Explorer Section
    const explorer = document.createElement('section');
    explorer.className = 'explorer-section container';

    // Explorer Header
    const expHeader = document.createElement('div');
    expHeader.className = 'explorer-header';
    const heading = document.createElement('h2');
    heading.className = 'section-title';
    heading.textContent = isFiltered ? "Filtered Results" : "Explore Our Products";
    expHeader.appendChild(heading);
    explorer.appendChild(expHeader);

    // Filter controls: search, categories
    const controls = document.createElement('div');
    controls.className = 'explorer-controls';
    
    // Search
    const searchDiv = document.createElement('div');
    searchDiv.className = 'search-container';
    searchDiv.innerHTML = `
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" class="search-input" id="search-input" placeholder="Search by name, category, or description..." value="${state.searchQuery}">
    `;
    
    if (state.searchQuery) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'search-clear-btn';
        clearBtn.ariaLabel = "Clear search";
        clearBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        clearBtn.addEventListener('click', () => {
            state.searchQuery = '';
            renderCurrentRoute();
        });
        searchDiv.appendChild(clearBtn);
    }
    
    const searchInput = searchDiv.querySelector('#search-input');
    // Implement input search
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        // Local dynamic updates on filtering
        debouncedFilterProducts();
    });
    
    controls.appendChild(searchDiv);

    // Categories Pill list
    const catsWrapper = document.createElement('div');
    catsWrapper.className = 'categories-wrapper';
    
    state.categories.forEach(cat => {
        const isActive = state.selectedCategory.toLowerCase() === cat.toLowerCase();
        const pill = createCategoryFilter(cat, isActive);
        pill.addEventListener('click', () => {
            state.selectedCategory = cat;
            window.location.hash = `#home?category=${encodeURIComponent(cat)}`;
        });
        catsWrapper.appendChild(pill);
    });
    
    controls.appendChild(catsWrapper);
    explorer.appendChild(controls);

    // Dynamic Filter
    const filtered = getFilteredProducts();

    // Product items count
    const countBar = document.createElement('div');
    countBar.className = 'product-count-bar';
    countBar.textContent = `Showing ${filtered.length} products`;
    explorer.appendChild(countBar);

    // Product Grid
    if (filtered.length === 0) {
        explorer.appendChild(createEmptyState("No Products Found", "We couldn't find any products matching your current query or category filter. Try refining your keywords.", "View All Products", "#home"));
    } else {
        const grid = document.createElement('div');
        grid.className = 'product-grid';
        
        filtered.forEach(prod => {
            grid.appendChild(createProductCard(prod));
        });
        
        explorer.appendChild(grid);
    }

    container.appendChild(explorer);
}

// Debounce helper for typing search
let searchTimeout;
function debouncedFilterProducts() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        // Instead of redrawing the entire home which resets input cursor, we can update the grid content
        const grid = document.querySelector('.product-grid');
        const countBar = document.querySelector('.product-count-bar');
        const filtered = getFilteredProducts();
        
        if (countBar) countBar.textContent = `Showing ${filtered.length} products`;

        if (grid) {
            grid.innerHTML = '';
            if (filtered.length === 0) {
                // If grid goes empty, redraw home fully to show empty state card
                renderCurrentRoute();
            } else {
                filtered.forEach(prod => {
                    grid.appendChild(createProductCard(prod));
                });
            }
        } else {
            // Fallback render fully
            renderCurrentRoute();
        }
    }, 150);
}

function getFilteredProducts() {
    return state.products.filter(product => {
        const matchesCategory = state.selectedCategory === 'All' || 
            product.category.toLowerCase() === state.selectedCategory.toLowerCase();
        
        const matchesSearch = product.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(state.searchQuery.toLowerCase());
            
        return matchesCategory && matchesSearch;
    });
}

// PRODUCT DETAIL VIEW
function renderProductDetail(container, id) {
    container.innerHTML = '';

    const product = state.products.find(p => p.id === id);
    
    if (state.isLoading) {
        container.appendChild(createLoadingState());
        return;
    }

    if (!product) {
        container.appendChild(createEmptyState(
            "Product Not Found",
            "This product might have been discontinued or database connection is resolving.",
            "Go back to Home",
            "#home"
        ));
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'detail-container container';

    // Back Link
    const backBtn = document.createElement('a');
    backBtn.href = "#home";
    backBtn.className = 'detail-back-btn';
    backBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Products
    `;
    wrapper.appendChild(backBtn);

    // Detail Panel Grid
    const detailGrid = document.createElement('div');
    detailGrid.className = 'detail-grid';

    // Left Column: Image wrapper
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'detail-image-wrapper';
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.title;
    img.className = 'detail-image';
    imgWrapper.appendChild(img);
    detailGrid.appendChild(imgWrapper);

    // Right Column: Detail Content
    const content = document.createElement('div');
    content.className = 'detail-content';

    const categoryBadge = document.createElement('div');
    categoryBadge.className = 'detail-category';
    categoryBadge.textContent = product.category;
    content.appendChild(categoryBadge);

    const title = document.createElement('h1');
    title.className = 'detail-title';
    title.textContent = product.title;
    content.appendChild(title);

    // Rating
    if (product.rating) {
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'detail-rating';
        ratingDiv.innerHTML = `
            <div class="star-rating">
                ${generateStarsHTML(product.rating.rate)}
            </div>
            <span class="rating-value">${product.rating.rate}</span>
            <span class="rating-count">(${product.rating.count} ratings)</span>
        `;
        content.appendChild(ratingDiv);
    }

    const price = document.createElement('div');
    price.className = 'detail-price';
    price.textContent = `$${product.price.toFixed(2)}`;
    content.appendChild(price);

    const description = document.createElement('p');
    description.className = 'detail-desc';
    description.textContent = product.description;
    content.appendChild(description);

    // Quantity Picker & Add Panel
    const actionPanel = document.createElement('div');
    actionPanel.className = 'detail-actions-panel';

    let selectedQty = 1;

    const qtyDiv = document.createElement('div');
    qtyDiv.className = 'qty-selector';
    qtyDiv.innerHTML = `
        <span class="qty-label">Quantity:</span>
        <div class="qty-controls">
            <button class="btn-qty btn-minus">-</button>
            <span class="qty-val">1</span>
            <button class="btn-qty btn-plus">+</button>
        </div>
    `;

    const qtyVal = qtyDiv.querySelector('.qty-val');
    qtyDiv.querySelector('.btn-minus').addEventListener('click', () => {
        if (selectedQty > 1) {
            selectedQty--;
            qtyVal.textContent = selectedQty;
        }
    });
    qtyDiv.querySelector('.btn-plus').addEventListener('click', () => {
        selectedQty++;
        qtyVal.textContent = selectedQty;
    });

    actionPanel.appendChild(qtyDiv);

    // Add to Cart Action
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-detail-add';
    addBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
        </svg>
        Add to Shopping Cart
    `;
    addBtn.addEventListener('click', () => {
        addToCart(product.id, selectedQty);
        selectedQty = 1; // reset quantity indicator
        qtyVal.textContent = 1;
    });

    actionPanel.appendChild(addBtn);
    content.appendChild(actionPanel);

    detailGrid.appendChild(content);
    wrapper.appendChild(detailGrid);
    container.appendChild(wrapper);
}

// SHOPPING CART VIEW
function renderCart(container) {
    container.innerHTML = '';

    const section = document.createElement('section');
    section.className = 'cart-section container';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'cart-header';
    const title = document.createElement('h1');
    title.className = 'section-title';
    title.textContent = "Shopping Cart";
    titleDiv.appendChild(title);
    section.appendChild(titleDiv);

    if (state.cart.length === 0) {
        section.appendChild(createEmptyState("Your Cart is Empty", "You haven't added any products to your storefront bag yet.", "Discover Products", "#home"));
        container.appendChild(section);
        return;
    }

    const layout = document.createElement('div');
    layout.className = 'cart-layout';

    // Left Panel: Items Table
    const itemsPanel = document.createElement('div');
    itemsPanel.className = 'cart-items-container';
    
    // Header labels
    itemsPanel.innerHTML = `
        <div class="cart-table-header">
            <span>Product Detail</span>
            <span>Price</span>
            <span>Quantity</span>
            <span style="text-align: right">Total</span>
        </div>
    `;

    const list = document.createElement('div');
    list.className = 'cart-items-list';

    state.cart.forEach(item => {
        list.appendChild(createCartItem(item));
    });
    
    itemsPanel.appendChild(list);

    // Cart Footer controls (Clear Cart, Continue shopping)
    const cartFooter = document.createElement('div');
    cartFooter.className = 'cart-controls-footer';
    
    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = "Clear Cart";
    clearBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to remove all items from your cart?")) {
            clearCart();
        }
    });

    const contShopping = document.createElement('a');
    contShopping.href = "#home";
    contShopping.className = 'btn-secondary';
    contShopping.textContent = "Continue Shopping";

    cartFooter.appendChild(clearBtn);
    cartFooter.appendChild(contShopping);
    itemsPanel.appendChild(cartFooter);
    layout.appendChild(itemsPanel);

    // Right Panel: Order summary card
    const summaryCard = document.createElement('div');
    summaryCard.className = 'cart-summary-card';

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    summaryCard.innerHTML = `
        <h3 class="summary-title">Order Summary</h3>
        <div class="summary-row">
            <span>Total Items:</span>
            <span>${count}</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span style="color: var(--color-success); font-weight: 600">FREE</span>
        </div>
        <div class="summary-row">
            <span>Sales Tax (8%):</span>
            <span>$${(subtotal * 0.08).toFixed(2)}</span>
        </div>
        <div class="summary-row-total">
            <span>Grand Total:</span>
            <span>$${(subtotal * 1.08).toFixed(2)}</span>
        </div>
    `;

    const checkoutBtn = document.createElement('a');
    checkoutBtn.href = "#checkout";
    checkoutBtn.className = 'btn-primary btn-checkout';
    checkoutBtn.textContent = "Proceed to Checkout";
    summaryCard.appendChild(checkoutBtn);

    layout.appendChild(summaryCard);
    section.appendChild(layout);
    container.appendChild(section);
}

// CHECKOUT VIEW
function renderCheckout(container) {
    container.innerHTML = '';

    if (state.cart.length === 0) {
        container.appendChild(createEmptyState("No Items to Checkout", "Your shopping cart is currently empty.", "Return to Shop", "#home"));
        return;
    }

    const wrapper = document.createElement('section');
    wrapper.className = 'checkout-section container';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'cart-header';
    const title = document.createElement('h1');
    title.className = 'section-title';
    title.textContent = "Checkout Summary";
    titleDiv.appendChild(title);
    wrapper.appendChild(titleDiv);

    const grid = document.createElement('div');
    grid.className = 'checkout-grid';

    // Left Column: Customer Form
    const formCard = document.createElement('div');
    formCard.className = 'checkout-card';
    formCard.innerHTML = `
        <h3 class="checkout-section-title">Shipping & Billing Information</h3>
        <form id="checkout-form" novalidate>
            <div class="form-group" id="group-name">
                <label for="input-name" class="form-label">Full Name</label>
                <input type="text" id="input-name" class="form-input" placeholder="John Doe">
                <span class="error-message">Please enter your full name (minimum 3 characters)</span>
            </div>
            <div class="form-group" id="group-email">
                <label for="input-email" class="form-label">Email Address</label>
                <input type="email" id="input-email" class="form-input" placeholder="johndoe@example.com">
                <span class="error-message">Please enter a valid email address</span>
            </div>
            <div class="form-group" id="group-address">
                <label for="input-address" class="form-label">Delivery Address</label>
                <textarea id="input-address" class="form-input" rows="4" placeholder="123 Main Street, Apt 4B, City, Country"></textarea>
                <span class="error-message">Please enter a valid shipping destination (minimum 10 characters)</span>
            </div>
            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 15px;">Place Order (Simulated)</button>
        </form>
    `;

    // Process Form Submit
    const form = formCard.querySelector('#checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameVal = form.querySelector('#input-name').value.trim();
        const emailVal = form.querySelector('#input-email').value.trim();
        const addressVal = form.querySelector('#input-address').value.trim();

        let isValid = true;

        // Name Validation
        if (nameVal.length < 3) {
            form.querySelector('#group-name').classList.add('error');
            isValid = false;
        } else {
            form.querySelector('#group-name').classList.remove('error');
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            form.querySelector('#group-email').classList.add('error');
            isValid = false;
        } else {
            form.querySelector('#group-email').classList.remove('error');
        }

        // Address Validation
        if (addressVal.length < 10) {
            form.querySelector('#group-address').classList.add('error');
            isValid = false;
        } else {
            form.querySelector('#group-address').classList.remove('error');
        }

        if (isValid) {
            // Generate confirmation state details
            const orderId = "NEX-" + Math.floor(Math.random() * 900000 + 100000);
            
            // Temporarily store checkout payload for success display
            state.lastCheckout = {
                orderId: orderId,
                name: nameVal,
                email: emailVal,
                address: addressVal,
                items: [...state.cart],
                subtotal: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };

            // Clear Cart and route
            clearCart(true); // silent
            showToast("Order placed successfully! Redirecting...", "success");
            window.location.hash = "#success";
        }
    });

    grid.appendChild(formCard);

    // Right Column: Dynamic Cart Summary Card
    const summaryCard = document.createElement('div');
    summaryCard.className = 'cart-summary-card';

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    let itemsHTML = '';
    state.cart.forEach(item => {
        itemsHTML += `
            <div class="summary-item-row">
                <div>
                    <span class="summary-item-name">${item.title}</span>
                    <span class="summary-item-qty">x${item.quantity}</span>
                </div>
                <span class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });

    summaryCard.innerHTML = `
        <h3 class="summary-title">Your Order Summary</h3>
        <div class="summary-items-list">
            ${itemsHTML}
        </div>
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span style="color: var(--color-success); font-weight: 600">FREE</span>
        </div>
        <div class="summary-row">
            <span>Sales Tax (8%):</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row-total">
            <span>Total Amount:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
        <a href="#cart" class="btn-secondary btn-continue-shop">Back to Edit Cart</a>
    `;

    grid.appendChild(summaryCard);
    wrapper.appendChild(grid);
    container.appendChild(wrapper);
}

// SUCCESS / ORDER CONFIRMATION VIEW
function renderSuccess(container) {
    container.innerHTML = '';

    const data = state.lastCheckout;

    if (!data) {
        // Redirect to homepage if reached manually without placing order
        window.location.hash = "#home";
        return;
    }

    const card = document.createElement('div');
    card.className = 'success-card container';

    card.innerHTML = `
        <div class="success-icon-wrapper">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <h1 class="success-title">Thank You, ${data.name}!</h1>
        <p class="success-msg">Your transaction was successful. We've emailed your invoice and shipping tracking details to <strong>${data.email}</strong>.</p>
        
        <div class="order-details-box">
            <h4 class="details-title">Order Confirmation Details</h4>
            <div class="details-row">
                <span class="details-label">Order Identifier:</span>
                <span class="details-val" style="color: var(--color-primary); font-family: monospace;">${data.orderId}</span>
            </div>
            <div class="details-row">
                <span class="details-label">Destination Address:</span>
                <span class="details-val">${data.address}</span>
            </div>
            <div class="details-row">
                <span class="details-label">Subtotal:</span>
                <span class="details-val">$${data.subtotal.toFixed(2)}</span>
            </div>
            <div class="details-row">
                <span class="details-label">Sales Tax (8%):</span>
                <span class="details-val">$${(data.subtotal * 0.08).toFixed(2)}</span>
            </div>
            <div class="details-row" style="margin-top: 10px; border-top: 1px dashed var(--color-border); padding-top: 10px;">
                <span class="details-label" style="font-weight: 700;">Grand Total Charged:</span>
                <span class="details-val" style="font-size: 16px; font-weight: 800;">$${(data.subtotal * 1.08).toFixed(2)}</span>
            </div>
        </div>

        <a href="#home" class="btn-primary" id="btn-success-reset">Continue Shopping & Discover More</a>
    `;

    card.querySelector('#btn-success-reset').addEventListener('click', () => {
        // Flush lastCheckout payload and redirect home
        state.lastCheckout = null;
    });

    container.appendChild(card);
}


// --- REUSABLE UI ELEMENTS (COMPONENTS) ---

// 1. Product Card Component
function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card animate-fade-in';
    
    card.innerHTML = `
        <span class="product-card-badge">${product.category}</span>
        <div class="product-card-img-wrapper">
            <img src="${product.image}" alt="${product.title}" class="product-card-img" loading="lazy">
        </div>
        <div class="product-card-body">
            <h3 class="product-card-title">${product.title}</h3>
            
            <div class="product-card-rating">
                <div class="star-rating">
                    ${generateStarsHTML(product.rating ? product.rating.rate : 4.0)}
                </div>
                <span class="rating-value">${product.rating ? product.rating.rate : '4.0'}</span>
                <span class="rating-count">(${product.rating ? product.rating.count : '50'})</span>
            </div>
            
            <div class="product-card-footer">
                <span class="product-card-price">$${product.price.toFixed(2)}</span>
                
                <div class="product-card-actions">
                    <a href="#product/${product.id}" class="btn-card-icon btn-view-details" aria-label="View Product Details">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </a>
                    <button class="btn-card-add" aria-label="Add product to cart">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add
                    </button>
                </div>
            </div>
        </div>
    `;

    // Click handler for add to cart button
    card.querySelector('.btn-card-add').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id, 1);
    });

    return card;
}

// Helper to generate star SVG HTML based on numerical rating
function generateStarsHTML(rate) {
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let html = '';
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        html += `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }
    // Half star
    if (halfStar) {
        html += `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#halfGrad)"></polygon><defs><linearGradient id="halfGrad"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs></svg>`;
    }
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }
    return html;
}

// 2. Category Filter pill Component
function createCategoryFilter(category, isActive) {
    const pill = document.createElement('button');
    pill.className = `category-pill ${isActive ? 'active' : ''}`;
    pill.textContent = category;
    pill.setAttribute('aria-pressed', isActive);
    return pill;
}

// 3. Cart Table Item Component
function createCartItem(item) {
    const row = document.createElement('div');
    row.className = 'cart-item';

    row.innerHTML = `
        <div class="cart-item-prod">
            <div class="cart-item-img-wrapper">
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            </div>
            <div class="cart-item-info">
                <a href="#product/${item.id}" class="cart-item-title">${item.title}</a>
                <span class="cart-item-category">${item.category}</span>
            </div>
        </div>
        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
        <div class="qty-controls" style="max-width: 120px;">
            <button class="btn-qty btn-minus" aria-label="Decrease quantity">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="btn-qty btn-plus" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-item-total">
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="btn-remove-item" aria-label="Delete item from cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></line>
                </svg>
            </button>
        </div>
    `;

    // Hook listeners
    row.querySelector('.btn-minus').addEventListener('click', () => updateItemQuantity(item.id, -1));
    row.querySelector('.btn-plus').addEventListener('click', () => updateItemQuantity(item.id, 1));
    row.querySelector('.btn-remove-item').addEventListener('click', () => removeFromCart(item.id));

    return row;
}

// 4. Toast Notifications System Component
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Choose icon
    let icon = '';
    if (type === 'success') {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-content">${message}</div>
    `;

    container.appendChild(toast);

    // Fade-in trigger
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto fade-out & remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// 5. Empty State Card Component
function createEmptyState(title, message, ctaText, ctaHash) {
    const div = document.createElement('div');
    div.className = 'state-container container animate-fade-in';
    
    div.innerHTML = `
        <div class="state-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
        </div>
        <h3 class="state-title">${title}</h3>
        <p class="state-desc">${message}</p>
        <a href="${ctaHash}" class="btn-primary">${ctaText}</a>
    `;
    
    return div;
}

// 6. Loading State (Skeleton Grid) Component
function createLoadingState() {
    const div = document.createElement('div');
    div.className = 'container';
    div.style.padding = '40px 0';
    
    const count = 4;
    let cardsHTML = '';
    for (let i = 0; i < count; i++) {
        cardsHTML += `
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text skeleton-text-short"></div>
                <div class="skeleton-footer">
                    <div class="skeleton-price"></div>
                    <div class="skeleton-btn"></div>
                </div>
            </div>
        `;
    }
    
    div.innerHTML = `
        <div class="product-grid">
            ${cardsHTML}
        </div>
    `;
    
    return div;
}

// 7. Error State Component
function createErrorState(message, onRetry) {
    const div = document.createElement('div');
    div.className = 'state-container container animate-fade-in';
    
    div.innerHTML = `
        <div class="state-icon state-icon-error">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        </div>
        <h3 class="state-title">Server Connection Interrupted</h3>
        <p class="state-desc">${message}</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn-primary btn-retry">Retry Connection</button>
            <button class="btn-secondary btn-offline">Load Demo catalog</button>
        </div>
    `;
    
    div.querySelector('.btn-retry').addEventListener('click', () => {
        if (onRetry) onRetry();
    });
    
    div.querySelector('.btn-offline').addEventListener('click', () => {
        loadOfflineCatalog();
    });
    
    return div;
}

// --- LANDING LAYOUTS ---

// Hero Section Component
function createHeroSection() {
    const section = document.createElement('section');
    section.className = 'hero';
    section.innerHTML = `
        <div class="hero-container container">
            <div class="hero-grid">
                <div class="hero-content">
                    <span class="hero-tagline">NEXORA Summer Collection</span>
                    <h1 class="hero-title">Discover Products Designed for Everyday Living.</h1>
                    <p class="hero-desc">Elevate your home, office, and lifestyle with our meticulously designed, sustainable technology essentials and jewelry collections.</p>
                    <div class="hero-ctas">
                        <a href="#home?category=electronics" class="btn-primary">Shop Electronics</a>
                        <a href="#home" class="btn-secondary">Explore Catalog</a>
                    </div>
                </div>
                <div class="hero-image-container">
                    <div class="hero-img-backdrop"></div>
                    <!-- Inline vector illustration representing everyday lifestyle products -->
                    <svg class="hero-illustration" width="320" height="320" viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="100" r="80" fill="#E0E7FF" />
                        <rect x="60" y="50" width="80" height="100" rx="8" fill="#6366F1" />
                        <rect x="70" y="60" width="60" height="60" rx="4" fill="#FFFFFF" />
                        <circle cx="100" cy="135" r="10" fill="#4F46E5" />
                        <line x1="85" y1="135" x2="115" y2="135" stroke="#FFFFFF" stroke-width="2" />
                        <path d="M50 80C40 80 40 100 50 100" stroke="#6366F1" stroke-width="4" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
        </div>
    `;
    return section;
}

// Benefits Component
function createBenefitsSection() {
    const section = document.createElement('section');
    section.className = 'benefits-section container';
    section.innerHTML = `
        <div class="benefits-grid">
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                </div>
                <div>
                    <h4 class="benefit-title">Fast Delivery</h4>
                    <p class="benefit-desc">Free, trackable delivery on orders over $50.</p>
                </div>
            </div>
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                        <line x1="12" y1="22" x2="12" y2="12"></line>
                        <line x1="2" y1="8.5" x2="12" y2="12"></line>
                        <line x1="22" y1="8.5" x2="12" y2="12"></line>
                    </svg>
                </div>
                <div>
                    <h4 class="benefit-title">Quality Products</h4>
                    <p class="benefit-desc">Fully tested premium materials only.</p>
                </div>
            </div>
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <div>
                    <h4 class="benefit-title">Secure Checkout</h4>
                    <p class="benefit-desc">Encrypted payments & reliable servers.</p>
                </div>
            </div>
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                    </svg>
                </div>
                <div>
                    <h4 class="benefit-title">Easy Returns</h4>
                    <p class="benefit-desc">Return unused items within 30 days hassle-free.</p>
                </div>
            </div>
        </div>
    `;
    return section;
}
