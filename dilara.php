<?php

$conn = new mysqli(
    "localhost",
    "root",
    "",
    "database_name"
);



// Categories
$categories = [];

$result = $conn->query("SELECT * FROM categories");

while($row = $result->fetch_assoc()) {
    $categories[] = $row;
}



// Subcategories
$subcategories = [];

$result = $conn->query("SELECT * FROM subcategories");

while($row = $result->fetch_assoc()) {
    $subcategories[] = $row;
}



// Products
$products = [];

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

$result = $conn->query($sql);

while($row = $result->fetch_assoc()) {
    $products[] = $row;
}



// Returnera JSON
echo json_encode([
    "categories" => $categories,
    "subcategories" => $subcategories,
    "products" => $products
]);

?>