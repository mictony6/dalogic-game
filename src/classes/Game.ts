import Board from "./Board";
import Player from "./Player";
import StateMachine from "./StateMachine";
import { Application, ICanvas, Ticker } from "pixi.js";
import Move from "./Move";
import AlphaBetaAI from "./AlphaBetaAI";

export default class Game {
  board: Board;
  private readonly players: Player[];
  stateMachine: StateMachine;
  currentPlayer: Player;
  moveHistory: Move[] = [];
  gameIsOver: boolean = false;
  constructor(private app: Application<ICanvas>) {
    this.board = new Board(app);
    this.board.initBoard();
    this.players = this.createPlayers();
    this.board.initPieces(app, this.players[0], this.players[1]);

    // initially set the currentPlayer to player 1 so we can start the game switching to player 0
    this.currentPlayer = this.players[1];

    // set the listeners for our pieces
    this.createListenersForPieces();
    this.createListenerForTiles();

    this.stateMachine = new StateMachine(this);
    this.stateMachine.transitionTo(this.stateMachine.states.switchTurn);
  }

  createPlayers() {
    const player1 = new AlphaBetaAI(0xf9731c, 0, 3);
    const player2 = new AlphaBetaAI(0xeec811, 1, 6);
    return [player1, player2];
  }

  createListenersForPieces() {
    const pieces = this.board.pieces;
    pieces.forEach((piece) => {
      if (piece.sprite) {
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
