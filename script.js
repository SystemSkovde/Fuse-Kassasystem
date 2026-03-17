function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {

    const resultContainer = document.getElementById("qr-reader-results");

    let lastResult = null;

    // ===== MATERIAL DATABAS =====
    const materials = {
        "123456789": {
            name: "Trä",
            type: "Byggmaterial",
            location: "Lager A"
        },
        "987654321": {
            name: "Stål",
            type: "Metall",
            location: "Lager B"
        },
        "555666777": {
            name: "Plast",
            type: "Polymer",
            location: "Lager C"
        }
    };

    // ===== QR SCANNER =====
    const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
            fps: 10,
            qrbox: 250
        }
    );

    // ===== CART (hämtas från localStorage) =====
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    function onScanSuccess(decodedText, decodedResult) {

        // STOPPAR dubbelscan direkt
        if (decodedText === lastResult) {
            return;
        }

        lastResult = decodedText;

        // Tillåt samma kod igen efter 1.5 sek
        setTimeout(() => {
            lastResult = null;
        }, 1500);

        console.log("Scan result:", decodedText);

        if (materials[decodedText]) {

            const material = materials[decodedText];

            if (cart[decodedText]) {
                cart[decodedText].quantity += 1;
            } else {
                cart[decodedText] = {
                    code: decodedText,
                    name: material.name,
                    type: material.type,
                    location: material.location,
                    quantity: 1
                };
            }

            // ✅ SPARA ALLTID
            localStorage.setItem("cart", JSON.stringify(cart));

            updateCart();

            resultContainer.innerHTML = `
                <h3>${material.name} tillagd i varukorg</h3>
            `;

        } else {

            resultContainer.innerHTML = `
                <h3>Okänd kod</h3>
                <p>${decodedText}</p>
            `;
        }
    }

    function updateCart() {

        const cartDiv = document.getElementById("cart");
        if (!cartDiv) return; // om den inte finns

        let html = "<h3>Varukorg</h3>";

        Object.values(cart).forEach(item => {

            html += `
            <div class="cart-item">
                <span>${item.name}</span>

                <select onchange="changeQuantity('${item.code}', this.value)">
                    ${createOptions(item.quantity)}
                </select>
            </div>
            `;
        });

        cartDiv.innerHTML = html;
    }

    function createOptions(selected) {

        let options = "";

        for (let i = 1; i <= 20; i++) {
            options += `
            <option value="${i}" ${i == selected ? "selected" : ""}>
                ${i}
            </option>`;
        }

        return options;
    }

    // ✅ FIXAD
    window.changeQuantity = function (code, quantity) {

        cart[code].quantity = parseInt(quantity);

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCart();

        const item = cart[code];

        resultContainer.innerHTML = `
            <h3>Uppdaterad mängd</h3>
            <p>${item.name}</p>
        `;
    }

    window.goToCart = function () {
        window.location.href = "cartAlt2.html";
    }

    function onScanError(errorMessage) {
        // Ignorera
    }

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    // Starta om scanner (om du vill använda knapp senare)
    window.startScanner = function () {
        resultContainer.innerHTML = "";
        lastResult = null;
    };

    // Visa cart direkt om du har div
    updateCart();

});