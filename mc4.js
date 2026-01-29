(function() {
    const repoBase = "https://cdn.jsdelivr.net/gh/LabyStudio/js-minecraft@master/";

    // 1. INTERCEPTADOR GLOBAL (O Segredo)
    // Redireciona Image(), fetch() e XMLHttpRequest() para o GitHub
    
    // Intercepta Imagens (Texturas)
    const OriginalImage = window.Image;
    window.Image = function() {
        const img = new OriginalImage();
        const setter = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
        Object.defineProperty(img, 'src', {
            set: function(val) {
                if (val && !val.startsWith('http') && !val.startsWith('data:')) {
                    val = repoBase + val.replace(/^\.\//, '');
                    console.log("[MC-XSS] Redirecionando Imagem:", val);
                }
                return setter.call(this, val);
            }
        });
        return img;
    };

    // Intercepta Fetch (Dados do Mapa/Sons)
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && !url.startsWith('http')) {
            url = repoBase + url.replace(/^\.\//, '');
            console.log("[MC-XSS] Redirecionando Fetch:", url);
        }
        return originalFetch(url, options);
    };

    // 2. INTERFACE E BOTÃO DE INICIALIZAÇÃO
    // Navegadores bloqueiam áudio/mouse sem um clique humano
    const overlay = document.createElement('div');
    overlay.id = "mc-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#0f0;font-family:monospace;";
    overlay.innerHTML = `
        <div id="mc-ui" style="text-align:center;">
            <h1 style="color:#fff;margin-bottom:20px;">JS-MINECRAFT XSS</h1>
            <div id="status" style="margin-bottom:20px;">SISTEMA PRONTO</div>
            <button id="start-btn" style="padding:15px 30px;background:#2e7d32;color:white;border:none;cursor:pointer;font-weight:bold;font-size:18px;border-radius:5px;">CLIQUE PARA COMEÇAR</button>
            <p style="font-size:10px;margin-top:20px;color:#666;">Use WASD para mover | Espaço para pular</p>
        </div>
        <div id="game-container" style="display:none;width:100%;height:100%;">
            <canvas id="canvas" style="width:100%;height:100%;"></canvas>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('start-btn').onclick = function() {
        this.style.display = 'none';
        document.getElementById('status').innerText = "CARREGANDO MUNDO...";
        document.getElementById('game-container').style.display = 'block';
        
        // 3. CARREGAR O MOTOR COMO MÓDULO
        const startScript = document.createElement('script');
        startScript.type = "module";
        startScript.src = repoBase + "src/js/Start.js";
        document.head.appendChild(startScript);
    };
})();
