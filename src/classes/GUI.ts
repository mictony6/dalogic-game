import Game from "./Game";
import * as PIXI from "pixi.js";
import startButtonImg from "../assets/startButton.png";
import titleSpriteImg from "../assets/titleSprite.png";
export default class GUI {
  startMenu: PIXI.Container;
  constructor(game: Game) {
    this.startMenu = this.getMenu(game);
  }

  getMenu(game: Game) {
    let app = game.app;
    // Create a start menu container
    const startMenu = new PIXI.Container();

    // Create a background for the start menu
    const background = new PIXI.Graphics();
    background.beginFill(0x333333);
    background.drawRect(0, 0, app.renderer.width, app.renderer.height);
    background.endFill();
    startMenu.addChild(background);

    // Create a title text
    const titleSprite = PIXI.Sprite.from(titleSpriteImg);
    //     new PIXI.Text("Game Title", {
    //   fontFamily: "Arial",
    //   fontSize: 48,
    //   fill: 0xffffff,
    // });
    titleSprite.scale.set(0.25);
    titleSprite.anchor.set(0.5, 0.5);
    titleSprite.position.set(app.renderer.width / 2, 100);
    startMenu.addChild(titleSprite);

    // Create a start button
    const startButton = PIXI.Sprite.from(startButtonImg);
    startButton.eventMode = "static";
    startButton.on("pointerdown", () => {
      game.stateMachine.transitionTo(game.stateMachine.states.switchTurn);
    });
    startButton.anchor.set(0.5);
    startButton.scale.set(0.25);
    // Calculate the center of the screen
    const centerX = app.renderer.width / 2;
    const centerY = app.renderer.height / 2;

    // Set the position of the startButton to the center of the screen
    startButton.position.set(centerX, centerY);

    startMenu.addChild(startButton);
    return startMenu;
  }
  showMenu(game: Game) {
    const app = game.app;
    app.stage.addChild(this.startMenu);
  }
  hideMenu(game: Game) {
    if (this.startMenu) {
      game.app.stage.removeChild(this.startMenu);
    }
    game.startGame();
  }
  showGameOver() {}
  hideGameOver() {}
}
