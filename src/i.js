import Game from "./game.js";

var g = new Game();

mainLoop();

function mainLoop(){
    requestAnimationFrame(mainLoop);
    g.mainLoop();
}