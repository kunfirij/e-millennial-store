// 1. PRODUCT DATA (Converted to Ghana Cedis Equivalents)
var products = [
    { index: 1, id: 'p1', name: 'Samsung TV', price: 5000 },
    { index: 2, id: 'p2', name: 'Pixel 4a', price: 2500 },
    { index: 3, id: 'p3', name: 'PS 5', price: 3000 },
    { index: 4, id: 'p4', name: 'MacBook Air', price: 8000 },
    { index: 5, id: 'p5', name: 'Apple Watch', price: 950 },
    { index: 6, id: 'p6', name: 'Air Pods', price: 750 }
];

// 2. STATE APP VARIABLE
let cart = []; // Holds items: { id, name, price, quantity }

// 3. DOM ELEMENTS
const productGrid = document.getElementById('product-grid');
const cartCountBadge = document.getElementById('cart-count');

// 4. FUNCTION: UPDATE CART BADGE
function updateCartBadge() {
    // Reflects number of unique items (not total quantity) in the cart badge
    cartCountBadge.textContent = cart.length;
}

// 5. FUNCTION: TOGGLE ADD/REMOVE FROM CART
function toggleCartItem(productId, buttonElement) {
    const existingItemIndex = cart.findIndex(item => item.id === productId);

    if (existingItemIndex === -1) {
        const product = products.find(item => item.id === productId);
        if (!product) return;

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });

        // Update UI Button Text to active state
        buttonElement.textContent = "Remove from Cart";
        buttonElement.style.backgroundColor = "#555555"; 
    } else {
        cart.splice(existingItemIndex, 1);

        // Update UI Button Text back to brand orange
        buttonElement.textContent = "Add to Cart";
        buttonElement.style.backgroundColor = "var(--accent-orange)"; 
    }

    updateCartBadge();
}

// 6. EVENT LISTENER: CLICK ON PRODUCT GRID (Event Delegation)
productGrid.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = e.target.getAttribute('data-id');
        toggleCartItem(productId, e.target);
    }
});

// 7. ADDITIONAL DOM ELEMENTS FOR MODALS
const cartBadgeBtn = document.getElementById('cart-badge-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');

// 8. FUNCTION: OPEN CART MODAL
cartBadgeBtn.addEventListener('click', function() {
    cartModal.classList.remove('hidden');
    renderCart(); 
});

// 9. FUNCTION: CLOSE CART MODAL
function closeCart() {
    cartModal.classList.add('hidden');
}

closeCartBtn.addEventListener('click', closeCart);

// Close modal when user clicks outside the modal content area
cartModal.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        closeCart();
    }
});

// 10. FUNCTION: RENDER ITEMS INSIDE THE CART MODAL
function renderCart() {
    cartItemsContainer.innerHTML = "";
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotalPrice.textContent = "0";
        return;
    }

    let totalSum = 0;

    cart.forEach(item => {
        const itemTotalPrice = item.price * item.quantity;
        totalSum += itemTotalPrice;

        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item-row';
        itemRow.style.display = 'flex';
        itemRow.style.justifyContent = 'space-between';
        itemRow.style.alignItems = 'center';
        itemRow.style.marginBottom = '15px';
        itemRow.style.borderBottom = '1px solid #eee';
        itemRow.style.paddingBottom = '10px';

        itemRow.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>GH₵ ${item.price.toLocaleString()} x ${item.quantity}</p>
                <p>Subtotal: <strong>GH₵ ${itemTotalPrice.toLocaleString()}</strong></p>
            </div>
            <div>
                <button class="qty-btn minus-btn" data-id="${item.id}">-</button>
                <button class="qty-btn plus-btn" data-id="${item.id}">+</button>
                <button class="remove-item-btn" data-id="${item.id}" style="background:#ff3333; color:white; margin-left:10px; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemRow);
    });

    // Update total amount display cleanly
    cartTotalPrice.textContent = totalSum.toLocaleString();
}

// 11. EVENT LISTENER: CONTROL DYNAMIC QUANTITIES AND REMOVALS
cartItemsContainer.addEventListener('click', function(e) {
    const productId = e.target.getAttribute('data-id');
    if (!productId) return;

    const cartItem = cart.find(item => item.id === productId);

    if (e.target.classList.contains('plus-btn')) {
        cartItem.quantity += 1;
    }

    if (e.target.classList.contains('minus-btn')) {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            removeProductEntirely(productId);
            return;
        }
    }

    if (e.target.classList.contains('remove-item-btn')) {
        removeProductEntirely(productId);
        return;
    }

    renderCart();
});

// HELPER FUNCTION: REMOVE ITEM AND SYNC HOME GRID BUTTON
function removeProductEntirely(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    const shelfButton = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
    if (shelfButton) {
        shelfButton.textContent = "Add to Cart";
        shelfButton.style.backgroundColor = "var(--accent-orange)";
    }

    updateCartBadge();
    renderCart();
}

