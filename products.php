<?php
$conn = new mysqli("localhost", "root", "", "Fuse");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM Products";
$result = $conn->query($sql);

$products = [];

while($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);

$conn->close();
?>