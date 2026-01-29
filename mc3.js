(function() {
    const repoBase = "https://cdn.jsdelivr.net/gh/LabyStudio/js-minecraft@master/";

    // 1. Interface de Diagnóstico
    const overlay = document.createElement('div');
    overlay.id = "mc-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#000;color:#0f0;font-family:monospace;";
    overlay.innerHTML = `
        <div style="background:#222;padding:5px;display:flex;justify-content:space-between;border-bottom:1px solid #444;">
            <span>[ DEBUG MODE: MC-XSS ]</span>
            <button onclick="document.getElementById('mc-overlay').remove()" style="background:red;color:white;border:none;cursor:pointer;">SAIR</button>
        </div>
        <div id="game-container" style="flex-grow:1;background:#000;">
            <canvas id="canvas"></canvas>
        </div>
        <div id="logs" style="position:absolute;bottom:0;width:100%;background:rgba(0,0,0,0.8);font-size:10px;max-height:100px;overflow:auto;padding:5px;">
            <div>> Aguardando inicialização...</div>
        </div>
    `;
    document.body.appendChild(overlay);

    const log = (msg) => {
        const div = document.createElement('div');
        div.innerText = "> " + msg;
        document.getElementById('logs').appendChild(div);
        console.log("[MC-XSS]", msg);
    };

    // 2. O "Pulo do Gato": Redirecionar recursos
    // Esse truque tenta interceptar as chamadas de imagem para o GitHub
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'img') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'src' && !value.startsWith('http')) {
                    value = repoBase + value; // Força o caminho para o GitHub
                    log("Redirecionando imagem: " + value);
                }
                return originalSetAttribute.call(element, name, value);
            };
        }
        return element;
    };

    // 3. Injetar o jogo como Módulo
    log("Injetando Start.js...");
    const startScript = document.createElement('script');
    startScript.type = "module";
    startScript.src = repoBase + "src/js/Start.js";
    
    startScript.onload = () => log("Start.js carregado. Iniciando engine...");
    startScript.onerror = () => log("ERRO: Falha ao baixar Start.js");

    document.head.appendChild(startScript);
})();
