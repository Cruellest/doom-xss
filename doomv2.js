(function() {
    // 1. Configuração de Caminhos (O segredo para vencer a CSP)
    // Forçamos o motor a buscar os emuladores no JSDelivr, que o site permite.
    window.emulators = window.emulators || {};
    window.emulators.pathPrefix = "https://cdn.jsdelivr.net/npm/emulators/dist/";

    // 2. Carregar Estilos (Tailwind e JS-DOS Latest)
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = "https://cdn.jsdelivr.net/npm/js-dos/dist/js-dos.css";
    document.head.appendChild(css);

    var tw = document.createElement('script');
    tw.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tw);

    // 3. Carregar as Bibliotecas (Emuladores primeiro, depois o JS-DOS)
    var emuScript = document.createElement('script');
    emuScript.src = "https://cdn.jsdelivr.net/npm/emulators/dist/emulators.js";
    document.head.appendChild(emuScript);

    var jsdos = document.createElement('script');
    jsdos.src = "https://cdn.jsdelivr.net/npm/js-dos/dist/js-dos.js";
    
    // 4. Interface (Overlay centralizado)
    var overlay = document.createElement('div');
    overlay.id = "doom-overlay";
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; z-index:10000; background:#000; display:flex; flex-direction:column;";
    overlay.innerHTML = `
        <div class="flex flex-row h-full w-full bg-zinc-950 text-white font-sans overflow-hidden">
            <div class="w-14 bg-black border-r border-zinc-800 flex flex-col items-center py-6 gap-6">
                <div class="text-zinc-500 hover:text-white cursor-pointer">💾</div>
                <div class="text-zinc-500 hover:text-white cursor-pointer">⚙️</div>
                <div class="mt-auto text-red-600 font-bold text-[10px] rotate-90 mb-4 uppercase">Latest Engine</div>
            </div>
            <div class="flex-grow flex flex-col relative">
                <div class="h-8 bg-zinc-900 flex items-center px-4 justify-between border-b border-zinc-800">
                    <span class="text-xs font-mono text-zinc-400">DOOM XSS - LATEST VERSION</span>
                    <button onclick="document.getElementById('doom-overlay').remove()" class="text-zinc-500 hover:text-red-500 text-lg">✕</button>
                </div>
                <div id="status" class="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-green-500 font-mono text-[10px] uppercase">
                    Initializing latest emulators...
                </div>
                <div id="dosbox" class="flex-grow flex items-center justify-center bg-black"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 5. Iniciar o Jogo (Sintaxe da Versão Latest/v8)
    jsdos.onload = function() {
        var status = document.getElementById('status');
        status.innerText = "LOADING DOOM.JSDOS FROM DOS.ZONE...";

        // Na versão latest (v8), o comando mudou para Dos(element).run(url)
        Dos(document.getElementById("dosbox")).run("https://cdn.dos.zone/custom/dos/doom.jsdos").then((runtime) => {
            status.innerText = "DOOM RUNNING (LATEST)";
            // Esconde o status após carregar
            setTimeout(() => { status.style.opacity = '0.2'; }, 3000);
        }).catch(err => {
            status.innerHTML = "ERROR: " + err;
            console.error(err);
        });
    };

    document.head.appendChild(jsdos);
})();
