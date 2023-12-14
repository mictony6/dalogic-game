import Player from "./Player";
import Game from "./Game";

export default class RandomAI extends Player {
  perform(game: Game) {
    let validMoves = game.board.getAllValidMoves(this);
    if (validMoves.length == 0) {
      game.gameIsOver = true;
    }
    const randomMove =
      validMoves[Math.floor(Math.random() * validMoves.length)];

    if (randomMove && randomMove.srcPos.piece && randomMove.destPos.tile) {
      this.selectPiece(randomMove.srcPos.piece, game.board);
      this.selectTile(randomMove.destPos.tile, game.board);
    } else {
      throw new Error("randomMove picked by AI is not valid");
    }
  }
}
