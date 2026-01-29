(function() {
    // 1. Configuração de Estilo e Overlay
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
                <p>NENHUMA ROM CARREGADA</p>
                <p style="font-size:10px;">Clique em "IMPORTAR ROM" para começar</p>
            </div>
        </div>
        <div style="background:#222;padding:10px;font-size:10px;color:#888;text-align:center;">
            CONTROLES: SETAS (Direcional) | Z (A) | X (B) | ENTER (Start) | SHIFT (Select)
        </div>
    `;
    document.body.appendChild(overlay);

    // 2. Carregar a biblioteca do Emulador via JSDelivr
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/gh-juchi-gameboy.js@master/dist/gameboy.js";
    
    script.onload = () => {
        console.log("[GB-XSS] Emulador carregado.");
        initEmulator();
    };
    document.head.appendChild(script);

    function initEmulator() {
        const canvas = document.getElementById('canvas');
        const romInput = document.getElementById('rom-input');
        const welcomeMsg = document.getElementById('welcome-msg');
        
        // O repositório expõe a classe Gameboy no escopo global
        let gb = null;

        romInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const romData = new Uint8Array(arrayBuffer);

                try {
                    // Inicializa ou Reinicia o emulador
                    if (gb) gb.stop();
                    
                    welcomeMsg.style.display = 'none';
                    
                    // Instancia o Gameboy passando o canvas e a ROM
                    // Nota: A estrutura exata depende de como o dist foi gerado, 
                    // geralmente é: new Gameboy(canvas, romData)
                    gb = new Gameboy(canvas);
                    gb.loadRom(romData);
                    gb.run();
                    
                    console.log("[GB-XSS] ROM carregada com sucesso.");
                } catch (err) {
                    alert("Erro ao carregar ROM: " + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        };
    }
})();
