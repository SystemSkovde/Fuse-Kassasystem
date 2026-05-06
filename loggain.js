document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const cid = document.getElementById("cid").value;
    const pass = document.getElementById("pass").value;

    fetch("data.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            cid: cid,
            password: pass
        })
    })
    .then(res => res.json())
    .then(data => {

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("accounts", JSON.stringify(data.accounts));
        localStorage.setItem("products", JSON.stringify(data.products));

        window.location.href = "Hem.html";
    })
    .catch(err => console.error(err));
});