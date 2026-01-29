(function() {
    // 1. Carregar Tailwind CSS (necessário para as classes do seu HTML funcionarem)
    // A sua CSP permite o domínio cdn.tailwindcss.com!
    var tw = document.createElement('script');
    tw.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tw);

    // 2. Carregar a biblioteca js-dos (Motor do jogo)
    var jsdos = document.createElement('script');
    jsdos.src = "https://cdn.jsdelivr.net/npm/js-dos/dist/js-dos.js";
    document.head.appendChild(jsdos);

    // 3. Criar o container principal (estilo Modal para não quebrar o site)
    var mainContainer = document.createElement('div');
    mainContainer.id = "xss-doom-overlay";
    mainContainer.style = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:9999; width:90vw; height:80vh; background:#000; border:4px solid #333; overflow:hidden; box-shadow: 0 0 50px #000;";
    
    // Injetando o HTML que você enviou (Simplificado para funcionar dinamicamente)
    mainContainer.innerHTML = `
        <div class="wh-full z-10 jsdos-rso flex flex-col h-full bg-black text-white font-sans">
            <div class="flex flex-row h-full w-full">
                <div class="w-14 bg-zinc-900 flex flex-col items-center py-4 gap-4 border-r border-zinc-800">
                    <div class="w-8 h-8 text-zinc-500 hover:text-white cursor-pointer">💾</div>
                    <div class="w-8 h-8 text-zinc-500 hover:text-white cursor-pointer">⚙️</div>
                    <div class="mt-auto mb-4 text-xs font-mono text-zinc-600">TURBO</div>
                </div>
                
                <div class="flex-grow relative flex flex-col bg-black">
                    <div id="doom-status" class="absolute top-2 left-1/2 -translate-x-1/2 z-20 text-xs text-green-500 font-mono">
                        INICIALIZANDO SISTEMA...
                    </div>
                    <div id="dosbox" class="w-full h-full flex items-center justify-center">
                        </div>
                </div>
            </div>
            <button onclick="document.getElementById('xss-doom-overlay').remove()" style="position:absolute; top:10px; right:10px; background:red; color:white; border:none; padding:5px 10px; cursor:pointer; z-index:10000;">X</button>
        </div>
    `;
    document.body.appendChild(mainContainer);

    // 4. Iniciar o jogo assim que a biblioteca carregar
    jsdos.onload = function() {
        var status = document.getElementById('doom-status');
        status.innerText = "BAIXANDO DOOM.JSDOS...";
        
        // Usando o link do motor JS-DOS versão 6 (compatível com o JSDelivr)
        Dos(document.getElementById("dosbox")).run("https://cdn.dos.zone/custom/dos/doom.jsdos").then((runtime) => {
            status.innerText = "SISTEMA OPERACIONAL: DOS (DOOM)";
            // Esconde o status após 3 segundos
            setTimeout(() => { status.style.opacity = '0.3'; }, 3000);
        });
    };
})();
