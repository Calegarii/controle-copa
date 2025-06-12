<?php
$data = json_decode(file_get_contents("php://input"));
if(!$data){ die("Nenhum dado recebido."); }
include "conexao.php";

$codigo = $data->codigo ?? '';

$stmt = $conn->prepare("SELECT id, nome FROM colaboradores WHERE codigo_qr = ?");
$stmt->bind_param("s", $codigo);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
  $colaborador_id = $row['id'];
  $nome = $row['nome'];

  // Verifica se há registro aberto
  $ver = $conn->prepare("SELECT id FROM registros WHERE colaborador_id = ? AND data_saida IS NULL");
  $ver->bind_param("i", $colaborador_id);
  $ver->execute();
  $aberto = $ver->get_result();

  if ($aberto->num_rows > 0) {
    // registra saída
    $upd = $conn->prepare("UPDATE registros SET data_saida = NOW() WHERE colaborador_id = ? AND data_saida IS NULL");
    $upd->bind_param("i", $colaborador_id);
    $upd->execute();
    echo "Saída registrada para $nome.";
  } else {
    // nova entrada
    $ins = $conn->prepare("INSERT INTO registros (colaborador_id, data_entrada) VALUES (?, NOW())");
    $ins->bind_param("i", $colaborador_id);
    $ins->execute();
    echo "Entrada registrada para $nome.";
  }
} else {
  echo "Colaborador não encontrado.";
}
?>