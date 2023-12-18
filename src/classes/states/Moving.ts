import TransitioningState from "./TransitioningState";
import gameEventListener from "../GameEventListener";
import { MoveEvent } from "../GameEvent";
import Game from "../Game";

export default class Moving implements TransitioningState {
  onEnter(game: Game): void {
    game.moveHistory.push(game.currentPlayer.selectedMove!);
    gameEventListener.trigger(new MoveEvent(game.currentPlayer.selectedMove!));
  }

  onExit(game: Game): void {}

  onUpdate(delta: number, game: Game): void {
    const currentPlayer = game.currentPlayer;
    if (currentPlayer && currentPlayer.selectedMove) {
      // check if move is done by checking if the piece is at the destination
      const piece = currentPlayer.selectedMove.destPos.piece
        ? currentPlayer.selectedMove.destPos.piece
        : currentPlayer.selectedMove.promotedPiece;
      if (piece) {
        piece.validMoves?.forEach((move) => {
          move.destPos.tile.resetColor();
        });

        currentPlayer.resetSelections();

        game.stateMachine.transitionTo(game.stateMachine.states.switchTurn);
      } else {
        const movingPiece = currentPlayer.selectedMove.srcPos.piece!;
        movingPiece.moveTowards(currentPlayer.selectedMove.destPos);
        if (
          movingPiece.sprite!.x ===
            currentPlayer.selectedMove.destPos.tile.sprite!.x &&
          movingPiece.sprite!.y ===
            currentPlayer.selectedMove.destPos.tile.sprite!.y
        ) {
          currentPlayer.selectedMove.execute(game.board);
        }
      }
    }
  }
}
