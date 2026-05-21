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
    try {

        $stmtMax = $pdo->query("SELECT MAX(BarCode) AS last_barcode FROM Products");
        $row = $stmtMax->fetch();

        $lastBarcode = $row['last_barcode'];

        if (!$lastBarcode) {
            $newBarcode = 100001;
        } else {
            $newBarcode = (int)$lastBarcode + 1;
        }
    
        $sql = "INSERT INTO Products (Name, Category, SubCategory, Stock, Price, BarCode)
                VALUES (:name, :category, :subcategory, :stock, :price, :barcode)";

        $stmt = $pdo->prepare($sql);

        $ok = $stmt->execute([
            ':name' => $_POST['name'],
            ':category' => $_POST['category'],
            ':subcategory' => $_POST['subcategory'],
            ':stock' => $_POST['stock'],
            ':price' => $_POST['price'],
            ':barcode' => $newBarcode
        ]);

    echo json_encode(['success' => $ok, 'new_barcode' => $newBarcode]);
    }catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

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

 $sql = "SELECT * FROM Products";
$params = [];

$search = $_GET['search'] ?? null;

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
    $sql = "SELECT * FROM Users WHERE cid = :cid AND Password = :password";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':cid' => $cid,
        ':password' => $password
    ]);

    $response['user'] = $stmt->fetch();


       $sql = "SELECT * FROM Accounts WHERE Cid = :cid";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':cid' => $cid]);

    $response['accounts'] = $stmt->fetchAll();

}

if (isset($_POST['action']) && $_POST['action'] === 'saveOrder') {

    try {

        $cid = $_POST['cid'];
        $accountId = $_POST['accountId'];
        $total = $_POST['total'];

        $stmt = $pdo->prepare("
            INSERT INTO OrderHistory
            (Cid, Account_ID, Order_date, total_amount, Status)
            VALUES
            (:cid, :account, CURDATE(), :total, 'completed')
        ");

        $stmt->execute([
            ':cid' => $cid,
            ':account' => $accountId,
            ':total' => $total
        ]);

        $orderId = $pdo->lastInsertId();

        $items = json_decode($_POST['items'], true);

        foreach ($items as $item) {

            $stmtProduct = $pdo->prepare("
                SELECT article_id
                FROM Products
                WHERE BarCode = :barcode
            ");

            $stmtProduct->execute([
                ':barcode' => $item['code']
            ]);

            $product = $stmtProduct->fetch();

            if (!$product) {
                continue;
            }

            $stmtItem = $pdo->prepare("
                INSERT INTO OrderItems
                (Order_ID, Item_ID, Quantity, salesPrice)
                VALUES
                (:orderId, :itemId, :qty, :price)
            ");

            $stmtItem->execute([
                ':orderId' => $orderId,
                ':itemId' => $product['article_id'],
                ':qty' => $item['quantity'],
                ':price' => $item['price']
            ]);

            $pdo->prepare("UPDATE Products SET Stock = Stock - :qty WHERE article_id = :itemId")
                ->execute([
                    ':qty' => $item['quantity'],
                    ':itemId' => $product['article_id']
                ]);
        }

        echo json_encode([
            'success' => true
        ]);

    } catch(Exception $e) {

        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }

    exit;
}
if (
    isset($_POST['action']) &&
    $_POST['action'] === 'getOrderHistory'
) {

    $stmt = $pdo->prepare("
        SELECT
            o.Order_ID,
            o.Order_date,
            o.total_amount,
            o.Status,

            oi.Quantity,
            oi.salesPrice,

            p.Name,

            a.AccountName,
            a.AccountType

        FROM OrderHistory o

        JOIN OrderItems oi
            ON o.Order_ID = oi.Order_ID

        JOIN Products p
            ON oi.Item_ID = p.article_id

        JOIN Accounts a
            ON o.Account_ID = a.Account_ID

        WHERE o.Cid = :cid

        ORDER BY o.Order_ID DESC
    ");

    $stmt->execute([
        ':cid' => $_POST['cid']
    ]);

    echo json_encode(
        $stmt->fetchAll()
    );

    exit;
}
echo json_encode($response);

?>