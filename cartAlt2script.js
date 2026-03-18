document.addEventListener("DOMContentLoaded", function () {

    const cartDiv = document.getElementById("cart");
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

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
                    <th>Category</th>
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
                <td>${item.type}</td> <!-- Category -->
                <td>${item.price} <!-- Price -->

                <td>
                    <select onchange="changeQuantity('${item.code}', this.value)">
                        ${createOptions(item.quantity)}
                    </select>
                </td>

                <td>
                    <select onchange="changePot('${item.code}', this.value)">
                        <option value="personal" ${item.pot === "personal" ? "selected" : ""}>Personal</option>
                        <option value="resaerch" ${item.pot === "reserch" ? "selected" : ""}>Research</option>
                        <option value="course" ${item.pot === "course" ? "selected" : ""}>Course</option>
                    </select>
                </td>

                <td>
                    <button onclick="removeItem('${item.code}')">Delete</button>
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

    // Total kostnad
    function updateCartCount() {
        const badge = document.getElementById("cart-count");
        if (!badge) return;

        const total = Object.values(cart).reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);

        badge.textContent = total;
    }

    // Ändra antal
    window.changeQuantity = function (code, quantity) {
        cart[code].quantity = parseInt(quantity);
        save();
    };

    // Ändra pott
    window.changePot = function (code, pot) {
        cart[code].pot = pot;
        save();
    };

    // Ta bort produkt
    window.removeItem = function (code) {
        delete cart[code];
        save();
    };

    window.payCart = function() {
    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Här kan du t.ex. skicka ordern till server eller visa bekräftelse
    alert(`Payment complete! Total: ${Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0)} kr`);
    
    // Tömmer varukorgen
    cart = {};
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

    function save() {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }

    renderCart();
    updateCartCount();

});