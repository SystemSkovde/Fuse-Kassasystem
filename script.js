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
    const scanCooldown = 2000; // ⏱️ 2 sekunder mellan scans

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

    const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250
    });

    let cart = JSON.parse(localStorage.getItem("cart")) || {};

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
                    name: material.name,
                    type: material.type,
                    location: material.location,
                    quantity: 1,
                    pot: "personlig" // standard
                };
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            resultContainer.innerHTML = `
                <h3>${material.name} tillagd</h3>
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

});