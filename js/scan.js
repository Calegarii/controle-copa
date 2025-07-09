let html5QrCode;
let selectedCameraId = null;

function startScan() {
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        stopScan();

        fetch("../php/registrar_entrada.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: decodedText })
})
.then(res => {
    if (!res.ok) {
        throw new Error("Erro na resposta do servidor.");
    }
    return res.text();
})
.then(msg => {
    alert(msg);
    window.location.href = "index.html";
})
.catch(err => {
    console.error(err);
    alert("Erro ao registrar entrada/saida.");
});
    };

    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        selectedCameraId,
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        qrCodeSuccessCallback

    ).then(() => {
    const mirrorInterval = setInterval(() => {
        const video = document.querySelector("#reader video");
        const canvas = document.querySelector("#reader canvas");
        if (video) {
            const select = document.getElementById("camera-select");
            const lbl = Array.from(select.options).find(o => o.value === selectedCameraId)?.text.toLowerCase();
            const isFront = lbl && lbl.includes('front');
            if (isFront) {
                video.style.transform = 'scaleX(-1)';
                if (canvas) canvas.style.transform = 'scaleX(-1)';
            } else {
                video.style.transform = '';
                if (canvas) canvas.style.transform = '';
            }
            clearInterval(mirrorInterval);
        }
    }, 200);
}
    ).catch(err => console.error("Erro ao iniciar o scanner:", err));
}

function stopScan() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(err => console.error(err));
    }
}

function openModal() {
    document.getElementById("modal").style.display = "flex";
    startScan();
}

function closeModal() {
    const v=document.querySelector('#reader video'); if(v) v.classList.remove('mirror');
    document.getElementById("modal").style.display = "none";
    stopScan();
}

// Preenche o seletor de câmeras
Html5Qrcode.getCameras().then(devices => {
    const select = document.getElementById("camera-select");
    devices.forEach(device => {
        const option = document.createElement("option");
        option.value = device.id;
        option.text = device.label || `Câmera ${select.length + 1}`;
        select.appendChild(option);
    });
    select.onchange = () => {
        selectedCameraId = select.value;
    };
    if (devices.length > 0) {
        selectedCameraId = devices[0].id;
    }
}).catch(err => console.error("Erro ao buscar câmeras:", err));