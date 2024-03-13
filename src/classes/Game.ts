import Board from "./Board";
import Player from "./Player";
import StateMachine from "./StateMachine";
import { Application, ICanvas, Ticker } from "pixi.js";
import Move from "./Move";
import AlphaBetaAI from "./AlphaBetaAI";
import RandomAI from "./RandomAI";
import MiniMaxAI from "./MiniMaxAI";
import * as PIXI from "pixi.js";
import { GAMEMODE } from "./helpers";
import GUI from "./GUI";
import ExpectimaxAI from "./ExpectimaxAI";
export default class Game {
  board: Board;
  players!: Player[];
  stateMachine: StateMachine;
  currentPlayer!: Player;
  moveHistory: Move[] = [];
  gameIsOver: boolean = false;
  app: Application<ICanvas>;
  gui: GUI;
  constructor(
    size: number,
    public gameMode: number,
  ) {
    const app = new PIXI.Application({
      background: "#586770",
      width: 75 * size,
      height: 75 * size,
      antialias: true,
      autoStart: false,
      sharedTicker: true,
    });

    this.app = app;
    // @ts-ignore
    globalThis.__PIXI_APP__ = app;

    const centerDiv = document.getElementById("center");

    const canvasStyle = app.renderer.view.style;
    if (canvasStyle instanceof CSSStyleDeclaration) {
      // canvasStyle.position = "absolute";
      if (centerDiv) {
        // @ts-ignore
        centerDiv.appendChild(app.view);
      }
    } else {
      console.error("canvas style is not an instance of CSSStyleDeclaration");
    }

    this.board = new Board(app);
    this.board.initBoard();
    this.stateMachine = new StateMachine(this);
    this.gui = new GUI(this);
  }

  removeFromStage() {
    const centerDiv = document.getElementById("center")!;
    // @ts-ignore
    centerDiv.removeChild(this.app.view);
    this.app.stage.removeChild(this.board.container);
    Ticker.shared.stop();
  }

  createPlayers() {
    let player1: Player;
    let player2: Player;
    if (this.gameMode === GAMEMODE.PlayerVsPlayer) {
      player1 = new Player(0xf9731c, 0);
      player2 = new Player(0xeec811, 1);
    } else if (this.gameMode === GAMEMODE.PlayerVsAI) {
      player1 = new Player(0xf9731c, 0);
      player2 = new MiniMaxAI(0xeec811, 1, 3);
    } else if (this.gameMode === GAMEMODE.AIVsAI) {
      player1 = new ExpectimaxAI(0xf9731c, 0, 3);
      player2 = new RandomAI(0xeec811, 1);
    }
    player1!.direction = -1;
    this.players = [player1!, player2!];
  }

  createListenersForPieces() {
    const pieces = this.board.pieces;
    for (let piece of pieces) {
      if (piece.sprite) {
        if (
          piece.player instanceof RandomAI ||
          piece.player instanceof MiniMaxAI ||
          piece.player instanceof AlphaBetaAI ||
          piece.player === this.players[1]
        ) {
          piece.sprite.eventMode = "none";
          continue;
        }
        piece.sprite.eventMode = "static";
        piece.sprite.on("pointerdown", () => {
          piece.player.selectPiece(piece, this.board);
        });
      }
    }
  }

  createListenerForTiles() {
    const tiles = this.board.tiles;
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      if (tile.sprite) {
        tile.sprite.eventMode = "static";
        tile.sprite.on("pointerdown", () => {
          this.currentPlayer.selectTile(tile, this.board);
        });
      }
    }
  }

  startGame() {
    // set the listeners for our piece
    this.createListenersForPieces();
    this.createListenerForTiles();

    Ticker.shared.add(this.update.bind(this));
    Ticker.shared.start();
  }

  update(delta: number) {
    if (
      this.stateMachine.currentState &&
      this.stateMachine.currentState.onUpdate
    ) {
      this.stateMachine.currentState.onUpdate(delta, this);
    }
  }

  getPlayers() {
    return this.players;
  }

  undo() {
    let lastMove = this.moveHistory.pop();
    if (lastMove) {
      lastMove.undo(this.board);
      this.stateMachine.transitionTo(this.stateMachine.states.switchTurn);
    } else {
      console.log("No more moves to undo");
    }
  }

  isOver() {
    return (
      this.gameIsOver ||
      this.board.getAllValidMoves(this.players[0]).length === 0 ||
      this.board.getAllValidMoves(this.players[1]).length === 0
    );
  }

  evaluate() {
    const otherPlayer = this.players.find((p) => p != this.currentPlayer)!;
    let currPlayerPieceWeights = 0;
    let otherPlayerPieceWeights = 0;

    this.board.pieces.forEach((piece) => {
      if (piece.player === this.currentPlayer) {
        currPlayerPieceWeights += piece.pieceValue;
      } else {
        otherPlayerPieceWeights += piece.pieceValue;
      }
    });
    return (
      this.currentPlayer.score -
      otherPlayer.score +
      (currPlayerPieceWeights - otherPlayerPieceWeights)
    );
  }

  setPlayers(player1: Player, player2: Player) {
    this.players = [player1, player2];
  }

  restart() {
    this.createPlayers();
    this.app.stage.removeChild(this.board.container);
    const pieces = this.board.pieces;
    for (let piece of pieces) {
      if (piece.sprite) {
        piece.sprite.destroy();
      }
    }

    for (let tile of this.board.tiles) {
      if (tile.sprite) {
        tile.sprite.destroy();
      }
    }
    this.board.container.destroy();
    this.board = new Board(this.app);
    this.board.initBoard();
    this.board.initPieces(this.app, this.players[0], this.players[1]);
    this.stateMachine.transitionTo(this.stateMachine.states.switchTurn);
  }
}
