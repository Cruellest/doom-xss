(function() {
    // 1. Injetar o CSS do js-dos (essencial para o canvas aparecer)
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = "https://cdn.jsdelivr.net/npm/js-dos@6.2.1/dist/js-dos.css";
    document.head.appendChild(link);

    // 2. Criar a interface
    var container = document.createElement('div');
    container.style = "position:fixed; bottom:20px; right:20px; z-index:9999; background:#000; border:2px solid #555; padding:10px; box-shadow: 0 0 20px rgba(0,0,0,0.5);";
    container.innerHTML = `
        <div id="doom-header" style="color:#0f0; font-family:monospace; margin-bottom:5px; font-size:12px;">XSS DOOM Status: <span id="status">Carregando...</span></div>
        <div id="dosbox" style="width:480px; height:320px;"></div>
        <button onclick="dosbox.requestFullScreen();" style="width:100%; margin-top:5px; cursor:pointer; background:#333; color:#fff; border:1px solid #777;">TELA CHEIA</button>
    `;
    document.body.appendChild(container);

    // 3. Carregar o Script do js-dos via jsDelivr (permitido pela sua CSP)
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/js-dos@6.2.1/dist/js-dos.js";
    
    script.onload = function() {
        document.getElementById('status').innerText = "Iniciando motor DOS...";
        
        // Inicializa o jogo
        // Se a CSP bloquear o download do .jsdos, o erro aparecerá no console como 'connect-src'
        Dos(document.getElementById("dosbox")).run("https://js-dos.com/DOOM/DOOM.jsdos");
        
        document.getElementById('status').innerText = "RODANDO!";
    };

    script.onerror = function() {
        document.getElementById('status').innerText = "Erro no carregamento do JS!";
    };

    document.head.appendChild(script);
})();
