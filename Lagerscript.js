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

    fetch("data.php", {
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

                products = {};
                productList = data.products;

                data.products.forEach(p => {
                    products[p.BarCode] = p;
                });

                RenderProducts(productList);
                fillDropdowns();
            });
        // FYLL DROPDOWNS
function fillDropdowns() {

    const categorySelect = document.getElementById("Category");
    const subCategorySelect = document.getElementById("SubCategory");

    categorySelect.innerHTML = `<option value="">Choose category</option>`;
    subCategorySelect.innerHTML = `<option value="">Choose subcategory</option>`;

    const categories = [...new Set(Object.values(products).map(p => p.Category))];
const subCategories = [...new Set(Object.values(products).map(p => p.SubCategory))];

    categories.forEach(c => {
        categorySelect.innerHTML += `<option value="${c}">${c}</option>`;
    });

    subCategories.forEach(sc => {
        subCategorySelect.innerHTML += `<option value="${sc}">${sc}</option>`;
    });

    // EVENT LISTENERS
    categorySelect.addEventListener("change", filter);
    subCategorySelect.addEventListener("change", filter);
}


// FILTER LOGIK
function filter() {

    const selectedCategory = document.getElementById("Category").value;
    const selectedSubCategory = document.getElementById("SubCategory").value;

    let filtered = products;

    if (selectedCategory !== "") {
        filtered = filtered.filter(p =>
            p.Category === selectedCategory
        );
    }

    if (selectedSubCategory !== "") {
        filtered = filtered.filter(p =>
            p.SubCategory === selectedSubCategory
        );
    }

    renderProducts(filtered);
}

  function RenderProducts(list) {
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

       list.forEach(item => {
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
    }

});