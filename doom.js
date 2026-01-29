(function() {
    // 1. CSS do js-dos via jsDelivr (estável)
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = "https://cdn.jsdelivr.net/npm/js-dos/dist/js-dos.css";
    document.head.appendChild(link);

    // 2. Interface flutuante
    var container = document.createElement('div');
    container.style = "position:fixed; bottom:10px; left:10px; z-index:9999; background:#1a1a1a; border:1px solid #444; padding:10px; border-radius:8px; box-shadow: 0 4px 15px rgba(0,0,0,0.8);";
    container.innerHTML = `
        <div style="color:#ff0000; font-family:monospace; font-weight:bold; margin-bottom:10px; text-shadow: 1px 1px #000;">
            [ XSS DOOM SYSTEM ] <span id="doom-status" style="color:#fff">Carregando...</span>
        </div>
        <div id="dosbox" style="width:480px; height:320px; background:#000;"></div>
        <div style="margin-top:10px; display:flex; gap:5px;">
            <button onclick="dosbox.requestFullScreen();" style="flex:1; cursor:pointer; background:#444; color:#fff; border:1px solid #666; padding:5px;">FULLSCREEN</button>
            <button onclick="this.parentElement.parentElement.remove();" style="background:#800; color:#fff; border:none; padding:5px 10px; cursor:pointer;">X</button>
        </div>
    `;
    document.body.appendChild(container);

    // 3. Carregar o Motor do Jogo via jsDelivr (na sua Whitelist)
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/js-dos@6.2.1/dist/js-dos.js";
    
    script.onload = function() {
        document.getElementById('doom-status').innerText = "Montando drive C:...";
        
        // 4. Inicializar o Jogo usando um Mirror alternativo do arquivo .jsdos
        // Se o link original do js-dos.com falhar, usamos este mirror:
        var gameUrl = "https://cdn.jsdelivr.net/gh/google/flatbuffers/samples/monster_generated.h"; // Apenas exemplo, vamos usar o do archive.org ou mirror estável
        
        // Link alternativo do Doom (Archive.org costuma ser liberado e estável)
        var doomMirror = "https://js-dos.com/DOOM/DOOM.jsdos"; 

        Dos(document.getElementById("dosbox")).run(doomMirror).then((runtime) => {
            document.getElementById('doom-status').innerText = "EM EXECUÇÃO";
            window.dosbox = runtime; // Salva para o botão de fullscreen funcionar
        });
    };

    script.onerror = function() {
        document.getElementById('doom-status').innerText = "ERRO NA BIBLIOTECA";
    };

    document.head.appendChild(script);
})();
