// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const addProductModal = document.getElementById('addProductModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const addProductForm = document.getElementById('addProductForm');
const productGrid = document.getElementById('productGrid');
const authButtons = document.querySelector('.auth-buttons');
const profileModal = document.getElementById('profileModal');
const profileInfo = document.getElementById('profileInfo');
const myProductsList = document.getElementById('myProductsList');
const addProductFromProfileBtn = document.getElementById('addProductFromProfile');
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const orderAddress = document.getElementById('orderAddress');
const orderQuantity = document.getElementById('orderQuantity');
const ordersModal = document.getElementById('ordersModal');
const ordersList = document.getElementById('ordersList');
const viewOrdersBtn = document.getElementById('viewOrdersBtn');
const productSearch = document.getElementById('productSearch');
const productSpinner = document.getElementById('productSpinner');
const quickViewModal = document.getElementById('quickViewModal');
const quickViewContent = document.getElementById('quickViewContent');
const darkModeToggle = document.getElementById('darkModeToggle');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
const profileDropdown = document.getElementById('profileDropdown');
const profileBtn = document.getElementById('profileBtn');
const dropdownContent = document.getElementById('dropdownContent');
const logoutBtn = document.getElementById('logoutBtn');
const favoritesContainer = document.getElementById('favoritesContainer');
const favoritesGrid = document.getElementById('favoritesGrid');
const welcomeMessage = document.getElementById('welcomeMessage');
const productSort = document.getElementById('productSort');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const dynamicInfoBox = document.getElementById('dynamicInfoBox');
const heroGuestView = document.getElementById('heroGuestView');
const heroLoggedInView = document.getElementById('heroLoggedInView');
const welcomeHeroTitle = document.getElementById('welcomeHeroTitle');
let currentOrderProductId = null;
let currentOrderAvailableQty = 1;
let allProducts = [];
let infoInterval; // To hold the setInterval ID

const farmingFacts = [
    "A single bee can visit up to 1,000 flowers in one trip.",
    "More than 90% of our food comes from just 15 crop and 8 animal species.",
    "Cows have best friends and can become stressed when they are separated.",
    "Apples float in water because they are 25% air.",
    "Hydroponics is a method of growing plants without soil, using nutrient-rich water.",
    "Goats were one of the first animals to be tamed by humans, around 9,000 years ago.",
    "Bananas are technically berries, while strawberries are not."
];

const catchyMessages = [
    "Fresh from the farm to your table. Register now to connect with local farmers!",
    "Unlock direct access to the freshest produce. Sign up today!",
    "Support local agriculture and taste the difference. Join Farms Connect!",
    "Farmers are waiting to connect with you. Create your free account now!",
    "Ready for farm-fresh goodness? Get started in seconds!"
];

// API URL
const API_URL = 'http://localhost:3000/api';

// Move these function definitions above DOMContentLoaded
function updateHamburger() {
    if (window.innerWidth < 900) {
        hamburgerBtn.style.display = 'inline-block';
        navLinks.classList.remove('show');
    } else {
        hamburgerBtn.style.display = 'none';
        navLinks.classList.remove('show');
    }
}

function getUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1])).user;
    } catch {
        return null;
    }
}

// Show message to user
function showMessage(message, type) {
    try {
    let msg = document.createElement('div');
    msg.className = `message ${type}`;
        msg.textContent = message + ' [DEBUG: This message will persist]';
    document.body.appendChild(msg);
        console.log('[showMessage] Appended message element:', msg);
        // Persistent: do not remove or hide
        // setTimeout(() => msg.classList.add('show'), 10);
        // setTimeout(() => {
        //     msg.classList.remove('show');
        //     setTimeout(() => msg.remove(), 400);
        // }, 3000);
    } catch (err) {
        alert(message);
    }
}

// List of all modals for centralized handling
const allModals = [loginModal, registerModal, addProductModal, profileModal, orderModal, ordersModal, quickViewModal];

// Modal Functions
function openModal(modal) {
    console.log('openModal called for', modal && modal.id);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeAllModals() {
    console.log('[closeAllModals] Called. Hiding all modals.');
    allModals.forEach(modal => {
        if (modal) {
            modal.style.display = 'none';
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  loginBtn.addEventListener('click', () => { console.log('Login button clicked'); openModal(loginModal); });
  registerBtn.addEventListener('click', () => { console.log('Register button clicked'); openModal(registerModal); });
  getStartedBtn.addEventListener('click', () => { console.log('Get Started button clicked'); openModal(registerModal); });
// Close modals when clicking the X
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllModals();
    });
});
// Prevent accidental close when clicking inside modal-content
document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', e => e.stopPropagation());
});
// Only close modal when clicking on the dark background
window.addEventListener('click', (e) => {
    if (allModals.includes(e.target)) {
        closeAllModals();
    }
  });
  // Product search/filter
  productSearch.addEventListener('input', function() {
      renderProducts();
  });
  // Product sorting logic
  productSort.addEventListener('change', renderProducts);
  // Hamburger menu logic
  window.addEventListener('resize', updateHamburger);
  updateHamburger();
  hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
  });
  // Profile dropdown logic
  if (profileBtn) profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
  });
  document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target)) {
          profileDropdown.classList.remove('show');
      }
  });
  // Add listeners for dropdown links
  const profileLink = dropdownContent.querySelector('a[href="#profile"]');
  if (profileLink) {
      profileLink.addEventListener('click', (e) => {
          e.preventDefault();
          profileDropdown.classList.remove('show');
          openModal(profileModal);
          loadProfile();
      });
  }
  const ordersLink = dropdownContent.querySelector('a[href="#orders"]');
  if (ordersLink) {
      ordersLink.addEventListener('click', (e) => {
          e.preventDefault();
          profileDropdown.classList.remove('show');
          openModal(ordersModal);
          loadOrders();
      });
  }
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      updateProfileDropdown();
      updateUI();
      showMessage('Logged out', 'success');
  });
  // Show/hide scroll-to-top button
  window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
          scrollToTopBtn.classList.add('show');
      } else {
          scrollToTopBtn.classList.remove('show');
      }
  });
  scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // Add event listener for Add Product button in hero
  const heroAddProductBtn = document.getElementById('heroAddProductBtn');
  if (heroAddProductBtn) {
      heroAddProductBtn.addEventListener('click', () => {
          addProductForm.reset();
          delete addProductForm.dataset.editId;
          openModal(addProductModal);
      });
  }
  // Cart button logic: only allow if logged in
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  if (cartBtn && cartModal) {
    cartBtn.addEventListener('click', () => {
      const token = localStorage.getItem('token');
      if (!token) {
        showMessage('Please login to view your cart.', 'error');
        return;
      }
      renderCartModal();
      cartModal.classList.add('fullscreen-modal');
      cartModal.querySelector('.modal-content').classList.add('fullscreen');
      cartModal.style.display = 'flex';
    });
  }
  // ...add any other event listeners that were previously at the top level...
});

