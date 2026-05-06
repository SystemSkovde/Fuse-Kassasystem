document.addEventListener("DOMContentLoaded", function () {

    const cartDiv = document.getElementById("cart");
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    const user = JSON.parse(localStorage.getItem("user"));
    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    function renderCart() {
        const cartDiv = document.getElementById("cart");
    
        // Kontroll om varukorgen är tom
        if (Object.keys(cart).length === 0) {
            cartDiv.innerHTML = `
                <p>Your cart is empty</p>
            `;
            updateCartCount();
            return;
        }

        let html = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th>Account</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
        `;

        let totalCost = 0;

        Object.values(cart).forEach(item => {

            totalCost += item.price * item.quantity; // Lägger till Total Cost

            html += `
            <tr>
                <td>${item.name}</td> <!-- Category -->
                <td>${item.price}</td> <!-- Price -->

                <td>
                    <select onchange="changeQuantity('${item.code}', this.value)">
                        ${createOptions(item.quantity)}
                    </select>
                </td>

                <td>
                    <!-- Account selector (personal + course accounts i samma dropdown) -->
                    <select onchange="changeAccount('${item.code}', this.value)">
                        <option value="">Select account</option>
                        ${accounts.map(acc => `
                            <option value="${acc.AccountName}" 
                                ${item.accountId === acc.AccountName ? "selected" : ""}>
                                ${acc.AccountName}
                            </option>
                        `).join("")}
                    </select>
                </td>

                <td>
                    <!-- Delete item -->
                    <span class="material-symbols-outlined delete-icon"
                        onclick="removeItem('${item.code}')">
                    close
                    </span>
                </td>
            </tr>
            `;
        });

        html += `
            </tbody>
        </table>

        <!-- Total cost -->
        <div class="cart-total">
            <strong>Total: ${totalCost} kr</strong>
        </div>

        <!-- Pay button -->
        <div class="pay-button-wrapper">
            <button onclick="payCart()" class="pay-btn">Pay</button>
        </div>
        `;

        cartDiv.innerHTML = html;
        updateCartCount();
    }

    function createOptions(selected) {
        let options = "";
        for (let i = 1; i <= 20; i++) {
            options += `<option value="${i}" ${i == selected ? "selected" : ""}>${i}</option>`;
        }
        return options;
    }

    // Ändra account (val av sub account / kurs / personal)
    window.changeAccount = function (code, accountId) {
        cart[code].accountId = accountId;
        save();
    };

    // Ändra antal
    window.changeQuantity = function (code, quantity) {
        cart[code].quantity = parseInt(quantity);
        save();
    };

    // Ta bort produkt
    window.removeItem = function (code) {
        delete cart[code];
        save();
    };

    // Pop-up för felmeddelanden
    function showMessage(title, text, type) {
        const msg = document.getElementById("cart-message");
        const msgTitle = document.getElementById("cart-message-title");
        const msgText = document.getElementById("cart-message-text");

        if (!msg || !msgTitle || !msgText) {
            console.error("Popup elements missing in HTML");
            return;
        }

        msgTitle.textContent = title;
        msgText.textContent = text;

        msg.classList.remove("error", "success");
        msg.classList.add(type);

        msg.style.display = "block";
    }

    // Stäng popup
    window.closeMessage = function () {
        document.getElementById("cart-message").style.display = "none";
    };

    // Uppdatera cart count badge
    function updateCartCount() {
        const badge = document.getElementById("cart-count");
        if (!badge) return;

        const total = Object.values(cart).reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);

        badge.textContent = total;
    }

    // Betala cart
    window.payCart = function() {

        if (Object.keys(cart).length === 0) {
            showMessage("Empty cart","Your cart is empty!","error");
            return;
        }

        const balance = 500; // test-saldo

        const total = Object.values(cart).reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        if (total > balance) {
            showMessage("Payment declined", "Insufficient funds. Please edit cart or update balance.","error");
            return;
        }

        // Här kan du t.ex. skicka ordern till server eller visa bekräftelse
        showMessage("Payment successful!", `Total: ${total} kr`,"success");
        
        // Tömmer varukorgen
        cart = {};
        localStorage.setItem("cart", JSON.stringify(cart));

        renderCart();
        updateCartCount();
    };

    function save() {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }

    renderCart();
    updateCartCount();

});