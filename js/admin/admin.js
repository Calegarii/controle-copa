
document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.querySelector("tbody");
    const filtro = document.getElementById("filtroAtivo");

    function carregar() {
        fetch("../php/listar_colaboradores.php?filtro=" + filtro.value)
            .then(response => response.json())
            .then(data => {
                tabela.innerHTML = "";
                data.forEach(colaborador => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${colaborador.nome}</td>
                        <td>${colaborador.codigo_qr}</td>
                        <td>${colaborador.empresa}</td>
                        <td>${colaborador.ativo == 1 ? 'Ativo' : 'Inativo'}</td>
                        <td>
                            <button class="editar" data-id="${colaborador.id}" data-nome="${colaborador.nome}" data-codigo="${colaborador.codigo_qr}" data-empresa="${colaborador.empresa}" data-ativo="${colaborador.ativo}">Editar</button>
                        </td>
                    `;
                    tabela.appendChild(tr);
                });
            });
    }

    filtro.addEventListener("change", carregar);
    carregar();
});
