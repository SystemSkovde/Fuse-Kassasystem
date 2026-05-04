document.addEventListener("DOMContentLoaded", function () {

    const cartDiv = document.getElementById("cart");
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    const courses = [
        { id: "course1", name: "Web Development" },
        { id: "course2", name: "UX Design" }
    ];

    const groups = [
        { id: "group1", name: "Project A" },
        { id: "group2", name: "Lab Team" }
    ];

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
                <td>${item.category}</td> <!-- Category -->
                <td>${item.price}</td> <!-- Price -->

                <td>
                    <select onchange="changeQuantity('${item.code}', this.value)">
                        ${createOptions(item.quantity)}
                    </select>
                </td>

                <td>
                    <select onchange="changePot('${item.code}', this.value)">
                        <option value="personal" ${item.pot === "personal" ? "selected" : ""}>Personal</option>
                        <option value="research" ${item.pot === "research" ? "selected" : ""}>Research</option>
                        <option value="course" ${item.pot === "course" ? "selected" : ""}>Course</option>
                        <option value="group" ${item.pot === "group" ? "selected" : ""}>Group</option>
                    </select>

                    ${renderAccountSelector(item)}
                </td>

                <td>
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

    function renderAccountSelector(item) {
    if (item.pot === "course") {
        return `
            <select onchange="changeAccount('${item.code}', this.value)">
                <option value="">Select course</option>
                ${courses.map(c => `
                    <option value="${c.id}" ${item.accountId === c.id ? "selected" : ""}>
                        ${c.name}
                    </option>
                `).join("")}
            </select>
        `;
    }

    if (item.pot === "group") {
        return `
            <select onchange="changeAccount('${item.code}', this.value)">
                <option value="">Select group</option>
                ${groups.map(g => `
                    <option value="${g.id}" ${item.accountId === g.id ? "selected" : ""}>
                        ${g.name}
                    </option>
                `).join("")}
            </select>
        `;
    }

    return "";
}
    // Pop-up för felmeddelanden
    function showMessage(text, type) {
        const msg = document.getElementById("cart-message");
        const msgTitle = document.getElementById("cart-message-title");
        const msgText = document.getElementById("cart-message-text");

        msgTitle.textContent = title;
        msgText.textContent = text;

        msg.classList.remove("error", "success");
        msg.classList.add(type);

        msg.style.display = "block";
    }

    window.closeMessage = function () {
        document.getElementById("cart-message").style.display = "none";
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

    window.changeAccount = function (code, accountId) {
        cart[code].accountId = accountId;
        save();
    };

    // Ta bort produkt
    window.removeItem = function (code) {
        delete cart[code];
        save();
    };

    window.payCart = function() {
    if (Object.keys(cart).length === 0) {
        showMessage("Your cart is empty!","error");
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
    showMessage("Payment complete!", `Total: ${total} kr`,"success");
    
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