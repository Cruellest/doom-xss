(function() {
    // 1. Interface (Overlay com Botão de Fechar)
    const overlay = document.createElement('div');
    overlay.id = "gb-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#1a1a1a;color:#fff;font-family:monospace;display:flex;flex-direction:column;";
    overlay.innerHTML = `
        <div style="background:#333;padding:10px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #444;">
            <div style="display:flex;align-items:center;gap:15px;">
                <span style="color:#0f0;font-weight:bold;">GAMEBOY_XSS v4.0</span>
                <label style="background:#444;padding:5px 12px;cursor:pointer;font-size:12px;border-radius:4px;border:1px solid #666;color:#fff;">
                    📁 IMPORTAR ROM (.GB)
                    <input type="file" id="rom-input" accept=".gb" style="display:none;">
                </label>
            </div>
            <button onclick="document.getElementById('gb-overlay').remove()" style="background:#aa0000;color:white;border:none;padding:5px 15px;cursor:pointer;font-weight:bold;border-radius:3px;">FECHAR [X]</button>
        </div>
        <div id="game-screen" style="flex-grow:1;display:flex;align-items:center;justify-content:center;background:#000;">
            <canvas id="canvas" width="160" height="144" style="width:320px;height:288px;background:#8b956d;border:10px solid #333;image-rendering:pixelated;"></canvas>
            <div id="status-msg" style="position:absolute;color:rgba(0,0,0,0.3);font-weight:bold;pointer-events:none;">INSIRA UMA ROM</div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 2. Carregar a Engine
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/juchi/gameboy.js@master/dist/gameboy.js";
    
    script.onload = () => {
        console.log("[GB-XSS] Engine carregada. Mapeando componentes...");

        try {
            // No seu arquivo gameboy.js:
            // O namespace é window.GameboyJS
            // O construtor é window.GameboyJS.Gameboy
            // O leitor é window.GameboyJS.RomFileReader
            
            const GameboyClass = window.GameboyJS.Gameboy;
            const RomReaderClass = window.GameboyJS.RomFileReader;
            
            const canvas = document.getElementById('canvas');
            const romInput = document.getElementById('rom-input');

            // Criamos o leitor apontando para o seu input customizado
            const reader = new RomReaderClass(romInput);

            // Iniciamos o Gameboy passando o leitor nas opções
            const gb = new GameboyClass(canvas, {
                romReaders: [reader]
            });

            console.log("[GB-XSS] Emulador pronto e aguardando arquivo!");

            // Feedback visual quando carregar
            romInput.addEventListener('change', () => {
                document.getElementById('status-msg').style.display = 'none';
                // O GameboyJS inicia o jogo automaticamente ao detectar o 'change' no input!
            });

        } catch (err) {
            console.error("[GB-XSS] Erro na montagem:", err);
            alert("Erro: " + err.message);
        }
    };

    document.head.appendChild(script);
})();
