import TransitioningState from "./TransitioningState";
import GameState from "./GameState";

export default class Moving extends GameState implements TransitioningState {
  onEnter(): void {
    this.game.moveHistory.push(this.game.currentPlayer.selectedMove!);
  }

  onExit(): void {}

  onUpdate(delta: number): void {
    const currentPlayer = this.game.currentPlayer;
    if (currentPlayer && currentPlayer.selectedMove) {
      // check if move is done by checking if the piece is at the destination
      const piece = currentPlayer.selectedMove.destPos.piece;
      if (piece) {
        piece.validMoves?.forEach((move) => {
          move.destPos.tile.resetColor();
        });

        currentPlayer.resetSelections();

        this.game.stateMachine.transitionTo(
          this.game.stateMachine.states.switchTurn,
        );
      } else {
        const movingPiece = currentPlayer.selectedMove.srcPos.piece!;
        movingPiece.moveTowards(currentPlayer.selectedMove.destPos);
        if (
          movingPiece.sprite!.x ===
            currentPlayer.selectedMove.destPos.tile.sprite!.x &&
          movingPiece.sprite!.y ===
            currentPlayer.selectedMove.destPos.tile.sprite!.y
        ) {
          currentPlayer.selectedMove.execute(this.game.board);
        }
      }
    }
  }
}
