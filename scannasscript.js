
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

   wrapC.addEventListener("click", function (e) {
    if (e.target.closest(".choice")) {
        wrapC.classList.remove("show");
        wrapO.classList.add("show");
    }
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
            Category: "Trä",
            Price: "20",
            Account: "Personal"
        },
        "987654321": {
            Category: "Stål",
            Price: "40",
            Account: "Personal"
        },
        "555666777": {
            Category: "Plast",
            Price: "50",
            Account: "Personal"
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

        decodedText = decodedText.trim();

if (cart[decodedText]) return; // redan i cart → ignorera

        console.log("Scan result:", decodedText);

        // Kontrollera om material finns
        if (materials[decodedText]) {

            const material = materials[decodedText];

       if (!cart[decodedText]) {
   cart[decodedText] = {
    code: decodedText,
    name: material.Category,
    price: material.Price,
    account: material.Account,
    quantity: 1};
    } 
            updateCart();

         resultContainer.innerHTML = `
    <p>Material tillagt i varukorg ${material.Category}</p>`;

        } 
        document.querySelector(".wrap-c").classList.add("show");
    }

    function updateCart() {
    const cartDiv = document.getElementById("cart");
    cartDiv.innerHTML = ""; // viktigt!

    let totalQuantity = Object.values(cart)
        .reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById("cart-count").textContent = totalQuantity;

    localStorage.setItem("cart", JSON.stringify(cart));
}

    function onScanError(errorMessage) {
        // Ignorerar fel
    }

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    // Starta scanner igen
    window.startScanner = function () {
        resultContainer.innerHTML = "";
        lastResult = null;
    };
});