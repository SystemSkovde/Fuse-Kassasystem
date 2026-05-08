function docReady(fn) {
if (document.readyState === "complete" || document.readyState === "interactive") {
setTimeout(fn, 1);
} else {
document.addEventListener("DOMContentLoaded", fn);
}
}

docReady(function () {
    document.querySelector("form")?.addEventListener("submit", function (e) {
    e.preventDefault();
});
   let products = {};

fetch("data.php")
    .then(res => res.json())
    .then(data => {

        data.products.forEach(p => {
           products[p.BarCode] = p;  
        });

        initScanner();
    });

  function RenderProducts() {
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
                    <th>Name</th>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Price</th>
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
                    <!-- Account selector (visar balance) -->
                    <select onchange="changeAccount('${item.code}', this.value)">
                        <option value="">Select account</option>
                        ${accounts.map(acc => `
                            <option value="${acc.AccountName}" 
                                ${item.accountId === acc.AccountName ? "selected" : ""}>
                                ${acc.AccountName} (${acc.Balance} kr)
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



});