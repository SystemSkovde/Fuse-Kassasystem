
function docReady(fn) {
if (document.readyState === "complete" || document.readyState === "interactive") {
setTimeout(fn, 1);
} else {
document.addEventListener("DOMContentLoaded", fn);
}
}
window.addEventListener("resize", () => {
    location.reload();
});

docReady(function () {

const wrapC = document.querySelector(".wrap-c");
const wrapO = document.querySelector("#o-wrap");

const resultContainer = document.getElementById("qr-reader-results");

let cart = {};
let currentMaterial = null;
let currentCode = null;

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
        Account: "Kurs1"
    }
};

// ===== QR SCANNER =====
const html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader",
    {
        fps: 10,
        qrbox: { 
            width: 328, 
            height: 388 
        }
    }
);

function onScanSuccess(decodedText) {

    decodedText = decodedText.trim();

    if (!materials[decodedText]) return;

    const material = materials[decodedText];

    currentMaterial = material;
    currentCode = decodedText;

    // Uppdatera UI
    document.getElementById("material-name").textContent = material.Category;
    document.getElementById("material-price").textContent = material.Price + " kr";

    // Visa popup
    wrapC.classList.add("show");
}

function onScanError(errorMessage) {
    // Ignorera
}

html5QrcodeScanner.render(onScanSuccess, onScanError);

// ===== ADD TO CART =====
document.getElementById("add-to-cart").addEventListener("click", function () {

 if (!currentMaterial) return;

    const quantity = parseInt(document.getElementById("amount").value);

    if (cart[currentCode]) {
        cart[currentCode].quantity += quantity;
    } else {
        cart[currentCode] = {
            code: currentCode,
            name: currentMaterial.Category,
            price: currentMaterial.Price,
            account: currentMaterial.Account,
            quantity: quantity
        };
    }

    updateCart();

    document.getElementById("amount").value = "1";
 
    const addedText = document.getElementById("Added");
    addedText.textContent = `${quantity} ${currentMaterial.Category} added to cart!`;

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

// ===== RESET SCANNER (optional) =====
window.startScanner = function () {
    resultContainer.innerHTML = "";
};

});