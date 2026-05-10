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
    document.getElementById("add-form")?.addEventListener("submit", function (e) {
        e.preventDefault();

        const nr = document.getElementById("nr")?.value;
        const name = document.getElementById("item-name")?.value;
        const category = document.getElementById("category1")?.value;
        const subcategory = document.getElementById("subcategory1")?.value;
        const stock = document.getElementById("stock")?.value;
        const price = document.getElementById("price")?.value;

        if (!nr || !name || !category || !subcategory || !stock || !price) {
            alert("Fill in all boxes!");
            return;
        }

    fetch("hedvigdata.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ action: "insert", nr, name, category, subcategory, stock, price })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            alert("Could not add item");
        }
    })
    .catch(err => console.error("Error:", err));
});

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
                    <th>Number</th>
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
                <td>${item.Nr}</td>
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