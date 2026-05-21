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

    if (!data.user) {
        alert(data.error || "Login failed");
        return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accounts", JSON.stringify(data.accounts || []));

    const user = data.user;

    window.location.href =
        user.role === "admin"
            ? "AdminHem.html"
            : "Hem.html";
})
    .catch(err => console.error(err));
});