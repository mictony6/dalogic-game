import * as PIXI from "pixi.js";
import Game from "./classes/Game";
import "./styles.css";

const app = new PIXI.Application({
  background: "#586770",
  width: 75 * 8,
  height: 75 * 8,
  antialias: true,
  autoStart: false,
  sharedTicker: true,
});

// @ts-ignore
globalThis.__PIXI_APP__ = app;

const centerDiv = document.getElementById("center");

const canvasStyle = app.renderer.view.style;
if (canvasStyle instanceof CSSStyleDeclaration) {
  canvasStyle.position = "absolute";
  // @ts-ignore
  centerDiv!.appendChild(app.view);
} else {
  console.error("canvas style is not an instance of CSSStyleDeclaration");
}

const game = new Game(app);
const undoButton = document.getElementById("undoButton")!;
undoButton.onclick = () => {
  game.undo();
};

game.startGame();
