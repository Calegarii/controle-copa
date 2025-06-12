const container = document.getElementById('panel');
const ALERT_AFTER = 1 * 60;  // segundos
const REPEAT_EVERY = 10;     // segundos
const alerted = {};

function fetchData(){
    fetch('../php/listar_painel.php')
      .then(r => r.json())
      .then(data => {
          container.innerHTML = '';
          const now = Date.now();
          data.forEach(item => {
              const entryTime = new Date(item.data_entrada.replace(' ', 'T'));
              const diffSec  = Math.floor((now - entryTime.getTime()) / 1000);
              const card     = document.createElement('div');
              card.className = 'card';
              if(diffSec > ALERT_AFTER){
                  card.classList.add('over');
                  if(!alerted[item.nome] || now - alerted[item.nome] > REPEAT_EVERY * 1000){
                      speak(item.nome);
                      alerted[item.nome] = now;
                  }
              }
              card.innerHTML = `
                  <h2>${item.nome}</h2>
                  <p>-</p>
                  <span class="timer">${formatTime(diffSec)}</span>
              `;
              container.appendChild(card);
          });
      })
      .catch(console.error);
}

function formatTime(sec){
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function speak(nome){
    if(!('speechSynthesis' in window)) return;
    const msg = new SpeechSynthesisUtterance(`${nome}, seu tempo acabou.`);
    speechSynthesis.speak(msg);
}

setInterval(fetchData, 1000);
fetchData();