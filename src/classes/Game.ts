import Board from "./Board";
import Player from "./Player";
import StateMachine from "./StateMachine";
import {Application, ICanvas} from "pixi.js";

export default class Game {
  board: Board;
  app: Application<ICanvas>;
  private players: Player[];
  private stateMachine: StateMachine;
  constructor(app: Application<ICanvas>) {
    this.app = app;
    this.board = new Board(app);
    this.board.initBoard()
    this.players = this.createPlayers();
    this.board.initPieces(app, this.players[0], this.players[1]);

    this.stateMachine = new StateMachine(this);
    this.stateMachine.transitionTo( this.stateMachine.states.playerTurn);
  }

  startGame(){
    this.app.ticker.add(this.update.bind(this));
    this.app.ticker.start();
  }

  createPlayers(){
    const player1 = new Player(0x0000ff, 0);
    const player2 = new Player(0xff0000, 1);
    return [player1, player2];
  }

  makeMove(){

  }

  undoMove(){


  }

  update(delta : number){
    if (
     this.stateMachine.currentState &&
      this.stateMachine.currentState.onUpdate
    ) {
      this.stateMachine.currentState.onUpdate(delta);
    }
  }




}