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

$data = json_decode(file_get_contents("php://input"), true);
$cid = $data['cid'];
$password = $data['password'];

$sql2 = "SELECT * FROM Users where cid = :cid";
$stmt = $pdo->prepare($sql2);
$stmt->execute([':cid' => $cid]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode($user);

?>