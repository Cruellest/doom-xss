(function() {
    // 1. Configuração Global de Segurança
    // Forçamos o motor de emulação a buscar os módulos (WASM/JS) apenas no JSDelivr
    window.emulators = window.emulators || {};
    window.emulators.pathPrefix = "https://cdn.jsdelivr.net/npm/emulators/dist/";

    // 2. Carregar Estilos e Scripts na ordem correta
    const loadScript = (url) => {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = url;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    };

    const loadCSS = (url) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    };

    // 3. Montar a Interface (Overlay Estilo Dos.Zone)
    const setupUI = () => {
        const overlay = document.createElement('div');
        overlay.id = "doom-overlay";
        overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;background:#000;display:flex;flex-direction:column;color:white;font-family:sans-serif;";
        overlay.innerHTML = `
            <div class="flex flex-row h-full w-full bg-zinc-950 overflow-hidden">
                <div class="w-14 bg-black border-r border-zinc-800 flex flex-col items-center py-6 gap-6">
                    <div class="text-zinc-500 hover:text-white cursor-pointer">💾</div>
                    <div class="text-zinc-500 hover:text-white cursor-pointer">⚙️</div>
                </div>
                <div class="flex-grow flex flex-col relative">
                    <div class="h-8 bg-zinc-900 flex items-center px-4 justify-between border-b border-zinc-800">
                        <span class="text-[10px] font-mono text-zinc-400">DOOM_LATEST_ENGINE_XSS</span>
                        <button onclick="document.getElementById('doom-overlay').remove()" class="text-zinc-500 hover:text-red-500">✕</button>
                    </div>
                    <div id="status" class="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-green-500 font-mono text-[10px] uppercase">
                        Aguardando Emuladores...
                    </div>
                    <div id="dosbox" class="flex-grow flex items-center justify-center bg-black"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    };

    // 4. Execução em Cadeia
    async function start() {
        setupUI();
        const status = document.getElementById('status');

        try {
            loadCSS("https://cdn.jsdelivr.net/npm/js-dos/dist/js-dos.css");
            
            status.innerText = "Carregando Emuladores (JSDelivr)...";
            await loadScript("https://cdn.jsdelivr.net/npm/emulators/dist/emulators.js");
            
            status.innerText = "Carregando Motor JS-DOS...";
            await loadScript("https://cdn.jsdelivr.net/npm/js-dos/dist/js-dos.js");

            status.innerText = "Baixando DOOM.JSDOS...";
            // Chamada da versão Latest
            const runtime = await Dos(document.getElementById("dosbox")).run("https://cdn.dos.zone/custom/dos/doom.jsdos");
            
            status.innerText = "DOOM RODANDO!";
            setTimeout(() => status.style.display = 'none', 3000);
            
        } catch (err) {
            status.innerText = "ERRO: " + err.message;
            console.error("XSS Error:", err);
        }
    }

    start();
})();
