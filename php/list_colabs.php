<?php
include "conexao.php";
$res = $conn->query("SELECT * FROM colaboradores");
$data = [];
while($row = $res->fetch_assoc()){
    $data[] = $row;
}
header('Content-Type: application/json');
echo json_encode($data);
?>