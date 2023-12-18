import TransitioningState from "./states/TransitioningState";
import PlayerTurn from "./states/PlayerTurn";
import Game from "./Game";
import SwitchTurn from "./states/SwitchTurn";
import Moving from "./states/Moving";
import GameOver from "./states/GameOver";
import { StateChangeEvent } from "./GameEvent";
import gameEventListener from "./GameEventListener";
export default class StateMachine {
  private _currentState: TransitioningState | undefined;
  private readonly _states: any;
  private game: Game;
  constructor(game: Game) {
    this.game = game;
    this._states = {
      playerTurn: new PlayerTurn(),
      switchTurn: new SwitchTurn(),
      moving: new Moving(),
      gameOver: new GameOver(),
    };
  }

  transitionTo(state: TransitioningState) {
    gameEventListener.trigger(new StateChangeEvent(state));
    if (this._currentState) {
      this._currentState.onExit(this.game);
    }
    this._currentState = state;
    this._currentState.onEnter(this.game);
  }

  get currentState() {
    return this._currentState;
  }

  get states() {
    return this._states;
  }
}
