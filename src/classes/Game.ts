import Board from "./Board";
import Player from "./Player";
import StateMachine from "./StateMachine";
import { Application, ICanvas, Ticker } from "pixi.js";

export default class Game {
  board: Board;
  private readonly players: Player[];
  private stateMachine: StateMachine;
  constructor(private app: Application<ICanvas>) {
    this.board = new Board(app);
    this.board.initBoard();
    this.players = this.createPlayers();
    this.board.initPieces(app, this.players[0], this.players[1]);

    this.stateMachine = new StateMachine(this);
    this.stateMachine.transitionTo(this.stateMachine.states.playerTurn);
  }

  startGame() {
    Ticker.shared.add(this.update.bind(this));
    Ticker.shared.start();
  }

  createPlayers() {
    const player1 = new Player(0xf9731c, 0);
    const player2 = new Player(0xeec811, 1);
    return [player1, player2];
  }

  makeMove() {}

  undoMove() {}

  update(delta: number) {
    if (
      this.stateMachine.currentState &&
      this.stateMachine.currentState.onUpdate
    ) {
      this.stateMachine.currentState.onUpdate(delta);
    }
  }
}
