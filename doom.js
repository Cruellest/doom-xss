(function() {
    // 1. Injetar o CSS necessário para o container do jogo
    var style = document.createElement('style');
    style.innerHTML = `
        .dosbox-container { width: 640px; height: 400px; position: relative; background: #000; margin: 20px auto; border: 5px solid #333; }
        .dosbox-container > .dosbox-overlay { background: url(https://js-dos.com/cdn/DOOM.png); background-size: cover; }
        #doom-status { color: #0f0; font-family: monospace; text-align: center; }
    `;
    document.head.appendChild(style);

    // 2. Criar a interface do jogo (Canvas e Botão)
    var container = document.createElement('div');
    container.style.textAlign = "center";
    container.innerHTML = `
        <div id="doom-status">Carregando DOOM via XSS...</div>
        <div id="dosbox" class="dosbox-container"></div>
        <br/>
        <button onclick="dosbox.requestFullScreen();" style="padding: 10px 20px; background: #c00; color: #fff; border: none; cursor: pointer; font-weight: bold;">MODO TELA CHEIA</button>
    `;
    
    // Insere o jogo no final da página para não quebrar a tabela onde o XSS está
    document.body.appendChild(container);

    // 3. Carregar a biblioteca js-dos dinamicamente
    // Usamos o cdnjs ou jsdelivr porque sua CSP permite esses domínios!
    var script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/js-dos/6.2.1/js-dos.js";
    
    script.onload = function() {
        document.getElementById('doom-status').innerText = "Iniciando MS-DOS...";
        
        // 4. Inicializar o DOOM
        // Nota: Se a sua CSP for muito restrita, o download do .jsdos pode ser bloqueado.
        Dos(document.getElementById("dosbox")).run("https://js-dos.com/DOOM/DOOM.jsdos");
        
        document.getElementById('doom-status').innerText = "DOOM PRONTO! Clique no jogo para jogar.";
    };

    script.onerror = function() {
        document.getElementById('doom-status').innerText = "Erro ao carregar biblioteca js-dos. Verifique a CSP.";
    };

    document.head.appendChild(script);
})();
