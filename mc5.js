(function() {
    const repoBase = "https://cdn.jsdelivr.net/gh/LabyStudio/js-minecraft@master/";

    // 1. Injetar a tag BASE (Isso redireciona TODAS as imagens e scripts automaticamente)
    const base = document.createElement('base');
    base.href = repoBase;
    document.head.appendChild(base);

    // 2. Criar a Interface com Botão de Fechar
    const overlay = document.createElement('div');
    overlay.id = "mc-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#000;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;";
    overlay.innerHTML = `
        <div style="background:#111;padding:10px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;">
            <span style="font-family:monospace;color:#0f0;font-size:12px;">JS-MINECRAFT XSS_LOADER</span>
            <button onclick="window.location.reload()" style="background:#cc0000;color:white;border:none;padding:5px 15px;cursor:pointer;font-weight:bold;border-radius:3px;">FECHAR [X]</button>
        </div>
        <div id="game-container" style="flex-grow:1;position:relative;background:#000;">
            <canvas id="canvas" style="width:100%;height:100%;"></canvas>
            <div id="mc-loader" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
                <div style="font-size:24px;margin-bottom:10px;">⛏️</div>
                <div id="status">CARREGANDO BLOCOS...</div>
                <div style="font-size:10px;color:#666;margin-top:20px;">Se demorar, clique na tela ou veja o console (F12)</div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 3. Carregar o motor como Módulo
    // Como Start.js é um módulo, ele vai puxar o resto da árvore automaticamente
    const startScript = document.createElement('script');
    startScript.type = "module";
    startScript.src = repoBase + "src/js/Start.js";
    
    startScript.onload = () => {
        document.getElementById('status').innerText = "ENGINE INICIADA! GERANDO MUNDO...";
        // Esconde o loader após 10 segundos (tempo médio de carga)
        setTimeout(() => {
            const loader = document.getElementById('mc-loader');
            if(loader) loader.style.display = 'none';
        }, 10000);
    };

    document.head.appendChild(startScript);

    // 4. Manter o foco no canvas
    document.getElementById('canvas').onclick = function() {
        this.focus();
    };
})();
