import Board from "./Board";
import Player from "./Player";
import StateMachine from "./StateMachine";
import { Ticker } from "pixi.js";
import Move from "./Move";
import AlphaBetaAI from "./AlphaBetaAI";
import RandomAI from "./RandomAI";
import MiniMaxAI from "./MiniMaxAI";
import * as PIXI from "pixi.js";
import { GAMEMODE } from "./helpers";
export default class Game {
  board: Board;
  private readonly players: Player[];
  stateMachine: StateMachine;
  currentPlayer: Player;
  moveHistory: Move[] = [];
  gameIsOver: boolean = false;
  constructor(
    size: number,
    private gameMode: number,
  ) {
    const app = new PIXI.Application({
      background: "#586770",
      width: 75 * size,
      height: 75 * size,
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

    this.board = new Board(app);
    this.board.initBoard();
    this.players = this.createPlayers();
    this.board.initPieces(app, this.players[0], this.players[1]);

    // initially set the currentPlayer to player 1,  so we can start the game switching to player 0
    this.currentPlayer = this.players[1];

    // set the listeners for our piece
    this.createListenersForPieces();
    this.createListenerForTiles();

    this.stateMachine = new StateMachine(this);
    this.stateMachine.transitionTo(this.stateMachine.states.switchTurn);
  }

  createPlayers() {
    let player1: Player;
    let player2: Player;
    if (this.gameMode === GAMEMODE.PlayerVsPlayer) {
      player1 = new Player(0xf9731c, 0);
      player2 = new Player(0xeec811, 1);
    } else if (this.gameMode === GAMEMODE.PlayerVsAI) {
      player1 = new Player(0xf9731c, 0);
      player2 = new AlphaBetaAI(0xeec811, 1, 9);
    } else if (this.gameMode === GAMEMODE.AIVsAI) {
      player1 = new AlphaBetaAI(0xf9731c, 0, 7);
      player2 = new AlphaBetaAI(0xeec811, 1, 7);
    }
    return [player1!, player2!];
  }

  createListenersForPieces() {
    const pieces = this.board.pieces;
    pieces.forEach((piece) => {
      if (piece.sprite) {
        if (
          piece.player instanceof RandomAI ||
          piece.player instanceof MiniMaxAI ||
          piece.player instanceof AlphaBetaAI
        ) {
          return;
        }
        piece.sprite.eventMode = "static";
        piece.sprite.on("pointerdown", () => {
          piece.player.selectPiece(piece, this.board);
        });
      }
    });
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
    Ticker.shared.add(this.update.bind(this));
    Ticker.shared.start();
  }

  update(delta: number) {
    if (
      this.stateMachine.currentState &&
      this.stateMachine.currentState.onUpdate
    ) {
      this.stateMachine.currentState.onUpdate(delta);
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
    let p1NumOfPieces = 0;
    let p2NumOfPieces = 0;

    this.board.pieces.forEach((piece) => {
      if (piece.player === this.currentPlayer) {
        p1NumOfPieces += 1;
      } else {
        p2NumOfPieces += 1;
      }
    });
    return (
      this.currentPlayer.score -
      otherPlayer.score +
      (p1NumOfPieces - p2NumOfPieces) * 0.25
    );
  }
}