// Smooth scroll for navbar links
[...document.querySelectorAll('.nav-links a')].forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Dark mode toggle
function setDarkMode(on) {
    if (on) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', '1');
        darkModeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', '0');
        darkModeToggle.textContent = '🌙';
    }
}
darkModeToggle.addEventListener('click', () => {
    setDarkMode(!document.body.classList.contains('dark-mode'));
});
if (localStorage.getItem('darkMode') === '1') setDarkMode(true);

// Show/hide spinner
function showSpinner(show) {
    productSpinner.style.display = show ? 'block' : 'none';
}

// Quick View modal logic
function openQuickView(product) {
    if (!quickViewModal || !product) return;
    document.getElementById('quickViewProductName').textContent = product.name;
    document.getElementById('quickViewProductImage').src = product.image;
    document.getElementById('quickViewProductDescription').textContent = product.description;
    document.getElementById('quickViewProductPrice').textContent = `Price: ₹${product.price.toFixed(2)}`;
    document.getElementById('quickViewProductFarmer').textContent = `Farmer: ${product.farmer.username}`;
    openModal(quickViewModal);
}

// Profile dropdown logic (demo: show if logged in)
function updateProfileDropdown() {
    const token = localStorage.getItem('token');
    if (token) {
        profileDropdown.style.display = 'inline-block';
    } else {
        profileDropdown.style.display = 'none';
    }
}

// Show personalized welcome message after login
function showWelcome(name) {
    welcomeMessage.textContent = `Welcome, ${name}!`;
    welcomeMessage.style.display = 'block';
    setTimeout(() => {
        welcomeMessage.style.opacity = 1;
    }, 10);
}
function hideWelcome() {
    welcomeMessage.style.display = 'none';
    welcomeMessage.style.opacity = 0;
}

// Update UI to show/hide welcome message, login/register, profile, and Get Started button
function updateUI() {
    const user = getUser();
    const name = user ? user.name : null;
    const token = localStorage.getItem('token');
    // Welcome message
    if (name) {
        showWelcome(name);
    } else {
        hideWelcome();
    }
    // Auth buttons and profile dropdown
    if (token) {
        authButtons.style.display = 'flex'; // always show for layout, but hide login/register
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        profileDropdown.style.display = 'inline-block';
    } else {
        authButtons.style.display = 'flex';
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        profileDropdown.style.display = 'none';
    }
    // Get Started button
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.style.display = token ? 'none' : 'inline-block';
    }
    // Hero Section Content
    if (token && name) {
        heroGuestView.style.display = 'none';
        heroLoggedInView.style.display = 'block';
        welcomeHeroTitle.textContent = `Welcome back, ${name}!`;
        welcomeHeroTitle.classList.add('hero-dashboard-text');
        // Show role-specific elements and summary
        const role = user ? user.role : null;
        const age = user && user.age ? user.age : '';
        const phone = user && user.phone ? user.phone : '';
        const userRoleDisplay = document.getElementById('userRoleDisplay');
        const userDetailsSummary = document.getElementById('userDetailsSummary');
        if (userRoleDisplay) userRoleDisplay.textContent = `Role: ${role ? role.charAt(0).toUpperCase() + role.slice(1) : ''}`;
        if (userDetailsSummary) userDetailsSummary.textContent = `Age: ${age} | Phone: ${phone}`;
        // Show Add Product button only for farmers
        const heroAddProductBtn = document.getElementById('heroAddProductBtn');
        if (heroAddProductBtn) heroAddProductBtn.style.display = (role === 'farmer') ? 'inline-block' : 'none';
        // Show/hide My Orders button for all
        const heroOrdersBtn = document.getElementById('heroOrdersBtn');
        if (heroOrdersBtn) heroOrdersBtn.style.display = 'inline-block';
    } else {
        heroGuestView.style.display = 'block';
        heroLoggedInView.style.display = 'none';
    }
    // Start or restart the dynamic info system
    startDynamicInfoSystem();
}

// Tooltips: add data-tooltip attributes
function addTooltips() {
    document.querySelectorAll('.heart-btn').forEach(btn => btn.setAttribute('data-tooltip', btn.classList.contains('liked') ? 'Remove from favorites' : 'Add to favorites'));
    document.querySelectorAll('.quick-view-btn').forEach(btn => btn.setAttribute('data-tooltip', 'Quick View'));
    if (profileBtn) profileBtn.setAttribute('data-tooltip', 'Profile');
}

