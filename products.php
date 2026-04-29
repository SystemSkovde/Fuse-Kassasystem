<?php
$pdo = new PDO(
    "mysql:host=127.0.0.1;port=3306;dbname=your_db",
    "fuse_app",
    "fuse123"
);
// Sätt attribut korrekt
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$sql = "SELECT * FROM Products";
$stmt = $pdo->query($sql);

$products = $stmt->fetchAll();

echo json_encode($products);
?>