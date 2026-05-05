fetch("data.php")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    showUser(data);
  });

  function showUser(User) {
  const container = document.getElementById("User-list");

  products.forEach(product => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${User.Cid}</h3>
      <p>${product.Name}</p>
    `;
    container.appendChild(div);
  });
}