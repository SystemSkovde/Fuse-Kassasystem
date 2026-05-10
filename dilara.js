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

fetch("dilara.php")
    .then(res => res.json())
    .then(data => {

        data.products.forEach(p => {
           products[p.BarCode] = p;
        });

        RenderProducts();
    });

function RenderProducts() {

const categorySelect = document.getElementById("category");
const subCategorySelect = document.getElementById("subcategory");


    const categories = new Set();
    const subCategories = new Set();

    Object.values(products).forEach(item => {

        categories.add(item.Category);

        subCategories.add(item.SubCategory);
    });



    // CATEGORY
    categories.forEach(category => {

        categorySelect.innerHTML += `
            <option value="${category}">
                ${category}
            </option>
        `;
    });



    // SUBCATEGORY
    subCategories.forEach(SubCategory => {

        subCategorySelect.innerHTML += `
            <option value="${SubCategory}">
                ${SubCategory}
            </option>
        `;
    });




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