import TransitioningState from "./TransitioningState";
import GameState from "./GameState";
import Game from "../Game";

export default class PlayerTurn
  extends GameState
  implements TransitioningState
{
  onEnter() {
    console.log("Entering PlayerTurn State");
  }

  onExit() {
    console.log("Exiting PlayerTurn State");
  }

  onUpdate(_delta: number) {
    const currentPlayer = this.game.currentPlayer;
    if (currentPlayer && currentPlayer.selectedMove) {
      this.game.stateMachine.transitionTo(this.game.stateMachine.states.moving);
    }
  }
}
