function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {

    const resultContainer = document.getElementById("qr-reader-results");

    let lastScanTime = 0;
    const scanCooldown = 2000; // 2 sekunder mellan scans

    const materials = {
        "123456789": {
            category: "Wooden plank",
            price: "50"
        },
        "987654321": {
            category: "Steel bar",
            price: "120"
        },
        "555666777": {
            category: "Plastic roll",
            price: "30"
        }
        
    };


    
 const html5QrCode = new Html5Qrcode("qr-reader");

html5QrCode.start(
    { facingMode: "environment" },
    {
        fps: 10,
        qrbox: { width: 250, height: 400 }
    },
    onScanSuccess
);

    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    function updateCartCount() {
    let total = 0;

    Object.values(cart).forEach(item => {
        total += item.quantity;
    });

    const countEl = document.getElementById("cart-count");
    if (countEl) {
        countEl.textContent = total;
    }
}

    function onScanSuccess(decodedText) {

        const now = Date.now();

        // Stoppar för snabb scanning
        if (now - lastScanTime < scanCooldown) {
            return;
        }

        lastScanTime = now;

        if (materials[decodedText]) {

            const material = materials[decodedText];

            if (cart[decodedText]) {
                cart[decodedText].quantity += 1;
            } else {
                cart[decodedText] = {
                    code: decodedText,
                    category: material.category || material.name,
                    price: parseInt(material.price),
                    quantity: 1,
                    pot: "personal", // standard
                    accountId: null
                };
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();

            resultContainer.innerHTML = `
                <h3>${material.category} added to cart!</h3>
            `;

        } else {
            resultContainer.innerHTML = `
                <h3>Okänd kod</h3>
                <p>${decodedText}</p>
            `;
        }
    }

    function onScanError() {}

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    updateCartCount();

});