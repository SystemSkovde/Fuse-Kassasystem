<?php
$pdo = new PDO(
    'mysql:dbname=Fuse;host=127.0.0.1;charset=utf8mb4',
    'dbftg',
    'Myrlejon2026!',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$sql = "SELECT * FROM Products";
$stmt = $pdo->query($sql);

$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($products);
?>