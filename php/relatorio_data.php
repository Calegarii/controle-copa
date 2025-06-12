<?php
include "conexao.php";
$start = $_GET['start'] ?? '';
$end   = $_GET['end'] ?? '';
$colab = $_GET['colab'] ?? '';
$empresa = $_GET['empresa'] ?? '';
$periodo = $_GET['periodo'] ?? '';
$minutos_min = isset($_GET['minutos_min']) ? floatval($_GET['minutos_min']) : 0;

if(!$start || !$end){
    http_response_code(400);
    echo json_encode(["erro"=>"Datas obrigatórias"]);
    exit;
}

$sql = "SELECT c.id as colaborador_id, c.nome, c.empresa, r.data_entrada, r.data_saida,
        ROUND(TIMESTAMPDIFF(SECOND, r.data_entrada, r.data_saida)/60,1) AS minutos,
        TIME(r.data_entrada) as hora_entrada
        FROM registros r
        JOIN colaboradores c ON c.id = r.colaborador_id
        WHERE DATE(r.data_entrada) BETWEEN ? AND ?";
$params = [$start, $end];
$types = "ss";

if($colab){
    $sql .= " AND c.id = ?";
    $types .= "i";
    $params[] = $colab;
}

if($empresa){
    $sql .= " AND c.empresa = ?";
    $types .= "s";
    $params[] = $empresa;
}

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$res = $stmt->get_result();

$agrupado = [];

while($r = $res->fetch_assoc()){
    $hora = $r['hora_entrada'];
    $periodo_atual = "NOTURNO";
    if ($hora >= '00:01:00' && $hora <= '12:00:00') {
        $periodo_atual = "MATUTINO";
    } elseif ($hora >= '12:01:00' && $hora <= '18:00:00') {
        $periodo_atual = "VESPERTINO";
    }
    if ($periodo && $periodo !== $periodo_atual) {
        continue;
    }
    $r['periodo'] = $periodo_atual;
    unset($r['hora_entrada']);
    $id = $r['colaborador_id'];

    if (!isset($agrupado[$id])) {
        $agrupado[$id] = [
            'nome' => $r['nome'],
            'empresa' => $r['empresa'],
            'periodo' => $periodo_atual,
            'minutos_total' => 0,
            'entradas' => []
        ];
    }

    $agrupado[$id]['minutos_total'] += $r['minutos'];
    $agrupado[$id]['entradas'][] = [
        'data_entrada' => $r['data_entrada'],
        'data_saida' => $r['data_saida'],
        'minutos' => $r['minutos']
    ];
}

$resultado = [];
foreach ($agrupado as $id => $dados) {
    if ($dados['minutos_total'] >= $minutos_min) {
        foreach ($dados['entradas'] as $e) {
            $resultado[] = [
                'nome' => $dados['nome'],
                'empresa' => $dados['empresa'],
                'periodo' => $dados['periodo'],
                'data_entrada' => $e['data_entrada'],
                'data_saida' => $e['data_saida'],
                'minutos' => $e['minutos'],
                'minutos_total' => $dados['minutos_total']
            ];
        }
    }
}

header('Content-Type: application/json');
echo json_encode($resultado);
?>