(function() {
    // 1. Criar o Overlay
    var overlay = document.createElement('div');
    overlay.id = "mc-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#000;display:flex;flex-direction:column;color:white;font-family:sans-serif;";
    overlay.innerHTML = `
        <div style="background:#333;padding:10px;display:flex;justify-content:space-between;border-bottom:1px solid #555;">
            <span style="font-weight:bold;color:#aaa;">MINECRAFT JS EDITION</span>
            <button onclick="document.getElementById('mc-overlay').remove()" style="background:#800;border:none;color:white;cursor:pointer;padding:5px 10px;">SAIR</button>
        </div>
        <div id="game-container" style="flex-grow:1;position:relative;background:#000;"></div>
        <div id="mc-status" style="position:absolute;bottom:10px;left:10px;font-size:12px;color:#0f0;font-family:monospace;">INICIALIZANDO...</div>
    `;
    document.body.appendChild(overlay);

    const loadScript = (url) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = url;
        s.onload = resolve;
        s.onerror = () => reject(new Error("Falha ao carregar: " + url));
        document.head.appendChild(s);
    });

    async function initMinecraft() {
        const status = document.getElementById('mc-status');
        try {
            // Caminho base para o repositório (sem o /src/)
            const repo = "https://cdn.jsdelivr.net/gh/LabyStudio/js-minecraft@master/";
            
            status.innerText = "Baixando lógica dos blocos...";
            await loadScript(repo + "Block.js");
            
            status.innerText = "Gerando mapa...";
            await loadScript(repo + "Map.js");
            
            status.innerText = "Configurando jogador...";
            await loadScript(repo + "Player.js");
            
            status.innerText = "Injetando motor de renderização...";
            await loadScript(repo + "Renderer.js");
            
            status.innerText = "Iniciando Game Engine...";
            await loadScript(repo + "Game.js");

            // No js-minecraft original, o jogo inicia instanciando a classe Game
            // passando o elemento onde ele deve renderizar.
            window.game = new Game(document.getElementById("game-container"));
            
            status.innerText = "MINECRAFT RODANDO!";
            setTimeout(() => { status.style.opacity = '0.1'; }, 5000);

        } catch (err) {
            status.innerText = "ERRO CRÍTICO: " + err.message;
            console.error(err);
        }
    }

    initMinecraft();
})();
