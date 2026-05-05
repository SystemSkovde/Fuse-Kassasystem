<?php
$pdo = new PDO(
            'mysql:dbname=Fuse;host=projekt.webug.se;charset=utf8mb4',
            'dbftg',
            'Myrlejon2026!',
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );

// Sätt attribut korrekt
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$sql = "SELECT * FROM Products";
$stmt = $pdo->query($sql);

$products = $stmt->fetchAll();

echo json_encode($products);


$cid = $_POST['cid'] ?? null;
$password = $_POST['password'] ?? null;

if ($cid !== null && $password !== null) {
    $sql = "SELECT * FROM Users WHERE cid = :cid";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':cid' => $cid]);

    $user = $stmt->fetchAll();

    echo json_encode($user);
}

if ($cid !== null && $password !== null) {
    $sql = "SELECT * FROM Accounts WHERE Cid = :cid";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':cid' => $cid]);

    $accounts = $stmt->fetchAll();

    echo json_encode($accounts);
}

?>