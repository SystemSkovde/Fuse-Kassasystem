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

$search = $_GET['search'] ?? null;
$params = [];

if ($search) {
    $sql .= " WHERE Name LIKE :search 
              OR Category LIKE :search 
              OR SubCategory LIKE :search 
              OR BarCode LIKE :search";

    $params[':search'] = "%$search%";
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$response['products'] = $stmt->fetchAll();


$data = json_decode(file_get_contents("php://input"), true);
if ($data && isset($data['barcode'])) {

    $allowedFields = ['Name', 'Category', 'SubCategory', 'Stock', 'Price'];

    if (in_array($data['field'], $allowedFields)) {

        $sql = "UPDATE Products SET {$data['field']} = :value WHERE BarCode = :barcode";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':value' => $data['value'],
            ':barcode' => $data['barcode']
        ]);
    }

    echo json_encode(["success" => true]);
}


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