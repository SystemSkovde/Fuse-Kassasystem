function docReady(fn) {
if (document.readyState === "complete" || document.readyState === "interactive") {
setTimeout(fn, 1);
} else {
document.addEventListener("DOMContentLoaded", fn);
}
}

docReady(function () {

let products = [];

// HÄMTA DATA
fetch("dilara.php")
    .then(res => res.json())
    .then(data => {

        products = data.products;

        fillDropdowns();
        renderProducts(products);
    });


// FYLL DROPDOWNS
function fillDropdowns() {

    const categorySelect = document.getElementById("Category");
    const subCategorySelect = document.getElementById("SubCategory");

    categorySelect.innerHTML = `<option value="">Choose category</option>`;
    subCategorySelect.innerHTML = `<option value="">Choose subcategory</option>`;

    const categories = [...new Set(products.map(p => p.Category))];
    const subCategories = [...new Set(products.map(p => p.SubCategory))];

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


// VISA PRODUKTER
function renderProducts(list) {

    const div = document.getElementById("Inventory");

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

    list.forEach(item => {

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

    div.innerHTML = html;
}

});