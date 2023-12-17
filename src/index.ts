import Game from "./classes/Game";
import "./styles.css";
import { GAMEMODE } from "./classes/helpers";

const game = new Game(8, GAMEMODE.PlayerVsPlayer);
const undoButton = document.getElementById("undoButton")!;
undoButton.onclick = () => {
  game.undo();
};

game.startGame();