// Badges: mark some products as 'New' or 'Popular' (demo: first 2 as New, next 2 as Popular)
function getBadge(index) {
    if (index === 0 || index === 1) return '<span class="product-badge">New</span>';
    if (index === 2 || index === 3) return '<span class="product-badge" style="background:linear-gradient(90deg,#e67e22,#e74c3c);">Popular</span>';
    return '';
}

// Create Product Card HTML
function createProductCard(product) {
    const favs = getFavorites();
    const isLiked = favs.includes(product._id);
    const farmerName = product.displayFarmerName || (product.farmer ? product.farmer.username : 'Unknown Farmer');
    const user = getUser();
    const isOwner = user && product.farmer && (
      user.id === (typeof product.farmer === 'object' ? product.farmer._id : product.farmer)
    );
    let buttons = '';
    if (user) {
        if (isOwner) {
            buttons = `<button class="btn btn-secondary edit-btn">Edit</button>`;
        } else {
            buttons = `<button class="btn btn-primary order-btn">Order</button> <button class="btn btn-cart add-cart-btn">Add to Cart</button>`;
        }
    } else {
        buttons = `<button class="btn btn-cart add-cart-btn">Add to Cart</button>`;
    }
    return `
        <div class="product-card" data-product-id="${product._id}">
            <button class="heart-btn ${isLiked ? 'liked' : ''}" title="${isLiked ? 'Remove from favorites' : 'Add to favorites'}">❤</button>
            <button class="quick-view-btn" title="Quick View">👁️</button>
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <div class="farmer-name">by ${farmerName}</div>
            <div class="price">₹${product.price.toFixed(2)} / ${product.unit}</div>
            <p class="description">${product.description}</p>
            <div class="user-buttons">
                ${buttons}
            </div>
        </div>
    `;
}

// Add event listeners for product cards
function addCardEventListeners(products, containerSelector) {
    // ... existing code ...
}

// Render products with sorting, filter, quick view, heart, tooltips, badges
function renderProducts() {
    try {
    const search = productSearch.value.trim().toLowerCase();
    let filtered = allProducts;
    if (search) {
        filtered = allProducts.filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search) ||
                (p.description && p.description.toLowerCase().includes(search)) ||
                (p.farmer && p.farmer.username && p.farmer.username.toLowerCase().includes(search))
        );
    }
    // Sorting
    const sort = productSort.value;
    if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sort === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const favs = getFavorites();
    productGrid.innerHTML = filtered.length ? filtered.map((product, i) => createProductCard(product)).join('') : '<p style="grid-column:1/-1;text-align:center;">No products found.</p>';
    // Add quick view event listeners
    document.querySelectorAll('.quick-view-btn').forEach((btn, i) => {
            btn.onclick = () => {
                try { openQuickView(filtered[i]); } catch (err) { console.error('Quick view error:', err); showMessage('Could not open quick view', 'error'); }
            };
        });
        document.querySelectorAll('.order-btn').forEach((btn, i) => {
            btn.onclick = () => {
                console.log('[Order Button] Clicked for product:', filtered[i]);
                try {
                    purchaseProduct(filtered[i]._id);
                } catch (err) {
                    console.error('[Order Button] Error:', err);
                    showMessage('Could not open order modal', 'error');
                }
            };
        });
        document.querySelectorAll('.edit-btn').forEach((btn, i) => {
            btn.onclick = () => {
                try {
                    const product = filtered[i];
                    document.getElementById('productName').value = product.name;
                    document.getElementById('productDescription').value = product.description;
                    document.getElementById('productPrice').value = product.price;
                    document.getElementById('productQuantity').value = product.quantity;
                    document.getElementById('productUnit').value = product.unit;
                    document.getElementById('productCategory').value = product.category;
                    document.getElementById('productImage').value = product.image;
                    addProductForm.setAttribute('data-edit-id', product._id);
                    openModal(addProductModal);
                } catch (err) { console.error('Edit product error:', err); showMessage('Could not load product for editing', 'error'); }
            };
        });
    document.querySelectorAll('.heart-btn').forEach((btn, i) => {
            btn.onclick = () => {
                try { toggleFavorite(filtered[i]._id); } catch (err) { console.error('Favorite error:', err); showMessage('Could not update favorite', 'error'); }
            };
        });
        document.querySelectorAll('.add-cart-btn').forEach((btn, i) => {
            btn.onclick = () => {
                try { addToCart(filtered[i]); } catch (err) { console.error('Add to cart error:', err); showMessage('Could not add to cart', 'error'); }
            };
    });
    addTooltips();
    } catch (err) {
        console.error('Render products error:', err);
        showMessage('Could not render products', 'error');
    }
}

// Form Submissions
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            closeAllModals();
            updateUI();
            loadProducts();
            renderFavorites();
            updateProfileDropdown();
            showMessage('Login successful!', 'success');
        } else {
            showMessage(data.msg || 'Login failed', 'error');
        }
    } catch (err) {
        console.error('Login error:', err);
        showMessage('Login failed. Please try again.', 'error');
    }
});

// Register
if(registerForm) registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Calculate age from DOB
    const dobString = document.getElementById('registerDob').value;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    const formData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        age: age,
        role: document.getElementById('registerRole').value,
        address: document.getElementById('registerAddress').value,
        phone: document.getElementById('registerPhone').value,
        state: document.getElementById('registerState').value,
        city: document.getElementById('registerCity').value
    };
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            closeAllModals();
            updateUI();
            loadProducts();
            renderFavorites();
            updateProfileDropdown();
            showMessage('Registration successful!', 'success');
        } else {
            showMessage(data.msg || 'Registration failed', 'error');
        }
    } catch (err) {
        console.error('Registration error:', err);
        showMessage('Registration failed. Please try again.', 'error');
    }
});

