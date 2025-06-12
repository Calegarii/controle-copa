document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('filtro');
    const resultDiv = document.getElementById('resultado');
    const colabSelect = document.getElementById('colabSelect');
    const empresaSelect = document.getElementById('empresaSelect');

    fetch('../php/list_colabs.php')
      .then(r => r.json())
      .then(data => {
          const empresas = new Set();
          data.forEach(c => {
              const opt = document.createElement('option');
              opt.value = c.id;
              opt.textContent = c.nome;
              colabSelect.appendChild(opt);
              if (c.empresa) empresas.add(c.empresa);
          });

          Array.from(empresas).forEach(emp => {
              const opt = document.createElement('option');
              opt.value = emp;
              opt.textContent = emp;
              empresaSelect.appendChild(opt);
          });
      });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const params = new URLSearchParams();
        for (const [key, val] of fd.entries()) {
            if (val) params.set(key, val);
        }
        fetch('../php/relatorio_data.php?' + params.toString())
          .then(r => r.json())
          .then(showTable)
          .catch(console.error);
    });

    function showTable(rows) {
        if (!rows.length) {
            resultDiv.innerHTML = '<p>Nenhum registro.</p>';
            return;
        }
        let html = '<table><thead><tr><th>Nome</th><th>Empresa</th><th>Período</th><th>Entrada</th><th>Saída</th><th>Duração (min)</th></tr></thead><tbody>';
        rows.forEach(r => {
            html += `<tr><td>${r.nome}</td><td>${r.empresa}</td><td>${r.periodo}</td><td>${r.data_entrada}</td><td>${r.data_saida}</td><td>${r.minutos}</td></tr>`;
        });
        html += '</tbody></table>';
        resultDiv.innerHTML = html;
    }
});