document.addEventListener("DOMContentLoaded", function () {

    const cartDiv = document.getElementById("cart");
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    function renderCart() {
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
                        <option value="personl" ${item.pot === "personl" ? "selected" : ""}>Personl</option>
                        <option value="resaerch" ${item.pot === "reserch" ? "selected" : ""}>Research</option>
                        <option value="course" ${item.pot === "course" ? "selected" : ""}>Course</option>
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