<?php
include "conexao.php";
$sql = "SELECT c.nome, c.empresa, r.data_entrada
        FROM registros r
        JOIN colaboradores c ON c.id = r.colaborador_id
        WHERE r.data_saida IS NULL";
$res = $conn->query($sql);
$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}
header('Content-Type: application/json');
echo json_encode($data);
?>