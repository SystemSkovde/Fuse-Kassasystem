let products = [];
let isEditMode = false;

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {

    fetch("data.php")
        .then(res => res.json())
        .then(data => {
            products = data.products || [];
            renderProducts(products);
            fillDropdowns();
        })
        .catch(err => console.error("Fetch-fel:", err));

    document.getElementById("add-form")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const nr = document.getElementById("article_id")?.value;
        const name = document.getElementById("item-name")?.value;
        const category = document.getElementById("category1")?.value;
        const subcategory = document.getElementById("subcategory1")?.value;
        const stock = document.getElementById("stock")?.value;
        const price = document.getElementById("price")?.value;

        if (!name || !category || !subcategory || !stock || !price) {
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
                if (data.success) location.reload();
                else alert("Could not add item");
            })
            .catch(err => console.error("Error:", err));
    });

    document.getElementById("Search")?.addEventListener("input", function () {
        const searchValue = this.value;
        fetch("data.php?search=" + encodeURIComponent(searchValue))
            .then(res => res.json())
            .then(data => {
                products = data.products || [];
                renderProducts(products);
            });
    });

    document.getElementById("editBtn")?.addEventListener("click", () => {
        isEditMode = !isEditMode;
        renderProducts(products);
    });

    document.getElementById("Inventory")?.addEventListener("change", (e) => {
        if (e.target.tagName === "INPUT") {
            fetch("data.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    barcode: e.target.dataset.barcode,
                    field: e.target.dataset.field,
                    value: e.target.value
                })
            });
        }
    });

});

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

    categorySelect.addEventListener("change", filter);
    subCategorySelect.addEventListener("change", filter);
}

function filter() {
    const selectedCategory = document.getElementById("Category").value;
    const selectedSubCategory = document.getElementById("SubCategory").value;

    let filtered = [...products];
    if (selectedCategory !== "") {
        filtered = filtered.filter(p => p.Category === selectedCategory);
    }
    if (selectedSubCategory !== "") {
        filtered = filtered.filter(p => p.SubCategory === selectedSubCategory);
    }
    renderProducts(filtered);
}

function renderProducts(list) {
    const inventoryDiv = document.getElementById("Inventory");

    let html = `
    <table class="cart-table">
        <thead>
            <tr>
                <th>Article ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>SubCategory</th>
                <th>Stock</th>
                <th>Price</th>
                 <th>Description</th>
                <th>Image</th>
            </tr>
        </thead>
        <tbody>
    `;

    list.forEach(item => {
        html += `
        <tr>
            <td>${item.article_id}</td>
          <td>
                    ${isEditMode
                ? `<input value="${item.Name}" data-barcode="${item.BarCode}" data-field="Name">`
                : item.Name}
                </td>

                <td>
                    ${isEditMode
                ? `<input value="${item.Category}" data-barcode="${item.BarCode}" data-field="Category">`
                : item.Category}
                </td>

                <td>
                    ${isEditMode
                ? `<input value="${item.SubCategory}" data-barcode="${item.BarCode}" data-field="SubCategory">`
                : item.SubCategory}
                </td>

                <td>
                    ${isEditMode
                ? `<input type="number" value="${item.Stock}" data-barcode="${item.BarCode}" data-field="Stock">`
                : item.Stock}
                </td>

                <td>
                    ${isEditMode
                ? `<input type="number" value="${item.Price}" data-barcode="${item.BarCode}" data-field="Price">`
                : item.Price}
                </td>
                 <td>${item.Description}</td>
                 <td>${item.Img_adress}</td>
        </tr>
        `;
    });

    html += `</tbody></table>`;
    inventoryDiv.innerHTML = html;
}