// Add Product Form Submission
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Please login to add products', 'error');
        return;
    }

    const editId = addProductForm.getAttribute('data-edit-id');
    let url = `${API_URL}/products`;
    let method = 'POST';
    if (editId) {
        url = `${API_URL}/products/${editId}`;
        method = 'PUT';
    }

    // Use FormData for file upload
    const formData = new FormData();
    formData.append('name', document.getElementById('productName').value);
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('quantity', document.getElementById('productQuantity').value);
    formData.append('unit', document.getElementById('productUnit').value);
    formData.append('category', document.getElementById('productCategory').value);
    const imageUrl = document.getElementById('productImage').value;
    const imageFile = document.getElementById('productImageFile').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    } else if (imageUrl) {
        formData.append('image', imageUrl);
    }

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(editId ? 'Product updated successfully!' : 'Product added successfully!', 'success');
            closeAllModals();
            addProductForm.reset();
            addProductForm.removeAttribute('data-edit-id');
            loadProducts();
            loadProfile();
        } else {
            showMessage(data.msg || 'Failed to add/update product', 'error');
        }
    } catch (err) {
        console.error('Add/Edit product error:', err);
        showMessage('Failed to add/update product. Please try again.', 'error');
    }
});

// Load Products (with spinner)
async function loadProducts() {
    showSpinner(true);
    try {
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/products`, { headers });
        const data = await res.json();
        allProducts = Array.isArray(data) ? data : (data.products || []);
        renderProducts();
        renderFavorites();
        updateProfileDropdown();
    } catch (err) {
        productGrid.innerHTML = '<p style="color:red;">Failed to load products.</p>';
    }
    showSpinner(false);
}

// Purchase Product
async function purchaseProduct(productId) {
    console.log('[purchaseProduct] called with', productId);
    try {
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Please login to purchase products', 'error');
        openModal(loginModal);
        return;
    }
    currentOrderProductId = productId;
    // Fetch product to get available quantity
        const response = await fetch(`${API_URL}/products/${productId}`);
        console.log('[purchaseProduct] Fetch product response:', response);
        if (response.ok) {
            const product = await response.json();
            console.log('[purchaseProduct] Product data:', product);
            currentOrderAvailableQty = product.quantity;
            if (!orderQuantity) console.error('[purchaseProduct] orderQuantity element not found');
            orderQuantity.max = product.quantity;
            orderQuantity.value = 1;
            const qtyInfo = document.getElementById('orderAvailableQtyInfo');
            if (qtyInfo) qtyInfo.textContent = `Available: ${product.quantity} ${product.unit}`;
            else console.error('[purchaseProduct] orderAvailableQtyInfo element not found');
        } else {
            console.warn('[purchaseProduct] Product fetch failed:', response.status);
            currentOrderAvailableQty = 1;
            if (orderQuantity) {
            orderQuantity.max = 1;
            orderQuantity.value = 1;
            }
            const qtyInfo = document.getElementById('orderAvailableQtyInfo');
            if (qtyInfo) qtyInfo.textContent = 'Available: 1';
        }
    } catch (err) {
        console.error('[purchaseProduct] Fetch error:', err);
        showMessage('Could not open order modal', 'error');
    }
    // Pre-fill address if available
    try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.user.id;
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const user = await response.json();
            if (orderAddress) orderAddress.value = user.address || '';
            else console.error('[purchaseProduct] orderAddress element not found');
        } else {
            if (orderAddress) orderAddress.value = '';
        }
    } catch (err) {
        console.error('[purchaseProduct] Profile fetch error:', err);
        if (orderAddress) orderAddress.value = '';
    }
    console.log('[purchaseProduct] Attempting to open orderModal:', orderModal);
    if (orderModal) setTimeout(() => openModal(orderModal), 0);
    else console.error('[purchaseProduct] orderModal element not found');
}

// Handle Order Form Submission
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('[OrderForm] Submit event fired');
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('You must be logged in to place an order.', 'error');
        return;
    }
    try {
        const payload = {
            productId: currentOrderProductId,
            address: document.getElementById('orderAddress').value,
            quantity: document.getElementById('orderQuantity').value
        };
        console.log('[OrderForm] Submitting order:', payload);
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log('[OrderForm] Response:', response, data);
        if (response.ok) {
            showMessage('Order placed successfully!', 'success');
            closeAllModals();
            loadProducts();
        } else {
            showMessage(data.msg || 'Failed to place order', 'error');
        }
    } catch (err) {
        console.error('[OrderForm] Order error:', err);
        showMessage('Failed to place order. Please try again.', 'error');
    }
});

// Show Profile Modal
window.showProfile = async function() {
    openModal(profileModal);
    await loadProfile();
};

// Close profile modal when clicking the X
profileModal.querySelector('.close').addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllModals();
});

// Prevent accidental close when clicking inside modal-content
profileModal.querySelector('.modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Only close modal when clicking on the dark background
profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeAllModals();
});

// Fetch and display user profile and their products
async function loadProfile() {
    const token = localStorage.getItem('token');
    const profileInfo = document.getElementById('profileInfo');
    const myProductsList = document.getElementById('myProductsList');
    const profileActions = document.querySelector('#profileModal .profile-modal-actions');

    if (!token) {
        profileInfo.innerHTML = '<p>Please login to view your profile.</p>';
        myProductsList.innerHTML = '';
        if (profileActions) profileActions.style.display = 'none';
        return;
    }
    try {
        // Step 1: Fetch user profile data
        const profileResponse = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!profileResponse.ok) throw new Error('Failed to fetch profile data');
        const user = await profileResponse.json();

        profileInfo.innerHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Age:</strong> ${user.age || 'Not provided'}</p>
            <p><strong>Address:</strong> ${user.address || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
        `;

        // Step 2: Fetch user's products separately
        myProductsList.innerHTML = '<p>Loading your products...</p>';
        const productsResponse = await fetch(`${API_URL}/products/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!productsResponse.ok) throw new Error('Failed to fetch your products');
        
        const myProducts = await productsResponse.json();

        if (myProducts.length === 0) {
            myProductsList.innerHTML = '<p>You have not listed any products yet.</p>';
        } else {
            myProductsList.innerHTML = myProducts.map(p => `
                <div class="product-card" style="margin-bottom:1rem;">
                    <img src="${p.image || ''}" alt="${p.name}">
                    <h4>${p.name}</h4>
                    <p>Price: ₹${p.price.toFixed(2)} / ${p.unit}</p>
                    <p>Available: ${p.quantity} ${p.unit}</p>
                    <div class="product-actions">
                        <button class="btn btn-edit" onclick="editProduct('${p._id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProduct('${p._id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        profileInfo.innerHTML = `<p>Error loading profile. ${err.message}</p>`;
        myProductsList.innerHTML = '';
    } finally {
        // Force the action buttons to be visible for logged-in users
        if (profileActions) {
            console.log('>>> Forcing profile modal actions to be visible.');
            profileActions.style.display = 'flex';
        } else {
            console.error('!!! Could not find .profile-modal-actions to display.');
        }
    }
}

// Edit Product Handler
window.editProduct = async function(productId) {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const product = await response.json();
        // Fill the add/edit form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productUnit').value = product.unit;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.image;
        document.getElementById('displayFarmerName').value = product.displayFarmerName || '';
        
        addProductForm.dataset.editId = productId;
        closeAllModals();
        openModal(addProductModal);
    } catch (err) {
        showMessage('Could not load product for editing', 'error');
    }
}

