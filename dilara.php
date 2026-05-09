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
    $sql = "SELECT * FROM Products WHERE Category = :Category";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':Category' => $Category]);

    $response['user'] = $stmt->fetch();


       $sql = "SELECT * FROM Accounts WHERE Cid = :cid";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':cid' => $cid]);

    $response['accounts'] = $stmt->fetchAll();

}
echo json_encode($response);

?>