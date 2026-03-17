document.addEventListener("DOMContentLoaded", function () {

    const cartDiv = document.getElementById("cart");

    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    let html = "<h3>Varukorg</h3>";

    Object.values(cart).forEach(item => {

        html += `
        <div class="cart-item">
            <p><strong>${item.name}</strong></p>
            <p>Typ: ${item.type}</p>
            <p>Plats: ${item.location}</p>
            <p>Antal: ${item.quantity}</p>
        </div>
        `;
    });

    cartDiv.innerHTML = html;

});