// Delete Product Handler
window.deleteProduct = async function(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            showMessage('Product deleted successfully', 'success');
            loadProfile();
            loadProducts();
        } else {
            showMessage('Failed to delete product', 'error');
        }
    } catch (err) {
        showMessage('Failed to delete product', 'error');
    }
}

// Show Add Product Modal
window.showAddProduct = function() {
    openModal(addProductModal);
};

// Add Product from Profile Modal
addProductFromProfileBtn.addEventListener('click', () => {
    closeAllModals();
    addProductForm.reset();
    delete addProductForm.dataset.editId;
    openModal(addProductModal);
});

// Load My Orders
async function loadOrders() {
    const token = localStorage.getItem('token');
    if (!token) {
        ordersList.innerHTML = '<p>Please login to view your orders.</p>';
        return;
    }
    ordersList.innerHTML = '<p>Loading your orders...</p>';
    try {
        const user = getUser();
        if (user && user.role === 'farmer') {
            // For farmers, fetch all orders for their products
            const response = await fetch(`${API_URL}/orders/sold`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
            if (!response.ok) throw new Error('Failed to fetch sold orders');
            const soldOrders = await response.json();
            if (!soldOrders.length) {
                ordersList.innerHTML = '<p>No one has ordered your products yet.</p>';
            } else {
                ordersList.innerHTML = soldOrders.map(order => {
                    const product = order.product || {};
                    return `
                        <div class="product-card" style="margin-bottom:1rem;">
                            <img src="${product.image || 'https://via.placeholder.com/200'}" alt="${product.name || ''}">
                            <h4>${product.name || 'Product deleted'}</h4>
                            <p><strong>Ordered by:</strong> ${order.buyerName || 'Unknown'}</p>
                            <p>Status: ${order.status || 'placed'}</p>
                            <p>Ordered: ${order.quantity} ${product.unit || ''}</p>
                            <p>Category: ${product.category || ''}</p>
                            <p>Address: ${order.address}</p>
                            <p>Ordered At: ${new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                    `;
                }).join('');
            }
        } else {
            // For consumers, fetch their orders as before
            const response = await fetch(`${API_URL}/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch your orders');
        const orders = await response.json();
        if (!orders.length) {
            ordersList.innerHTML = '<p>You have not placed any orders yet.</p>';
        } else {
            ordersList.innerHTML = orders.map(order => {
                const product = order.product || {};
                return `
                        <div class="product-card" style="margin-bottom:1rem;">
                            <img src="${product.image || 'https://via.placeholder.com/200'}" alt="${product.name || ''}">
                        <h4>${product.name || 'Product deleted'}</h4>
                        <p>Status: ${order.status || 'placed'}</p>
                        <p>Ordered: ${order.quantity} ${product.unit || ''}</p>
                        <p>Category: ${product.category || ''}</p>
                        <p>Address: ${order.address}</p>
                        <p>Ordered At: ${new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                `;
            }).join('');
            }
        }
    } catch (err) {
        console.error('>>> [Frontend] Error in loadOrders:', err);
        ordersList.innerHTML = '<p>Could not load your orders. Check console for details.</p>';
    }
}

// Event Listeners for the Orders Modal
if (viewOrdersBtn) {
    viewOrdersBtn.addEventListener('click', async () => { // Make the listener async
        if (profileModal) closeAllModals();
        openModal(ordersModal); // Open modal immediately
        await loadOrders(); // Then load orders
    });
}

if (ordersModal) {
    const closeBtn = ordersModal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllModals();
            ordersModal.classList.remove('fullscreen-modal');
            ordersModal.querySelector('.modal-content').classList.remove('fullscreen');
        });
    }

    ordersModal.addEventListener('click', (e) => {
        if (e.target === ordersModal) {
            closeAllModals();
            ordersModal.classList.remove('fullscreen-modal');
            ordersModal.querySelector('.modal-content').classList.remove('fullscreen');
        }
    });

    const modalContent = ordersModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', e => e.stopPropagation());
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setDarkMode(localStorage.getItem('darkMode') === '1');
    updateUI();
    loadProducts();
    aosInit();
    // Reveal the body now that everything is set up
    document.body.classList.add('loaded');
    // --- Ensure all modals are closed on page load ---
    const modals = [
        document.getElementById('cartModal'),
        document.getElementById('checkoutModal'),
        document.getElementById('ordersModal'),
        document.getElementById('profileModal'),
        document.getElementById('loginModal'),
        document.getElementById('registerModal'),
        document.getElementById('addProductModal'),
        document.getElementById('quickViewModal'),
        document.getElementById('orderModal')
    ];
    modals.forEach(m => { if (m) m.style.display = 'none'; });
    // Ensure cart button always opens the cart modal
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    if (cartBtn && cartModal) {
        cartBtn.onclick = () => {
            console.log('Cart button clicked!');
            renderCartModal();
            cartModal.classList.add('fullscreen-modal');
            cartModal.querySelector('.modal-content').classList.add('fullscreen');
            cartModal.style.display = 'flex';
            setTimeout(() => {
                if (cartModal.style.display !== 'flex') {
                    cartModal.style.display = 'flex';
                    console.log('Cart modal forcibly shown.');
                }
            }, 100);
        };
    }
});

function updateDynamicInfo(messages) {
    if (!dynamicInfoBox) return;

    // Fade out
    dynamicInfoBox.classList.remove('show');

    // Wait for fade out, then update and fade in
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        dynamicInfoBox.textContent = messages[randomIndex];
        dynamicInfoBox.style.display = 'block';
        dynamicInfoBox.classList.add('show');
    }, 500); // Match CSS transition time
}

function startDynamicInfoSystem() {
    if (infoInterval) clearInterval(infoInterval); // Clear any existing interval

    const token = localStorage.getItem('token');
    const messages = token ? farmingFacts : catchyMessages;

    // Initial display
    setTimeout(() => updateDynamicInfo(messages), 2000); // Initial delay

    // Update every 15 seconds
    infoInterval = setInterval(() => updateDynamicInfo(messages), 15000);
}

// Wire up the new hero buttons
const heroBrowseBtn = document.getElementById('heroBrowseBtn');
if(heroBrowseBtn) {
    heroBrowseBtn.addEventListener('click', () => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
}

const heroProfileBtn = document.getElementById('heroProfileBtn');
if(heroProfileBtn) {
    heroProfileBtn.addEventListener('click', () => {
        openModal(profileModal);
        loadProfile();
    });
}

const heroOrdersBtn = document.getElementById('heroOrdersBtn');
if(heroOrdersBtn) {
    heroOrdersBtn.addEventListener('click', () => {
        openModal(ordersModal);
        loadOrders();
    });
}

// --- PASSWORD VISIBILITY TOGGLE ---
const togglePassword = document.getElementById('togglePassword');
if (togglePassword) {
    togglePassword.addEventListener('click', function() {
        const passwordInput = document.getElementById('registerPassword');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        // Toggle the icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

// Smooth scroll for navbar links
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
        // Toggle the icon
        this.classList.toggle('fa-eye-slash');
    });
}); 

// --- CART LOGIC ---
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}
function addToCart(product, qty = 1) {
    let cart = getCart();
    const idx = cart.findIndex(item => item._id === product._id);
    if (idx > -1) {
        cart[idx].qty += qty;
    } else {
        cart.push({ ...product, qty });
    }
    setCart(cart);
    showMessage('Added to cart!', 'success');
}
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item._id !== productId);
    setCart(cart);
}
function updateCartQty(productId, qty) {
    let cart = getCart();
    const idx = cart.findIndex(item => item._id === productId);
    if (idx > -1) {
        cart[idx].qty = qty;
        if (cart[idx].qty < 1) cart.splice(idx, 1);
    }
    setCart(cart);
}
function updateCartBadge() {
    const cart = getCart();
    const badge = document.getElementById('cartCountBadge');
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}
function renderCartModal() {
    const cart = getCart();
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartItemsList || !cartTotal) {
        console.error('Cart modal elements missing!');
        showMessage('Cart UI error. Please refresh the page.', 'error');
        return;
    }
    if (!cart.length) {
        cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '';
    } else {
        let total = 0;
        cartItemsList.innerHTML = cart.map(item => {
            total += item.price * item.qty;
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-product-info">
                        <div class="cart-product-name">${item.name}</div>
                        <div class="cart-product-price">₹${item.price.toFixed(2)} per ${item.unit}</div>
                    </div>
                    <input type="number" min="1" max="${item.quantity}" value="${item.qty}" data-id="${item._id}" class="cart-qty-input">
                    <button class="btn cart-remove-btn" data-id="${item._id}">&times;</button>
                </div>
            `;
        }).join('');
        cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
        // Add listeners
        cartItemsList.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.onclick = () => {
                removeFromCart(btn.getAttribute('data-id'));
                renderCartModal();
            };
        });
        cartItemsList.querySelectorAll('.cart-qty-input').forEach(input => {
            input.onchange = () => {
                let val = parseInt(input.value);
                if (isNaN(val) || val < 1) val = 1;
                updateCartQty(input.getAttribute('data-id'), val);
                renderCartModal();
            };
        });
    }
    // Attach checkout button handler every time modal is rendered
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutBtn && checkoutModal && checkoutForm) {
        checkoutBtn.onclick = () => {
            if (cartModal) {
                cartModal.style.display = 'none';
                cartModal.classList.remove('fullscreen-modal');
                cartModal.querySelector('.modal-content').classList.remove('fullscreen');
            }
            // Prefill user details if logged in
            const user = getUser();
            document.getElementById('checkoutName').value = user && user.name ? user.name : '';
            document.getElementById('checkoutEmail').value = user && user.email ? user.email : '';
            document.getElementById('checkoutPhone').value = user && user.phone ? user.phone : '';
            document.getElementById('checkoutAddress').value = user && user.address ? user.address : '';
            document.getElementById('checkoutPin').value = '';
            document.getElementById('checkoutAddressType').value = '';
            checkoutModal.classList.add('fullscreen-modal');
            checkoutModal.querySelector('.modal-content').classList.add('fullscreen');
            checkoutModal.style.display = 'flex';
            // Reset to step 1
            if (typeof showStep === 'function') showStep(1);
            const stepBar = document.getElementById('checkoutStepBarActive');
            if (stepBar) stepBar.style.width = '50%';
            document.getElementById('checkoutForm').classList.remove('hide');
            document.getElementById('checkoutForm').classList.add('show');
            document.getElementById('checkoutConfirmation').classList.remove('show','hide');
            document.getElementById('checkoutConfirmation').style.display = 'none';
        };
    }
}
// Cart modal open/close
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
if (cartBtn && cartModal) {
    cartBtn.onclick = () => {
        console.log('Cart button clicked!');
        renderCartModal();
        cartModal.classList.add('fullscreen-modal');
        cartModal.querySelector('.modal-content').classList.add('fullscreen');
        cartModal.style.display = 'flex';
        setTimeout(() => {
            if (cartModal.style.display !== 'flex') {
                cartModal.style.display = 'flex';
                console.log('Cart modal forcibly shown.');
            }
        }, 100);
    };
    cartModal.querySelector('.close').onclick = () => {
        cartModal.style.display = 'none';
        cartModal.classList.remove('fullscreen-modal');
        cartModal.querySelector('.modal-content').classList.remove('fullscreen');
    };
    cartModal.addEventListener('click', e => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            cartModal.classList.remove('fullscreen-modal');
            cartModal.querySelector('.modal-content').classList.remove('fullscreen');
        }
    });
}
// Checkout
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutBtn && checkoutModal && checkoutForm) {
    // Multi-step logic
    const step1 = document.getElementById('checkoutStep1');
    const step2 = document.getElementById('checkoutStep2');
    const nextBtn = document.getElementById('checkoutNextBtn');
    const backBtn = document.getElementById('checkoutBackBtn');
    const reviewCart = document.getElementById('checkoutReviewCart');
    const reviewTotal = document.getElementById('checkoutReviewTotal');
    const stepBar = document.getElementById('checkoutStepBarActive');
    function showStep(step) {
        if (step === 1) {
            step1.style.display = 'block';
            step2.style.display = 'none';
            if (stepBar) stepBar.style.width = '50%';
        } else {
            step1.style.display = 'none';
            step2.style.display = 'block';
            if (stepBar) stepBar.style.width = '100%';
        }
    }
    if (nextBtn) {
        nextBtn.onclick = () => {
            // Validate step 1
            const name = document.getElementById('checkoutName').value.trim();
            const email = document.getElementById('checkoutEmail').value.trim();
            const phone = document.getElementById('checkoutPhone').value.trim();
            const address = document.getElementById('checkoutAddress').value.trim();
            const pin = document.getElementById('checkoutPin').value.trim();
            const addressType = document.getElementById('checkoutAddressType').value;
            if (!name || !email || !phone || !address || !pin || !addressType) {
                showMessage('Please fill all fields.', 'error');
                return;
            }
            // Render review cart
            const cart = getCart();
            if (!cart.length) {
                reviewCart.innerHTML = '<p>Your cart is empty.</p>';
                reviewTotal.textContent = '';
            } else {
                let total = 0;
                reviewCart.innerHTML = cart.map(item => {
                    total += item.price * item.qty;
                    return `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-product-info">
                                <div class="cart-product-name">${item.name}</div>
                                <div class="cart-product-price">₹${item.price.toFixed(2)} per ${item.unit}</div>
                            </div>
                            <input type="number" min="1" max="${item.quantity}" value="${item.qty}" data-id="${item._id}" class="cart-qty-input">
                            <button class="btn cart-remove-btn" data-id="${item._id}">&times;</button>
                        </div>
                    `;
                }).join('');
                reviewTotal.textContent = `Total: ₹${total.toFixed(2)}`;
                // Add listeners for editing/removing in review
                reviewCart.querySelectorAll('.cart-remove-btn').forEach(btn => {
                    btn.onclick = () => {
                        removeFromCart(btn.getAttribute('data-id'));
                        // Re-render review
                        nextBtn.onclick();
                    };
                });
                reviewCart.querySelectorAll('.cart-qty-input').forEach(input => {
                    input.onchange = () => {
                        let val = parseInt(input.value);
                        if (isNaN(val) || val < 1) val = 1;
                        updateCartQty(input.getAttribute('data-id'), val);
                        // Re-render review
                        nextBtn.onclick();
                    };
                });
            }
            showStep(2);
        };
    }
    if (backBtn) {
        backBtn.onclick = () => {
            showStep(1);
        };
    }
    // On open, always start at step 1
    checkoutBtn.onclick = () => {
        // ... existing code ...
        showStep(1);
        if (stepBar) stepBar.style.width = '50%';
        document.getElementById('checkoutForm').classList.remove('hide');
        document.getElementById('checkoutForm').classList.add('show');
        document.getElementById('checkoutConfirmation').classList.remove('show','hide');
        document.getElementById('checkoutConfirmation').style.display = 'none';
    };
    // On close or confirmation, reset to step 1
    function resetCheckoutSteps() {
        showStep(1);
        if (stepBar) stepBar.style.width = '50%';
        document.getElementById('checkoutForm').classList.remove('hide');
        document.getElementById('checkoutForm').classList.add('show');
        document.getElementById('checkoutConfirmation').classList.remove('show','hide');
        document.getElementById('checkoutConfirmation').style.display = 'none';
    }
    checkoutModal.querySelector('.close').onclick = () => {
        checkoutModal.style.display = 'none';
        checkoutModal.classList.remove('fullscreen-modal');
        checkoutModal.querySelector('.modal-content').classList.remove('fullscreen');
        resetCheckoutSteps();
    };
    checkoutModal.addEventListener('click', e => {
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
            checkoutModal.classList.remove('fullscreen-modal');
            checkoutModal.querySelector('.modal-content').classList.remove('fullscreen');
            resetCheckoutSteps();
        }
    });
    // Form submit (step 2)
    checkoutForm.onsubmit = e => {
        e.preventDefault();
        // Only allow if on step 2
        if (step2.style.display !== 'block') return;
        // Animate transition to confirmation
        setCart([]);
        updateCartBadge();
        const formEl = document.getElementById('checkoutForm');
        const confEl = document.getElementById('checkoutConfirmation');
        if (formEl && confEl) {
            formEl.classList.add('hide');
            setTimeout(() => {
                formEl.style.display = 'none';
                confEl.style.display = 'block';
                confEl.classList.add('show');
            }, 400);
        }
    };
    // Confirmation 'Back to Home' button
    const doneBtn = document.getElementById('checkoutDoneBtn');
    if (doneBtn) {
        doneBtn.onclick = () => {
            const formEl = document.getElementById('checkoutForm');
            const confEl = document.getElementById('checkoutConfirmation');
            if (formEl && confEl) {
                confEl.classList.remove('show');
                confEl.classList.add('hide');
                setTimeout(() => {
                    confEl.style.display = 'none';
                    formEl.style.display = 'block';
                    formEl.classList.remove('hide');
                    formEl.classList.add('show');
                }, 400);
            }
            checkoutModal.style.display = 'none';
            checkoutModal.classList.remove('fullscreen-modal');
            checkoutModal.querySelector('.modal-content').classList.remove('fullscreen');
            resetCheckoutSteps();
        };
    }
}
// --- END CHECKOUT LOGIC ---

