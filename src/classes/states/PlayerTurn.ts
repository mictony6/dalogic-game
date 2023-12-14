import TransitioningState from "./TransitioningState";
import GameState from "./GameState";
import Game from "../Game";

export default class PlayerTurn
  extends GameState
  implements TransitioningState
{
  onEnter() {
    if (this.game.isOver()) {
      this.game.stateMachine.transitionTo(
        this.game.stateMachine.states.gameOver,
      );
    } else {
      this.game.currentPlayer.perform(this.game);
    }
  }

  onExit() {}

  onUpdate(_delta: number) {
    const currentPlayer = this.game.currentPlayer;
    if (currentPlayer && currentPlayer.selectedMove) {
      this.game.stateMachine.transitionTo(this.game.stateMachine.states.moving);
    }
  }
}
