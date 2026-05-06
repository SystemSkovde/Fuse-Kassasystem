
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
const wrapC = document.querySelector(".wrap-c");
const wrapO = document.querySelector("#o-wrap");

const resultContainer = document.getElementById("qr-reader-results");

let cart = JSON.parse(localStorage.getItem("cart")) || {};
let currentMaterial = null;
let currentCode = null;




 const html5QrCode = new Html5Qrcode("qr-reader");

html5QrCode.start(
    { facingMode: "environment" },
    {
        fps: 10,
        qrbox: { width: 550, height: 400 }
    },
    onScanSuccess
);


function onScanSuccess(decodedText) {

    decodedText = decodedText.trim();

    if (!products[decodedText]) return;
    const material = products[decodedText];

    currentMaterial = material;
    currentCode = decodedText;

    // Uppdatera UI
    document.getElementById("material-name").textContent = material.Name;
    document.getElementById("material-price").textContent = material.Price + " kr";

    // Visa popup
    wrapC.classList.add("show");
}

function onScanError(errorMessage) {
    // Ignorera
}


// ===== ADD TO CART =====
document.getElementById("add-to-cart").addEventListener("click", function () {

 if (!currentMaterial) return;

    const quantity = parseInt(document.getElementById("amount").value);

    if (cart[currentCode]) {
        cart[currentCode].quantity += quantity;
    } else {
        cart[currentCode] = {
            code: currentCode,
            name: currentMaterial.Name,
            price: currentMaterial.Price,
            quantity: quantity
        };
    }

    updateCart();

    document.getElementById("amount").value = "1";
 
    const addedText = document.getElementById("Added");
    addedText.textContent = `${quantity} ${currentMaterial.Name} added to cart!`;

    wrapC.classList.remove("show");
    wrapO.classList.add("show");

    setTimeout(() => {
       wrapO.classList.remove("show");
   }, 2000);

});

document.getElementById("close-btn").addEventListener("click", () => {
    wrapC.classList.remove("show");
});

wrapO.addEventListener("click", () => {
    wrapO.classList.remove("show");
});

function updateCart() {
    let totalQuantity = Object.values(cart)
        .reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById("cart-count").textContent = totalQuantity;

    localStorage.setItem("cart", JSON.stringify(cart));
}


function loadCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || {};
    updateCart();
}

// ===== RESET SCANNER (optional) =====
window.startScanner = function () {
    resultContainer.innerHTML = "";
};
window.addEventListener("focus", function () {
    cart = JSON.parse(localStorage.getItem("cart")) || {};
    updateCartCount();
});

window.addEventListener("storage", function (e) {
    if (e.key === "cart") {
        cart = JSON.parse(localStorage.getItem("cart")) || {};
        updateCartCount();
    }
});

loadCart();
});