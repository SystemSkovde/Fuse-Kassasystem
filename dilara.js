const categorySelect = document.getElementById("category");
const subcategorySelect = document.getElementById("subcategory");
const productsDiv = document.getElementById("products");
const searchInput = document.getElementById("search");

let allProducts = [];
let allSubcategories = [];

// Hämta data från PHP
fetch("products.php")
  .then(response => response.json())
  .then(data => {

    allProducts = data.products;
    allSubcategories = data.subcategories;

    // Lägg till kategorier
    data.categories.forEach(category => {

      const option = document.createElement("option");

      option.value = category.id;
      option.textContent = category.name;

      categorySelect.appendChild(option);
    });

    showProducts(allProducts);
  });


// När kategori ändras
categorySelect.addEventListener("change", () => {

  const categoryId = categorySelect.value;

  subcategorySelect.innerHTML =
    '<option value="">Choose subcategory</option>';

  // Visa bara rätt subcategories
  allSubcategories.forEach(sub => {

    if (sub.category_id == categoryId) {

      const option = document.createElement("option");

      option.value = sub.id;
      option.textContent = sub.name;

      subcategorySelect.appendChild(option);
    }
  });

  filterProducts();
});


// När subcategory ändras
subcategorySelect.addEventListener("change", filterProducts);

// Search
searchInput.addEventListener("input", filterProducts);


// Filtrering
function filterProducts() {

  const categoryId = categorySelect.value;
  const subcategoryId = subcategorySelect.value;
  const search = searchInput.value.toLowerCase();

  let filtered = allProducts.filter(product => {

    let matchSearch =
      product.name.toLowerCase().includes(search);

    let matchCategory =
      !categoryId || product.category_id == categoryId;

    let matchSubcategory =
      !subcategoryId || product.subcategory_id == subcategoryId;

    return matchSearch &&
           matchCategory &&
           matchSubcategory;
  });

  showProducts(filtered);
}


// Visa produkter
function showProducts(products) {

  productsDiv.innerHTML = "";

  products.forEach(product => {

    productsDiv.innerHTML += `
      <div class="product">
        <h3>${product.name}</h3>

        <p>Subcategory:
        ${product.subcategory}</p>

        <p>Stock:
        ${product.stock}</p>
      </div>
    `;
  });
}