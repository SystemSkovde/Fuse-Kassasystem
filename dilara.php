<?php

// Databas-anslutning
$pdo = new PDO(
    'mysql:dbname=Fuse;host=projekt.webug.se;charset=utf8mb4',
    'dbftg',
    'Myrlejon2026!',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// Sätt attribut korrekt
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);



// Categories
$sql = "SELECT * FROM categories";
$stmt = $pdo->query($sql);
$categories = $stmt->fetchAll();



// Subcategories
$sql = "SELECT * FROM subcategories";
$stmt = $pdo->query($sql);
$subcategories = $stmt->fetchAll();



// Products
$sql = "
SELECT
products.id,
products.name,
products.stock,
products.category_id,
products.subcategory_id,
subcategories.name AS subcategory

FROM products

JOIN subcategories
ON products.subcategory_id = subcategories.id
";

$stmt = $pdo->query($sql);
$products = $stmt->fetchAll();



// Returnera JSON
echo json_encode([
    "categories" => $categories,
    "subcategories" => $subcategories,
    "products" => $products
]);

?>