// 12. FORM INPUT DOM ELEMENTS
const userNameInput = document.getElementById('user-name');
const userEmailInput = document.getElementById('user-email');
const userPhoneInput = document.getElementById('user-phone');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');

// 13. INDIVIDUAL VALIDATION FUNCTIONS
function validateName() {
    if (userNameInput.value.trim() === "") {
        nameError.textContent = "Full name is required.";
        return false;
    } else {
        nameError.textContent = "";
        return true;
    }
}

function validateEmail() {
    const emailValue = userEmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailValue === "") {
        emailError.textContent = "Email address is required.";
        return false;
    } else if (!emailRegex.test(emailValue)) {
        emailError.textContent = "Please enter a valid email address.";
        return false;
    } else {
        emailError.textContent = "";
        return true;
    }
}

function validatePhone() {
    const phoneValue = userPhoneInput.value.trim();
    const cleanPhone = phoneValue.replace(/\s+/g, '');
    
    if (cleanPhone === "") {
        phoneError.textContent = "Phone number is required.";
        return false;
    } else if (cleanPhone.length < 10 || isNaN(cleanPhone)) {
        phoneError.textContent = "Enter a valid phone number (at least 10 digits).";
        return false;
    } else {
        phoneError.textContent = "";
        return true;
    }
}

// 14. ATTACH 'BLUR' EVENTS
userNameInput.addEventListener('blur', validateName);
userEmailInput.addEventListener('blur', validateEmail);
userPhoneInput.addEventListener('blur', validatePhone);

// 15. GLOBAL FORM VALIDATION FUNCTION
function validateEntireForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();

    return (isNameValid && isEmailValid && isPhoneValid);
}

// 16. FINAL STAGE DOM ELEMENTS
const checkoutBtn = document.getElementById('checkout-btn');
const summaryModal = document.getElementById('summary-modal');
const summaryMessage = document.getElementById('summary-message');
const summaryOrderItems = document.getElementById('summary-order-items');
const summaryOkBtn = document.getElementById('summary-ok-btn');

// 17. FUNCTION: TRIGGER PAYSTACK POPUP (Ghana Cedis & Mobile Money)
function payWithPaystack() {
    let totalSum = 0;
    cart.forEach(item => {
        totalSum += (item.price * item.quantity);
    });
    
    const totalInPesewas = totalSum * 100;

    // CRITICAL FIX: Explicitly close the cart modal overlay before initializing Paystack modal frame window
    closeCart();

    let handler = PaystackPop.setup({
        key: 'pk_test_49148cc62a59904bfbc46e6d51a5963269ec7f30', 
        email: userEmailInput.value.trim(),
        amount: totalInPesewas,
        currency: 'GHS', 
        ref: 'EM-' + Math.floor((Math.random() * 1000000000) + 1),
        channels: ['mobile_money', 'card'], 
        
        callback: function(response) {
            showSummaryModal();
        },
        onClose: function() {
            // Re-open cart modal if they cancel out, keeping data persistent
            cartModal.classList.remove('hidden');
            alert('Transaction window closed. Your items are safe in your cart.');
        }
    });

    handler.openIframe();
}

// 18. FUNCTION: SHOW ORDER SUMMARY MODAL
function showSummaryModal() {
    const customerName = userNameInput.value.trim();
    summaryMessage.innerHTML = `Thank you, <strong>${customerName}</strong>! Your payment was successful. Here is a summary of your purchase:`;
    
    summaryOrderItems.innerHTML = "";
    
    cart.forEach(item => {
        const itemSummaryRow = document.createElement('div');
        itemSummaryRow.style.display = "flex";
        itemSummaryRow.style.alignItems = "center";
        itemSummaryRow.style.gap = "10px";
        itemSummaryRow.style.padding = "8px 0";
        
        itemSummaryRow.innerHTML = `
            <img src="Project Files (Frontend)/Project Files/Images/check.svg" alt="Success Check" style="width: 16px; height: 16px;">
            <p>${item.name} (Qty: <strong>${item.quantity}</strong>)</p>
        `;
        summaryOrderItems.appendChild(itemSummaryRow);
    });
    
    summaryModal.classList.remove('hidden');

    // 11 & 12 CRITICAL PROTECTION CLEARANCE: Purge cache arrays directly inside execution instance before tearing down views
    cart = [];
    updateCartBadge();
}

// 19. REFRESH PAGE AND EMPTY STATE ON 'OK' CLICK
summaryOkBtn.addEventListener('click', function() {
    window.location.reload();
});

// 20. WIRE UP CHECKOUT INTERCEPTOR
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add some items from the shop first.");
        return;
    }

    const isFormValid = validateEntireForm();
    
    if (isFormValid) {
        payWithPaystack();
    } else {
        alert("Please correct the errors in the contact form before proceeding.");
    }
});