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

    let cart = {};
    function onScanSuccess(decodedText, decodedResult) {

        if (decodedText === lastResult) {
            return;
        }

        lastResult = decodedText;

        console.log("Scan result:", decodedText);

        // Kontrollera om material finns
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

            updateCart();

            resultContainer.innerHTML = `
                <h3>Material tillagt i varukorg</h3>
                <p>${material.name}</p>
            `;

        } else {

            resultContainer.innerHTML = `
                <h3>Okänd kod</h3>
                <p>${decodedText}</p>
                <button onclick="startScanner()">Scanna igen</button>
            `;
        }

    }

    function updateCart() {

    const cartDiv = document.getElementById("cart");

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

window.changeQuantity = function(code, quantity) {

    cart[code].quantity = parseInt(quantity);

    updateCart();
}

    cartDiv.innerHTML = html;
}

    function onScanError(errorMessage) {
        // Ignorerar fel
    }

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    // Starta scanner igen
    window.startScanner = function () {
        resultContainer.innerHTML = "";
        lastResult = null;

        html5QrcodeScanner.render(onScanSuccess, onScanError);
    };

});