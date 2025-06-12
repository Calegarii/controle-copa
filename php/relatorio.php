<?php
include "conexao.php";
$dia = $_GET['dia'] ?? date('Y-m-d');
$sql = "SELECT c.nome, c.empresa, r.data_entrada, r.data_saida,
        TIMESTAMPDIFF(SECOND, r.data_entrada, r.data_saida) AS segundos
        FROM registros r
        JOIN colaboradores c ON c.id = r.colaborador_id
        WHERE DATE(r.data_entrada) = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $dia);
$stmt->execute();
$res = $stmt->get_result();
header('Content-Type: text/html; charset=utf-8');
echo "<h1>Relatório do dia $dia</h1>";
echo "<table border='1' cellpadding='4'><tr><th>Nome</th><th>Empresa</th><th>Entrada</th><th>Saída</th><th>Duração (min)</th></tr>";
while($r = $res->fetch_assoc()){
    $min = round($r['segundos']/60,1);
    echo "<tr><td>{$r['nome']}</td><td>{$r['empresa']}</td><td>{$r['data_entrada']}</td><td>{$r['data_saida']}</td><td>{$min}</td></tr>";
}
echo "</table>";
?>