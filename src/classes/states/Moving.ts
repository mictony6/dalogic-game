import TransitioningState from "./TransitioningState";
import GameState from "./GameState";

export default class Moving extends GameState implements TransitioningState {
  onEnter(): void {
    console.log("Moving...");
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
        currentPlayer.selectedMove.execute(this.game.board);
      }
    }
  }
}
