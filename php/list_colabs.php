<?php
include "conexao.php";

$filtro = isset($_GET['filtro']) ? intval($_GET['filtro']) : 1;

if ($filtro === -1) {
    $sql = "SELECT * FROM colaboradores";
} else {
    $sql = "SELECT * FROM colaboradores WHERE ativo = $filtro";
}

$res = $conn->query($sql);
$data = [];
while($row = $res->fetch_assoc()){
    $data[] = $row;
}
header('Content-Type: application/json');
echo json_encode($data);
?>