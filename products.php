<?php
  $PDO = new PDO("mysql:dbname=Fuse; host=127.0.0.1", "dbftg", "Myrlejon2026!");
  $PDO->setAttribute(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$sql = "SELECT * FROM Products";
$stmt = $pdo->query($sql);

$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($products);
?>