(function() {
    // 1. Configuração do ambiente
    const repoBase = "https://cdn.jsdelivr.net/gh/LabyStudio/js-minecraft@master/";

    // 2. Criar o Overlay e o Canvas que o jogo espera
    const overlay = document.createElement('div');
    overlay.id = "mc-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#000;display:flex;flex-direction:column;color:white;font-family:sans-serif;";
    overlay.innerHTML = `
        <div style="background:#222;padding:5px 15px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #444;">
            <span style="font-size:12px;color:#888;font-family:monospace;">JS-MINECRAFT LATEST ENGINE</span>
            <button onclick="document.getElementById('mc-overlay').remove()" style="background:#500;border:none;color:white;cursor:pointer;padding:2px 10px;font-size:12px;">FECHAR</button>
        </div>
        <div id="game-container" style="flex-grow:1;position:relative;">
            <canvas id="canvas" style="width:100%;height:100%;display:block;"></canvas>
        </div>
        <div id="mc-status" style="position:absolute;bottom:10px;left:10px;font-size:10px;color:#0f0;font-family:monospace;background:rgba(0,0,0,0.5);padding:2px 5px;">
            INICIALIZANDO MÓDULOS...
        </div>
    `;
    document.body.appendChild(overlay);

    // 3. Injetar o ponto de entrada como um MÓDULO
    // Isso faz o navegador carregar automaticamente o Block.js, Player.js, etc.
    const startScript = document.createElement('script');
    startScript.type = "module";
    startScript.src = repoBase + "src/js/Start.js";
    
    startScript.onload = () => {
        document.getElementById('mc-status').innerText = "MOTOR CARREGADO. CARREGANDO MUNDO...";
    };

    startScript.onerror = () => {
        document.getElementById('mc-status').innerText = "ERRO AO CARREGAR START.JS. VERIFIQUE A CONEXÃO.";
    };

    document.head.appendChild(startScript);

    // 4. Ajustar o redimensionamento do jogo
    window.addEventListener('resize', () => {
        if(window.minecraft) {
            window.minecraft.updateWindowSize();
        }
    });
})();
