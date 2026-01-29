(function() {
    // 1. Forçar a configuração do emulador para o JSDelivr
    // Isso evita que o motor tente acessar o domínio bloqueado v8.js-dos.com
    window.emulators = {
        pathPrefix: "https://cdn.jsdelivr.net/npm/emulators/dist/",
    };

    const loadScript = (url) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = url;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });

    // 2. Criar a interface (Overlay)
    const overlay = document.createElement('div');
    overlay.id = "doom-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;background:#000;display:flex;flex-direction:column;color:white;font-family:monospace;";
    overlay.innerHTML = `
        <div class="flex flex-col h-full w-full bg-black overflow-hidden">
            <div class="h-10 bg-zinc-900 flex items-center px-4 justify-between border-b border-zinc-800">
                <span class="text-green-500">DOOM_XSS_V5.EXE</span>
                <button onclick="document.getElementById('doom-overlay').remove()" class="text-white hover:text-red-500"> [ ESC ] </button>
            </div>
            <div id="status" class="p-2 text-[10px] text-zinc-400 uppercase text-center">Iniciando bypass de CSP...</div>
            <div id="dosbox" class="flex-grow bg-black"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    async function start() {
        const status = document.getElementById('status');
        try {
            // Passo 1: Carregar o motor de emulação (Obrigatório ser primeiro)
            status.innerText = "Carregando emuladores do JSDelivr...";
            await loadScript("https://cdn.jsdelivr.net/npm/emulators/dist/emulators.js");
            
            // Passo 2: Carregar a biblioteca JS-DOS
            status.innerText = "Injetando motor JS-DOS...";
            await loadScript("https://cdn.jsdelivr.net/npm/js-dos/dist/js-dos.js");

            // Passo 3: Configurar e Rodar
            status.innerText = "Baixando DOOM (dos.zone)...";
            
            // Usando a sintaxe v7/v8 compatível
            const jsdos = window.Dos(document.getElementById("dosbox"));
            jsdos.run("https://cdn.dos.zone/custom/dos/doom.jsdos").then((runtime) => {
                status.innerText = "DOOM EXECUTANDO - DIVIRTA-SE";
                setTimeout(() => status.style.display = 'none', 5000);
            });

        } catch (e) {
            status.innerText = "ERRO: " + e.message;
            console.error("Erro no XSS:", e);
        }
    }

    start();
})();