// --- Back to Top Button Logic ---
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    backToTopBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

// --- City Suggestion Logic for Registration ---
const stateCityMap = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Thane'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangalore', 'Hubli', 'Belgaum', 'Davangere'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Erode'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia']
};
const registerState = document.getElementById('registerState');
const registerCity = document.getElementById('registerCity');
const citySuggestions = document.getElementById('citySuggestions');
if (registerState && registerCity && citySuggestions) {
    let currentCities = [];
    registerState.addEventListener('change', () => {
        currentCities = stateCityMap[registerState.value] || [];
        citySuggestions.style.display = 'none';
        registerCity.value = '';
    });
    registerCity.addEventListener('input', () => {
        const val = registerCity.value.toLowerCase();
        if (!val || !currentCities.length) {
            citySuggestions.style.display = 'none';
            return;
        }
        const matches = currentCities.filter(city => city.toLowerCase().startsWith(val));
        if (matches.length) {
            citySuggestions.innerHTML = matches.map(city => `<li style="padding:0.5rem 1rem;cursor:pointer;">${city}</li>`).join('');
            citySuggestions.style.display = 'block';
        } else {
            citySuggestions.style.display = 'none';
        }
    });
    citySuggestions.addEventListener('mousedown', e => {
        if (e.target.tagName === 'LI') {
            registerCity.value = e.target.textContent;
            citySuggestions.style.display = 'none';
        }
    });
    document.addEventListener('click', e => {
        if (!citySuggestions.contains(e.target) && e.target !== registerCity) {
            citySuggestions.style.display = 'none';
        }
    });
}

