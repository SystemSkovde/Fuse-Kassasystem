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


$response = [];


$sql = "SELECT * FROM Products";
$stmt = $pdo->query($sql);
$response['products'] = $stmt->fetchAll();


$Category = $_POST['Category'] ?? null;
$SubCategory = $_POST['SubCategory'] ?? null;

if ($Category !== null && $SubCategory !== null) {
    $sql = "SELECT * FROM Products 
            WHERE Category = :Category 
            AND SubCategory = :SubCategory";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':Category' => $Category,
        ':SubCategory' => $SubCategory
    ]);
    $response['products'] = $stmt->fetchAll();

}
else if ($Category !== null) {
    // ONLY CATEGORY
    $sql = "SELECT * FROM Products 
            WHERE Category = :Category";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':Category' => $Category
    ]);
    $response['products'] = $stmt->fetchAll();

}
else if  ($SubCategory !== null) {
    // ONLY CATEGORY
    $sql = "SELECT * FROM Products 
            WHERE SubCategory = :SubCategory";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':SubCategory' => $SubCategory
    ]);
    $response['products'] = $stmt->fetchAll();
 }

?>