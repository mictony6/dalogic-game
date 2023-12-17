import * as PIXI from "pixi.js";
import Game from "./classes/Game";
import "./styles.css";

const game = new Game(8);
const undoButton = document.getElementById("undoButton")!;
undoButton.onclick = () => {
  game.undo();
};

game.startGame();
