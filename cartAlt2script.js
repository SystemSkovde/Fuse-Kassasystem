document.addEventListener("DOMContentLoaded", function () {

    const cartDiv = document.getElementById("cart");
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    function renderCart() {

        let html = "<h3>Varukorg</h3>";

        Object.values(cart).forEach(item => {

            html += `
            <div class="cart-item">
                <p><strong>${item.name}</strong></p>
                <p>Typ: ${item.type}</p>
                <p>Plats: ${item.location}</p>

                <label>Antal:</label>
                <select onchange="changeQuantity('${item.code}', this.value)">
                    ${createOptions(item.quantity)}
                </select>

                <br><br>

                <label>Pott:</label>
                <select onchange="changePot('${item.code}', this.value)">
                    <option value="personlig" ${item.pot === "personlig" ? "selected" : ""}>Personlig</option>
                    <option value="forskning" ${item.pot === "forskning" ? "selected" : ""}>Forskning</option>
                    <option value="kurs" ${item.pot === "kurs" ? "selected" : ""}>Kurs</option>
                </select>

                <br><br>

                <button onclick="removeItem('${item.code}')">Ta bort</button>
                <hr>
            </div>
            `;
        });

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