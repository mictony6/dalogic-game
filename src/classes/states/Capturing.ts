import GameState from "./GameState";
import TransitioningState from "./TransitioningState";

export default class Capturing extends GameState implements TransitioningState {
  onEnter(): void {
    console.log("Capturing...");

    const selectedMove = this.game.currentPlayer.selectedMove!;
    const movingPiece = selectedMove.movingPiece!;
    const capturedPiece = selectedMove.capturedPiece!;

    movingPiece.pieceValue = selectedMove.destTile.performOperation(
      movingPiece,
      capturedPiece,
    );

    console.log("removing piece");
    this.game.currentPlayer.removePiece(selectedMove.capturedPiece!);
    this.game.board.removePieceFromBoard(
      selectedMove.capturedPiece!.row,
      selectedMove.capturedPiece!.column,
    );
  }

  onExit(): void {}

  onUpdate(delta: number): void {
    const selectedMove = this.game.currentPlayer.selectedMove!;

    this.game.makeMove(selectedMove);
    if (selectedMove.isDone()) {
      this.game.currentPlayer.removeSelections();
      this.game.stateMachine.transitionTo(
        this.game.stateMachine.states.switchTurn,
      );
    }
  }
}
