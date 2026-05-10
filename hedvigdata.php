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

if (isset($_POST['action']) && $_POST['action'] === 'insert') {

    $stmtMax = $pdo->query("SELECT MAX(BarCode) AS last_barcode FROM Products");
    $row = $stmtMax->fetch();

    $lastBarcode = $row['last_barcode'];

    if (!$lastBarcode) {
        $newBarcode = 100001;
    } else {
        $newBarcode = (int)$lastBarcode + 1;
    }
    

    $sql = "INSERT INTO Products (Nr ,Name, Category, SubCategory, Stock, Price, BarCode)
            VALUES (:nr, :name, :category, :subcategory, :stock, :price, :barcode)";

    $stmt = $pdo->prepare($sql);

    $ok = $stmt->execute([
        ':nr'=> $_POST['nr'],
        ':name' => $_POST['name'],
        ':category' => $_POST['category'],
        ':subcategory' => $_POST['subcategory'],
        ':stock' => $_POST['stock'],
        ':price' => $_POST['price'],
        ':barcode' => $newBarcode
    ]);

    echo json_encode([
        'success' => $ok,
        'new_barcode' => $newBarcode
    ]);
    exit;
}

$sql = "SELECT * FROM Products";
$stmt = $pdo->query($sql);
$response['products'] = $stmt->fetchAll();


$cid = $_POST['cid'] ?? null;
$password = $_POST['password'] ?? null;

if ($cid !== null && $password !== null) {
    $sql = "SELECT * FROM Users WHERE cid = :cid";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':cid' => $cid]);

    $response['user'] = $stmt->fetch();


       $sql = "SELECT * FROM Accounts WHERE Cid = :cid";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':cid' => $cid]);

    $response['accounts'] = $stmt->fetchAll();

}
echo json_encode($response);

?>