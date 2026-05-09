fetch("dilara.php")
  .then(response => response.json())
  .then(data => {

    allProducts = data.products;
    allSubcategories = data.subcategories;

    data.categories.forEach(category => {

      const option = document.createElement("option");

      option.value = category.id;
      option.textContent = category.name;

      categorySelect.appendChild(option);
    });

    showProducts(allProducts);
  });