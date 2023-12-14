import TransitioningState from "./states/TransitioningState";
import PlayerTurn from "./states/PlayerTurn";
import Game from "./Game";
import SwitchTurn from "./states/SwitchTurn";
import Moving from "./states/Moving";
import GameOver from "./states/GameOver";
export default class StateMachine {
  private _currentState: TransitioningState | undefined;
  private readonly _states: any;
  constructor(game: Game) {
    this._states = {
      playerTurn: new PlayerTurn(game),
      switchTurn: new SwitchTurn(game),
      moving: new Moving(game),
      gameOver: new GameOver(game),
    };
  }

  transitionTo(state: TransitioningState) {
    if (this._currentState) {
      this._currentState.onExit();
    }
    this._currentState = state;
    this._currentState.onEnter();
  }

  get currentState() {
    return this._currentState;
  }

  get states() {
    return this._states;
  }
}
