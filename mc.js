(function() {
    // 1. Criar o Overlay para o jogo não ficar "esmagado" na tabela
    var overlay = document.createElement('div');
    overlay.id = "mc-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#000;display:flex;flex-direction:column;color:white;font-family:sans-serif;";
    overlay.innerHTML = `
        <div style="background:#222;padding:10px;display:flex;justify-content:space-between;border-bottom:2px solid #444;">
            <span>JS-MINECRAFT XSS EDITION</span>
            <button onclick="document.getElementById('mc-overlay').remove()" style="background:#f44;border:none;color:white;cursor:pointer;padding:5px 10px;">SAIR</button>
        </div>
        <div id="game-container" style="flex-grow:1;position:relative;"></div>
        <div id="mc-status" style="position:absolute;bottom:10px;left:10px;font-size:12px;color:#aaa;">Carregando motor gráfico...</div>
    `;
    document.body.appendChild(overlay);

    // 2. Função auxiliar para carregar scripts em ordem
    const loadScript = (url) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = url;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });

    async function initMinecraft() {
        const status = document.getElementById('mc-status');
        try {
            // Passo 1: Carregar Three.js (Fundamental e permitido pela CSP)
            status.innerText = "Baixando Three.js do JSDelivr...";
            await loadScript("https://cdn.jsdelivr.net/npm/three@0.145.0/build/three.min.js");

            // Passo 2: Carregar os scripts do jogo direto do repositório via JSDelivr
            // Nota: O js-minecraft tem muitos arquivos. Vamos carregar os principais.
            status.innerText = "Baixando lógica do jogo...";
            const repo = "https://cdn.jsdelivr.net/gh/LabyStudio/js-minecraft@master/src/";
            
            // Ordem crítica de carregamento baseada no repo
            await loadScript(repo + "Block.js");
            await loadScript(repo + "Map.js");
            await loadScript(repo + "Player.js");
            await loadScript(repo + "Renderer.js");
            await loadScript(repo + "Game.js");

            status.innerText = "Inicializando mundo...";
            
            // 3. Iniciar o jogo no container que criamos
            // O js-minecraft original procura por elementos específicos, vamos instanciar:
            const game = new Game(document.getElementById("game-container"));
            
            status.innerText = "MINECRAFT RODANDO! Use WASD para andar.";
            setTimeout(() => { status.style.display = 'none'; }, 5000);

        } catch (err) {
            status.innerText = "ERRO: " + err.message;
            console.error("Minecraft XSS Error:", err);
        }
    }

    initMinecraft();
})();
