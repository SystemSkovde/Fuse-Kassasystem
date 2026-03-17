document.addEventListener("DOMContentLoaded", function () {

    const cartDiv = document.getElementById("cart");
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    function renderCart() {
        let html = `
        <h3>Shopping Cart</h3>

        <table class="cart-table">
            <thead>
                <tr>
                    <th>Namn</th>
                    <th>Typ</th>
                    <th>Plats</th>
                    <th>Antal</th>
                    <th>Pott</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
        `;

        Object.values(cart).forEach(item => {

            html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.location}</td>

                <td>
                    <select onchange="changeQuantity('${item.code}', this.value)">
                        ${createOptions(item.quantity)}
                    </select>
                </td>

                <td>
                    <select onchange="changePot('${item.code}', this.value)">
                        <option value="personlig" ${item.pot === "personlig" ? "selected" : ""}>Personlig</option>
                        <option value="forskning" ${item.pot === "forskning" ? "selected" : ""}>Forskning</option>
                        <option value="kurs" ${item.pot === "kurs" ? "selected" : ""}>Kurs</option>
                    </select>
                </td>

                <td>
                    <button onclick="removeItem('${item.code}')">❌</button>
                </td>
            </tr>
            `;
        });

        html += `
            </tbody>
        </table>
        `;

    cartDiv.innerHTML = html;
}

    function createOptions(selected) {
        let options = "";
        for (let i = 1; i <= 20; i++) {
            options += `<option value="${i}" ${i == selected ? "selected" : ""}>${i}</option>`;
        }
        return options;
    }

    // 🔧 Ändra antal
    window.changeQuantity = function (code, quantity) {
        cart[code].quantity = parseInt(quantity);
        save();
    };

    // 🔧 Ändra pott
    window.changePot = function (code, pot) {
        cart[code].pot = pot;
        save();
    };

    // 🔧 Ta bort produkt
    window.removeItem = function (code) {
        delete cart[code];
        save();
    };

    function save() {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }

    renderCart();

});