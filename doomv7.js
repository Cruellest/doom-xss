(function() {
    // 1. Injetar o CSS original que você forneceu
    var style = document.createElement('style');
    style.innerHTML = `
        .dosbox-container { width: 640px; height: 400px; background: #000; border: 2px solid #333; }
        .dosbox-container > .dosbox-overlay { background: url(https://js-dos.com/cdn/DOOM.png); background-size: cover; }
        #dosbox-wrapper { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; background: #111; padding: 20px; border-radius: 8px; box-shadow: 0 0 30px rgba(0,0,0,0.7); text-align: center; }
    `;
    document.head.appendChild(style);

    // 2. Criar a estrutura HTML (div e botão)
    var wrapper = document.createElement('div');
    wrapper.id = "dosbox-wrapper";
    wrapper.innerHTML = `
        <div id="dosbox" class="dosbox-container"></div>
        <br/>
        <button id="fs-btn" style="background:#c00; color:#fff; border:none; padding:10px 20px; cursor:pointer; font-family:sans-serif; font-weight:bold;">MAKE FULLSCREEN</button>
        <button onclick="document.getElementById('dosbox-wrapper').remove()" style="background:#444; color:#fff; border:none; padding:10px 20px; cursor:pointer; margin-left:10px;">FECHAR</button>
    `;
    document.body.appendChild(wrapper);

    // 3. Carregar a biblioteca js-dos-api via JSDelivr (Permitido pela CSP)
    // Usamos um mirror estável do GitHub no JSDelivr para garantir que o domínio seja aceito
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/caiiiycuk/js-dos@v3/dist/js-dos-api.js";
    
    script.onload = function() {
        console.log("Biblioteca js-dos-api carregada!");

        // 4. Inicializar conforme o seu código original
        // Nota: Mudei o link do jogo para um .zip público estável, 
        // já que o seu caminho "upload/..." não existe no servidor alvo.
        var dosbox = new Dosbox({
            id: "dosbox",
            onload: function (dosbox) {
                // Link oficial de teste da v3
                dosbox.run("https://js-dos.com/cdn/upload/DOOM-@evilution.zip", "./doom");
            },
            onrun: function (dosbox, app) {
                console.log("App '" + app + "' is runned");
            }
        });

        // Configura o botão de fullscreen
        document.getElementById('fs-btn').onclick = function() {
            dosbox.requestFullScreen();
        };
    };

    document.head.appendChild(script);
})();
