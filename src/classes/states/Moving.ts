import TransitioningState from "./TransitioningState";
import GameState from "./GameState";

export default class Moving extends GameState implements TransitioningState {
  onEnter(): void {
    console.log("Moving...");
  }

  onExit(): void {}

  onUpdate(delta: number): void {
    const selectedMove = this.game.currentPlayer.selectedMove!;
    if (selectedMove.isCapture) {
      this.game.stateMachine.transitionTo(
        this.game.stateMachine.states.capturing,
      );
    }
    this.game.makeMove(selectedMove);
    if (selectedMove.isDone()) {
      this.game.currentPlayer.removeSelections();

      this.game.stateMachine.transitionTo(
        this.game.stateMachine.states.switchTurn,
      );
    }
  }
}
