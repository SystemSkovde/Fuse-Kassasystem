
function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } 
    else{
        document.addEventListener("DOMContentLoaded", fn);
    }
}



docReady(function () {
     const wrapC = document.querySelector(".wrap-c");
    const wrapO = document.querySelector("#o-wrap");

    wrapC.addEventListener("click", function () {

        wrapC.classList.remove("show");
        wrapO.classList.add("show");

    });
    document.querySelector("#o-wrap").addEventListener("submit", function(e){
    e.preventDefault(); // stoppar att sidan laddas om
    this.classList.remove("show"); // stänger formuläret
});

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

       if (!cart[decodedText]) {
    cart[decodedText] = {
        code: decodedText,
        name: material.name,
        type: material.type,
        location: material.location,
        quantity: 1
    };
    updateCart();
} 

            updateCart();

            resultContainer.innerHTML = `
                <p>Material tillagt i varukorg ${material.name}</p>
            `;

        } 
        document.querySelector(".wrap-c").classList.add("show");
    }

    function updateCart() {
    const cartDiv = document.getElementById("cart");
    cartDiv.innerHTML = ""; 

    // Räkna totalt antal varor
let totalQuantity = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);



    
    
// Visa total i cirkeln
document.getElementById("cart-count").textContent = totalQuantity;
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