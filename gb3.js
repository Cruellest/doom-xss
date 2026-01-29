(function() {
    // 1. Interface e Estilo
    const overlay = document.createElement('div');
    overlay.id = "gb-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#1a1a1a;color:#fff;font-family:monospace;display:flex;flex-direction:column;";
    overlay.innerHTML = `
        <div style="background:#333;padding:10px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #444;">
            <div style="display:flex;align-items:center;gap:15px;">
                <span style="color:#0f0;font-weight:bold;">GAMEBOY_XSS v2.5</span>
                <label style="background:#444;padding:5px 10px;cursor:pointer;font-size:12px;border-radius:3px;border:1px solid #666;">
                    📁 IMPORTAR ROM
                    <input type="file" id="rom-input" accept=".gb" style="display:none;">
                </label>
            </div>
            <button onclick="document.getElementById('gb-overlay').remove()" style="background:#aa0000;color:white;border:none;padding:5px 15px;cursor:pointer;font-weight:bold;">FECHAR [X]</button>
        </div>
        <div id="game-screen" style="flex-grow:1;display:flex;align-items:center;justify-content:center;background:#000;">
            <canvas id="canvas" width="160" height="144" style="width:320px;height:288px;background:#8b956d;border:8px solid #555;image-rendering:pixelated;"></canvas>
            <div id="status-msg" style="position:absolute;color:#444;">AGUARDANDO ROM...</div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 2. Carregar a Engine
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/juchi/gameboy.js@master/dist/gameboy.js";
    
    script.onload = () => {
        console.log("[GB-XSS] Engine carregada. Pronto para instanciar.");
    };
    document.head.appendChild(script);

    // 3. Lógica de Inicialização Inteligente
    function getGameboyConstructor() {
        // Opção 1: Nome exato encontrado no seu console
        const root = window.GameboyJS;
        if (!root) return window.Gameboy;

        // Opção 2: Se GameboyJS for um objeto/módulo, busca a classe dentro dele
        if (typeof root === 'function') return root;
        
        // Tenta padrões comuns de empacotamento (Webpack/Rollup)
        return root.Gameboy || root.default || root.Emulator || null;
    }

    document.getElementById('rom-input').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const romData = new Uint8Array(event.target.result);
            document.getElementById('status-msg').style.display = 'none';

            try {
                const Constructor = getGameboyConstructor();
                
                if (typeof Constructor !== 'function') {
                    console.error("[GB-XSS] GameboyJS detectado, mas não é uma classe. Conteúdo:", window.GameboyJS);
                    throw new Error("Não foi possível localizar o construtor dentro de GameboyJS.");
                }

                console.log("[GB-XSS] Instanciando emulador...");
                const canvas = document.getElementById('canvas');
                const gb = new Constructor(canvas);
                
                gb.loadRom(romData);
                gb.run();
                
            } catch (err) {
                console.error("[GB-XSS] Erro fatal:", err);
                alert("Falha ao iniciar: " + err.message + "\n\nOlhe o console (F12) para ver o que há dentro de 'GameboyJS'.");
            }
        };
        reader.readAsArrayBuffer(file);
    };
})();
