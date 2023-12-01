import GameState from "./states/GameState";
import PlayerTurn from "./states/PlayerTurn";
import Game from "./Game";
export default class StateMachine {
  private _currentState : GameState | undefined;
  private readonly _states: any;
    constructor(game : Game) {
      this._states = {
        playerTurn: new PlayerTurn(game),
      }
    }

  transitionTo(state : GameState) {
    if (this._currentState !== undefined){
      this._currentState.onExit();
    }
    this._currentState = state;
    this._currentState.onEnter();
  }

  get currentState(){
    return this._currentState;
  }

  get states(){
    return this._states;
  }

}