// Add global error handler
window.addEventListener('error', function(event) {
    console.error('Global JS error:', event.error || event.message);
    showMessage('A site error occurred. Please refresh or check the console.', 'error');
});
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showMessage('A site error occurred. Please refresh or check the console.', 'error');
});

// Move these function definitions above DOMContentLoaded
function aosInit() {
    const elements = document.querySelectorAll('[data-aos]');
    function onScroll() {
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                el.classList.add('aos-animate');
            }
        });
    }
    window.addEventListener('scroll', onScroll);
    onScroll(); // Initial trigger
}

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch { return []; }
}
function setFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}
function toggleFavorite(productId) {
    let favs = getFavorites();
    if (favs.includes(productId)) {
        favs = favs.filter(id => id !== productId);
    } else {
        favs.push(productId);
    }
    setFavorites(favs);
    renderProducts();
    renderFavorites();
}
function renderFavorites() {
    const favs = getFavorites();
    const favProducts = allProducts.filter(p => favs.includes(p._id));
    if (favProducts.length) {
        favoritesContainer.style.display = 'block';
        favoritesGrid.innerHTML = favProducts.map(product => `
            <div class="product-card">
                <button class="heart-btn liked" title="Remove from favorites">❤</button>
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <div class="price">₹${product.price} / ${product.unit}</div>
                <p>${product.description}</p>
                <div class="user-buttons">
                    <button class="btn btn-primary" onclick="purchaseProduct('${product._id}')">Order</button>
                </div>
            </div>
        `).join('');
        document.querySelectorAll('#favoritesGrid .heart-btn').forEach((btn, i) => {
            btn.onclick = () => toggleFavorite(favProducts[i]._id);
        });
    } else {
        favoritesContainer.style.display = 'none';
    }
} 