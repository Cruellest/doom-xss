(function() {
    // 1. Interface (Overlay com Botão de Fechar)
    const overlay = document.createElement('div');
    overlay.id = "gb-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#1a1a1a;color:#fff;font-family:monospace;display:flex;flex-direction:column;";
    overlay.innerHTML = `
        <div style="background:#333;padding:10px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #444;">
            <div style="display:flex;align-items:center;gap:15px;">
                <span style="color:#0f0;font-weight:bold;">GAMEBOY_XSS v2.0</span>
                <label style="background:#555;padding:5px 10px;cursor:pointer;font-size:12px;border-radius:3px;border:1px solid #777;color:#fff;">
                    📁 CARREGAR ROM (.GB)
                    <input type="file" id="rom-input" accept=".gb" style="display:none;">
                </label>
            </div>
            <button onclick="document.getElementById('gb-overlay').remove()" style="background:#aa0000;color:white;border:none;padding:5px 15px;cursor:pointer;font-weight:bold;border-radius:3px;">FECHAR [X]</button>
        </div>
        <div id="game-screen" style="flex-grow:1;display:flex;align-items:center;justify-content:center;background:#000;">
            <canvas id="canvas" width="160" height="144" style="width:320px;height:288px;background:#8b956d;border:8px solid #555;image-rendering:pixelated;"></canvas>
            <div id="status-msg" style="position:absolute;color:#555;text-align:center;">AGUARDANDO ROM...</div>
        </div>
        <div style="background:#222;padding:8px;font-size:10px;color:#666;text-align:center;">
            SETAS: Movimento | Z: Botão A | X: Botão B | ENTER: Start | SHIFT: Select
        </div>
    `;
    document.body.appendChild(overlay);

    // 2. Carregar a Engine (v6.22.60 foi um erro anterior, agora vamos direto no arquivo do repo)
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/juchi/gameboy.js@master/dist/gameboy.js";
    
    script.onload = () => {
        console.log("[GB-XSS] Script carregado. Iniciando busca pelo construtor...");
        // Pequeno delay para garantir que o script execute
        setTimeout(initEmulator, 500);
    };
    document.head.appendChild(script);

    function initEmulator() {
        const romInput = document.getElementById('rom-input');
        const canvas = document.getElementById('canvas');
        const status = document.getElementById('status-msg');
        let gb = null;

        romInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const romData = new Uint8Array(event.target.result);
                status.style.display = 'none';

                try {
                    // RESOLUÇÃO DO REFERENCE ERROR:
                    // Tentamos encontrar o construtor em diferentes lugares possíveis (Global, Módulo ou Default)
                    const GameboyConstructor = window.Gameboy || (window.exports && window.exports.Gameboy) || window.default;

                    if (!GameboyConstructor) {
                        // Se ainda não achou, fazemos uma busca manual no objeto window
                        const foundName = Object.keys(window).find(key => key.toLowerCase().includes('gameboy'));
                        if (foundName) {
                            console.log("[GB-XSS] Construtor encontrado com o nome:", foundName);
                            gb = new window[foundName](canvas);
                        } else {
                            throw new Error("Classe 'Gameboy' não encontrada no window. Verifique o console.");
                        }
                    } else {
                        gb = new GameboyConstructor(canvas);
                    }

                    gb.loadRom(romData);
                    gb.run();
                    console.log("[GB-XSS] ROM iniciada!");

                } catch (err) {
                    console.error("[GB-XSS] Erro:", err);
                    alert("Falha: " + err.message + "\n\nVerifique o F12 para ver as variáveis disponíveis.");
                }
            };
            reader.readAsArrayBuffer(file);
        };
    }
})();
