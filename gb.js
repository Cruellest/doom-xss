(function() {
    // 1. Overlay e Interface
    const overlay = document.createElement('div');
    overlay.id = "gb-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#111;color:#fff;font-family:monospace;display:flex;flex-direction:column;";
    overlay.innerHTML = `
        <div style="background:#222;padding:10px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;">
            <span style="color:#ffcc00;font-weight:bold;">GAMEBOY.JS XSS EDITION</span>
            <div style="display:flex;gap:10px;align-items:center;">
                <label style="background:#444;padding:5px 10px;cursor:pointer;font-size:12px;border-radius:3px;border:1px solid #555;">
                    IMPORTAR ROM (.GB)
                    <input type="file" id="rom-input" accept=".gb" style="display:none;">
                </label>
                <button onclick="document.getElementById('gb-overlay').remove()" style="background:#800;color:white;border:none;padding:5px 15px;cursor:pointer;font-weight:bold;">FECHAR [X]</button>
            </div>
        </div>
        <div id="game-screen" style="flex-grow:1;display:flex;align-items:center;justify-content:center;background:#000;position:relative;">
            <canvas id="canvas" width="160" height="144" style="width:320px;height:288px;image-rendering:pixelated;background:#8b956d;border:10px solid #333;"></canvas>
            <div id="welcome-msg" style="position:absolute;text-align:center;color:#666;">
                <p>AGUARDANDO ROM...</p>
                <p style="font-size:10px;">Selecione um arquivo .gb</p>
            </div>
        </div>
        <div style="background:#222;padding:10px;font-size:10px;color:#888;text-align:center;">
            SETAS (D-Pad) | Z (A) | X (B) | ENTER (Start) | SHIFT (Select)
        </div>
    `;
    document.body.appendChild(overlay);

    // 2. Carregar o script do GitHub via jsDelivr usando o prefixo /gh/
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/juchi/gameboy.js@master/dist/gameboy.js";
    
    script.onload = () => {
        console.log("[GB-XSS] Engine carregada via GitHub.");
        initEmulator();
    };

    script.onerror = () => {
        document.getElementById('welcome-msg').innerText = "ERRO AO CARREGAR ENGINE DO JSDELIVR";
    };

    document.head.appendChild(script);

    function initEmulator() {
        const canvas = document.getElementById('canvas');
        const romInput = document.getElementById('rom-input');
        const welcomeMsg = document.getElementById('welcome-msg');
        
        let gb = null;

        romInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const romData = new Uint8Array(event.target.result);

                try {
                    // Limpa instância anterior se houver
                    if (gb) {
                        gb.pause();
                    }
                    
                    welcomeMsg.style.display = 'none';
                    
                    // Inicialização conforme a API do Gameboy.js
                    // A biblioteca expõe a classe 'Gameboy' globalmente
                    gb = new Gameboy(canvas);
                    gb.loadRom(romData);
                    gb.run();
                    
                } catch (err) {
                    console.error(err);
                    alert("Erro no emulador: " + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        };
    }
})();
