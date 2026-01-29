(function() {
    // 1. OVERRIDE CRÍTICO: Definimos o caminho ANTES de qualquer carregamento
    // Isso diz ao motor: "Não vá para v8.js-dos.com, tudo o que você precisa está aqui"
    window.emulators = {
        pathPrefix: "https://cdn.jsdelivr.net/npm/emulators@latest/dist/",
    };

    const loadScript = (url) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = url;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });

    // 2. Interface (Overlay que cobre a página)
    const overlay = document.createElement('div');
    overlay.id = "doom-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#000;color:#0f0;font-family:monospace;display:flex;flex-direction:column;";
    overlay.innerHTML = `
        <div style="background:#111;padding:10px;border-bottom:1px solid #333;display:flex;justify-content:space-between;">
            <span>[ XSS_DOOM_ENGINE_LATEST ]</span>
            <button onclick="document.getElementById('doom-overlay').remove()" style="background:red;color:white;border:none;cursor:pointer;">[ FECHAR ]</button>
        </div>
        <div id="status" style="padding:10px;font-size:12px;">INICIANDO_BYPASS...</div>
        <div id="dosbox" style="flex-grow:1;"></div>
    `;
    document.body.appendChild(overlay);

    async function start() {
        const status = document.getElementById('status');
        try {
            // Passo 1: Carregar os emuladores explicitamente do JSDelivr
            status.innerText = "CARREGANDO_EMULADORES_DO_JSDELIVR...";
            await loadScript("https://cdn.jsdelivr.net/npm/emulators@latest/dist/emulators.js");
            
            // Passo 2: Carregar a interface do JS-DOS
            status.innerText = "CARREGANDO_MOTOR_PRINCIPAL...";
            await loadScript("https://cdn.jsdelivr.net/npm/js-dos@latest/dist/js-dos.js");

            // Passo 3: Rodar o jogo
            status.innerText = "BAIXANDO_DOOM_DATA...";
            
            // Na versão LATEST, 'Dos' é uma função global
            if (typeof Dos === "function") {
                const player = Dos(document.getElementById("dosbox"));
                
                // O método .run() retorna uma promessa
                player.run("https://cdn.dos.zone/custom/dos/doom.jsdos").then(() => {
                    status.innerText = "DOOM_EXECUTANDO_COM_SUCESSO";
                    setTimeout(() => status.style.opacity = '0', 3000);
                }).catch(err => {
                    status.innerText = "ERRO_NA_EXECUCAO: " + err;
                });
            } else {
                throw new Error("MOTOR_DOS_NAO_ENCONTRADO");
            }

        } catch (err) {
            status.innerText = "FALHA_CRITICA: " + err.message;
            console.error("XSS_DEBUG:", err);
        }
    }

    start();
})();
