<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include "conexao.php";

    $id      = $_POST['id'] ?? '';
    $nome    = $_POST['nome'] ?? '';
    $codigo  = $_POST['codigo'] ?? '';
    $empresa = $_POST['empresa'] ?? '';

    if (!$nome || !$codigo) {
        echo "Nome e código são obrigatórios.";
        exit;
    }

    if ($id) {
        // Verifica se o código já existe para outro colaborador
        $ver = $conn->prepare("SELECT id FROM colaboradores WHERE codigo_qr = ? AND id != ?");
        $ver->bind_param("si", $codigo, $id);
        $ver->execute();
        $ver_res = $ver->get_result();
        if ($ver_res->num_rows > 0) {
            echo "Erro: código QR já utilizado por outro colaborador.";
            exit;
        }

        // Atualização
        $stmt = $conn->prepare("UPDATE colaboradores SET nome = ?, codigo_qr = ?, empresa = ? WHERE id = ?");
        $stmt->bind_param("sssi", $nome, $codigo, $empresa, $id);
    } else {
        // Inserção
        $stmt = $conn->prepare("INSERT INTO colaboradores (nome, codigo_qr, empresa) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nome, $codigo, $empresa);
    }

    if ($stmt->execute()) {
        echo $id ? "Colaborador atualizado com sucesso." : "Colaborador cadastrado com sucesso.";
    } else {
        echo "Erro: " . $stmt->error;
    }
} else {
    echo "Método inválido.";
}
?>