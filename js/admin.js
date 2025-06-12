document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('formCadastro');
    const tbody = document.querySelector('#tabela tbody');
    const gerarBtn = document.getElementById('gerarCodigoBtn');

    if (gerarBtn) {
        gerarBtn.addEventListener('click', () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
            let codigo = '';
            for (let i = 0; i < 8; i++) {
                codigo += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            form.codigo.value = codigo;
        });
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        fetch('../php/cadastrar_colaborador.php', {
            method: 'POST',
            body: data
        })
        .then(r => r.text())
        .then(msg => {
            alert(msg);
            form.reset();
            form.id.value = '';
            carregar();
        })
        .catch(console.error);
    });

    function carregar() {
        fetch('../php/list_colabs.php')
          .then(r => r.json())
          .then(data => {
              tbody.innerHTML = '';
              data.forEach(c => {
                  const tr = document.createElement('tr');
                  tr.innerHTML = `
                     
                      <td>${c.nome}</td>
                      <td>
                          ${c.codigo_qr}
                      </td>
                      <td>
                      <button class="qr" title="QR Code"
                            onclick="window.open('https://api.invertexto.com/v1/qrcode?token=20070|h0oHqUohpPKDn6XMYKfXzaU0YSQHj0t9&text=${encodeURIComponent(c.codigo_qr)}', '_blank')">
                            QR
                          </button>
                      </td>
                      <td>${c.empresa}</td>
                      <td>
                          <button onclick="editarColaborador('${c.id}', '${c.nome}', '${c.codigo_qr}', '${c.empresa}')">Editar</button>
                      </td>
                  `;
                  tbody.appendChild(tr);
              });
          })
          .catch(console.error);
    }

    window.editarColaborador = function(id, nome, codigo, empresa){
        form.id.value = id;
        form.nome.value = nome;
        form.codigo.value = codigo;
        form.empresa.value = empresa;
    };

    carregar();
});