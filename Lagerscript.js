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
});