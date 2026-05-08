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
        RenderProducts();
        initScanner();
    });

  function RenderProducts() {
        const IventoryDiv = document.getElementById("Inventory");

        let html = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>SubCategory</th>
                    <th>Stock</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
        `;

        Object.values(products).forEach(item => {
            html += `
            <tr>
                <td>${item.Name}</td> 
                <td>${item.Category}</td> 
                <td>${item.SubCategory}</td> 
                <td>${item.Stock}</td> 
                <td>${item.Price}</td> 
            </tr>
            `;
        });

        html += `
            </tbody>
        </table>`;

        IventoryDiv.innerHTML = html;
        updateCartCount();
    }

});