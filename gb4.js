(function() {
    // 1. Interface (Overlay com Botão de Fechar)
    const overlay = document.createElement('div');
    overlay.id = "gb-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#1a1a1a;color:#fff;font-family:monospace;display:flex;flex-direction:column;";
    overlay.innerHTML = `
        <div style="background:#333;padding:10px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #444;">
            <div style="display:flex;align-items:center;gap:15px;">
                <span style="color:#0f0;font-weight:bold;">GAMEBOY_XSS v3.0</span>
                <label style="background:#444;padding:5px 12px;cursor:pointer;font-size:12px;border-radius:4px;border:1px solid #666;color:#fff;transition:0.2s;">
                    📁 IMPORTAR ROM (.GB)
                    <input type="file" id="rom-input" accept=".gb" style="display:none;">
                </label>
            </div>
            <button onclick="document.getElementById('gb-overlay').remove()" style="background:#aa0000;color:white;border:none;padding:5px 15px;cursor:pointer;font-weight:bold;border-radius:3px;">FECHAR [X]</button>
        </div>
        <div id="game-screen" style="flex-grow:1;display:flex;align-items:center;justify-content:center;background:#000;">
            <canvas id="canvas" width="160" height="144" style="width:320px;height:288px;background:#8b956d;border:10px solid #333;image-rendering:pixelated;"></canvas>
            <div id="status-msg" style="position:absolute;color:#333;font-weight:bold;">CARREGUE UM ARQUIVO .GB</div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 2. Carregar a Engine do GitHub
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/juchi/gameboy.js@master/dist/gameboy.js";
    
    script.onload = () => {
        console.log("[GB-XSS] Engine carregada. Configurando hardware...");
        
        // Buscamos o construtor correto dentro do namespace 'GameboyJS'
        // Como vimos no seu console, o objeto global é GameboyJS
        const GameboyClass = window.GameboyJS && window.GameboyJS.Gameboy 
                           ? window.GameboyJS.Gameboy 
                           : window.GameboyJS;

        if (typeof GameboyClass !== 'function') {
            console.error("[GB-XSS] Classe Gameboy não encontrada dentro de GameboyJS!");
            return;
        }

        const canvas = document.getElementById('canvas');
        const romInput = document.getElementById('rom-input');

        try {
            // FIX CRÍTICO: Passamos o canvas E o input para o construtor
            // A biblioteca vai gerenciar o 'change' do input automaticamente
            const gb = new GameboyClass(canvas, romInput);
            
            console.log("[GB-XSS] Emulador instanciado com sucesso!");

            // Evento visual para remover a mensagem de fundo
            romInput.addEventListener('change', () => {
                document.getElementById('status-msg').style.display = 'none';
            });

        } catch (err) {
            console.error("[GB-XSS] Erro na instanciação:", err);
        }
    };

    document.head.appendChild(script);
})();
