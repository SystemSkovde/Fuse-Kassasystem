function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {

    let products = {};

    document.getElementById("add-form")?.addEventListener("submit", function (e) {
        e.preventDefault();

        fetch("hedvigdata.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                action: "insert",
                name: document.getElementById("name").value,
                category: document.getElementById("category").value,
                subcategory: document.getElementById("subcategory").value,
                stock: document.getElementById("stock").value,
                price: document.getElementById("price").value,
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.success) {
                location.reload();
            } else {
                alert("Could not add item");
            }
        });
    });

    fetch("hedvigdata.php")
        .then(res => res.json())
        .then(data => {
            data.products.forEach(p => {
                products[p.BarCode] = p;
            });

            RenderProducts();
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
    }

});