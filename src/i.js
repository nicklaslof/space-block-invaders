import Game from "./game.js";

var started = false;
var game;

window.onload = function () {
        onkeydown=e=>{
            document.getElementById("s").style.display = "none";
            if (!started){
                
                started = true;
                gameloop();

            }

            function gameloop(){
                requestAnimationFrame(gameloop);
                if (game == null) game = new Game();
                game.mainLoop();
            }
    }
};