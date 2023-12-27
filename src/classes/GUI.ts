import Game from "./Game";
import * as PIXI from "pixi.js";
import startButtonImg from "../assets/startButton.png";
import titleSpriteImg from "../assets/titleSprite.png";
export default class GUI {
  startMenu: PIXI.Container;
  private gameOverScreen: PIXI.Container | null;
  private waitingScreen: PIXI.Container;
  constructor(game: Game) {
    this.startMenu = this.createMenuScreen(game);
    this.gameOverScreen = null;
    this.waitingScreen = this.createWaitingScreen(game);
  }

  createMenuScreen(game: Game) {
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
  showGameOver(game: Game) {
    const app = game.app;
    this.gameOverScreen = this.createGameOverScreen(game);
    app.stage.addChild(this.gameOverScreen);
  }

  hideGameOver(game: Game) {
    if (this.gameOverScreen) {
      game.app.stage.removeChild(this.gameOverScreen);
    }
    game.startGame();
  }

  showWaitingScreen(game: Game) {
    const app = game.app;
    app.stage.addChild(this.waitingScreen);
  }

  hideWaitingScreen(game: Game) {
    if (this.waitingScreen) {
      game.app.stage.removeChild(this.waitingScreen);
    }
    // Continue with the game or show the appropriate UI
  }

  private createGameOverScreen(game: Game) {
    const app = game.app;
    // Get the array of players
    const players = game.getPlayers();

    // Find the player with the highest score
    const winner = players.reduce((prev, current) =>
      prev.score > current.score ? prev : current,
    );

    // Create a game over text with winner information
    const gameOverText = new PIXI.Text(
      `Game Over\nWinner: Player ${winner.id}\nScore: ${winner.score}`,
      {
        fontFamily: "Arial",
        fontSize: 36,
        fill: 0xffffff,
        align: "center",
      },
    );
    gameOverText.anchor.set(0.5, 0.5);
    gameOverText.position.set(app.renderer.width / 2, app.renderer.height / 2);

    return gameOverText;
  }

  private createWaitingScreen(game: Game) {
    const app = game.app;
    const waitingText = new PIXI.Text("Waiting for Opponent", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    });
    waitingText.anchor.set(0.5, 0.5);
    waitingText.position.set(app.renderer.width / 2, app.renderer.height / 2);
    return waitingText;
  }
}
