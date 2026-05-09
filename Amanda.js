let products = {};
let isEditMode = false;

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {

    const inventory = document.getElementById("Inventory");
    const editBtn = document.getElementById("editBtn");

    // Stop form reload
    document.querySelector("form")?.addEventListener("submit", function (e) {
        e.preventDefault();
    });

    const searchInput = document.getElementById("Search");

searchInput?.addEventListener("input", function () {
    const searchValue = searchInput.value;

    fetch("Amanda.php?search=" + encodeURIComponent(searchValue))
        .then(res => res.json())
        .then(data => {

            products = {}; // reset

            data.products.forEach(p => {
                products[p.BarCode] = p;
            });

            RenderProducts();
        });
});

    // EDIT MODE BUTTON
    editBtn?.addEventListener("click", () => {
        isEditMode = !isEditMode;
        RenderProducts();
    });

    // CHANGE EVENT (event delegation)
    inventory?.addEventListener("change", (e) => {
        if (e.target.tagName === "INPUT") {
            const barcode = e.target.dataset.barcode;
            const field = e.target.dataset.field;
            const value = e.target.value; 

            fetch("Amanda.php", {
                method: "POST",
                headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        barcode: barcode,
        field: field,
        value: value
    })
});
        }
    });

    // FETCH DATA
    fetch("data.php")
        .then(res => res.json())
        .then(data => {

            data.products.forEach(p => {
                products[p.BarCode] = p;
            });

            RenderProducts();
        });

    // RENDER FUNCTION
    function RenderProducts() {

        const inventoryDiv = document.getElementById("Inventory");

        if (!inventoryDiv) return;

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
            </tr>
            `;
        });

        html += `</tbody></table>`;

        inventoryDiv.innerHTML = html;
    }
});