// =================== MAESTRO JS ===================

// ================== NEWSLETTER & SUPPORT ==================
document.addEventListener("DOMContentLoaded", () => {

    // Newsletter form
    const newsletterForm = document.getElementById("newsletterForm");
    if(newsletterForm){
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Thank you for subscribing to Maestro!");
            newsletterForm.reset();
        });
    }

    // Payment method toggle
    const paymentRadios = document.querySelectorAll("input[name='payment']");
    const cardDetails = document.getElementById("cardDetails");

    paymentRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if(radio.checked && radio.parentElement.innerText.includes("Credit")){
                cardDetails.style.display = "block";
            } else {
                cardDetails.style.display = "none";
            }
        });
    });

    // Checkout form
    const checkoutForm = document.getElementById("checkoutForm");
    if(checkoutForm){
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Order placed successfully! Thank you for shopping with Maestro.");
            checkoutForm.reset();
            localStorage.removeItem("cart"); // clear cart after order
            location.reload(); // refresh page
        });
    }

    // Load cart on page load
    loadCart();
    loadCheckoutSummary();

});

// ================== SIZE SELECTION ==================
document.addEventListener("click", function(e){
    if(e.target.classList.contains("size-btn")){
        let buttons = e.target.parentElement.querySelectorAll(".size-btn");
        buttons.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
    }
});

// ================== ADD TO CART ==================
document.addEventListener("click", function(e){
    let btn = e.target.closest(".add-btn");
    if(btn){
        let product = btn.closest(".product");
        let name = product.querySelector("h3").innerText;
        let priceEl = product.querySelector(".price");
        if(!priceEl){
            alert("Price not found!");
            return;
        }
        let price = parseInt(priceEl.innerText.replace("$",""));
        let image = product.querySelector("img").src;

        let sizeEl = product.querySelector(".size-btn.active");
        if(!sizeEl){
            alert("Please select a size ❗");
            return;
        }
        let size = sizeEl.innerText.trim();

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existing = cart.find(item => item.name === name && item.size === size);

        if(existing){
            existing.qty += 1;
        } else {
            cart.push({ name, price, image, size, qty:1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`Added ${name} (Size ${size})`);
        loadCart(); // update cart immediately
    }
});

// ================== LOAD CART ==================
function loadCart(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let container = document.getElementById("cartItems");
    if(!container) return;

    container.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;

        container.innerHTML += `
        <div class="cart-item">

            <img src="${item.image}">

            <div class="item-details">
                <h3>${item.name} (Size: ${item.size})</h3>
                <p>$${item.price}</p>

                <div class="quantity">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>

            <button class="remove-btn" onclick="removeItem(${index})">✕</button>

        </div>
        `;
    });

    document.getElementById("subtotal").innerText = "$" + subtotal;
    document.getElementById("total").innerText = "$" + (subtotal + 10);
}

// ================== CHANGE QTY ==================
function changeQty(index, amount){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].qty += amount;
    if(cart[index].qty <= 0){
        cart.splice(index,1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    loadCheckoutSummary(); // update checkout if open
}

// ================== REMOVE ITEM ==================
function removeItem(index){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index,1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    loadCheckoutSummary(); // update checkout if open
}

// ================== CHECKOUT SUMMARY ==================
function loadCheckoutSummary(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let orderItemsDiv = document.getElementById("orderItems");
    let subtotalSpan = document.getElementById("subtotal");
    let totalSpan = document.getElementById("total");
    let shippingCost = 10;

    if(!orderItemsDiv) return;

    orderItemsDiv.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
        let itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        let div = document.createElement("div");
        div.classList.add("summary-item");

        div.innerHTML = `<span>${item.name} (Size ${item.size}) x${item.qty}</span>
                         <span>$${itemTotal}</span>`;

        orderItemsDiv.appendChild(div);
    });

    subtotalSpan.innerText = `$${subtotal}`;
    totalSpan.innerText = `$${subtotal + shippingCost}`;
}