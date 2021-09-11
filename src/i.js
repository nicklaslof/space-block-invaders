import Game from "./game.js";

var started = false;

window.onload = function () {
        onkeydown=e=>{
            document.getElementById("s").style.display = "none";
            if (!started){
                var game = new Game();
                started = true;
                gameloop();

            }

            function gameloop(){
                requestAnimationFrame(gameloop);
                game.mainLoop();
            }
    }
};