import TransitioningState from "./TransitioningState";
import GameState from "./GameState";

export default class Moving extends GameState implements TransitioningState {
  onEnter(): void {}

  onExit(): void {
    this.game.currentPlayer.removeSelections();
  }

  onUpdate(delta: number): void {
    const selectedMove = this.game.currentPlayer.selectedMove!;
    if (selectedMove.isCapture) {
      console.log("removing piece");
      this.game.currentPlayer.removePiece(selectedMove.capturedPiece!);
      this.game.board.removePieceFromBoard(
        selectedMove.capturedPiece!.row,
        selectedMove.capturedPiece!.column,
      );
    }
    this.game.makeMove(selectedMove);
    if (selectedMove.isDone()) {
      this.game.stateMachine.transitionTo(
        this.game.stateMachine.states.switchTurn,
      );
    }
  }
}
