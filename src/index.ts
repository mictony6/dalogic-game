import * as PIXI from "pixi.js";
import Game from "./classes/Game";

const app = new PIXI.Application({
  background: "#74bbde",
  width: 64 * 8,
  height: 64 * 8,
  antialias: true,
  autoStart: false,
});

// @ts-ignore
globalThis.__PIXI_APP__  = app;

const centerDiv = document.getElementById("center");

const canvasStyle = app.renderer.view.style;
if (canvasStyle instanceof CSSStyleDeclaration) {
  canvasStyle.position = "absolute";
  // @ts-ignore
  centerDiv.appendChild(app.view);
} else {
  console.error("canvas style is not an instance of CSSStyleDeclaration");
}


const game = new Game(app);
game.startGame()

