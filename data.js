fetch("data.php")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    showProducts(data);
  });

  function showProducts(products) {
  const container = document.getElementById("product-list");

  products.forEach(product => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${product.Name}</h3>
      <p>Pris: ${product.Price} kr</p>
    `;
    container.appendChild(div);
  });
}