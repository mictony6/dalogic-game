import Player from "./Player";
import Game from "./Game";

export default class RandomAI extends Player {
  iterations: number = 0;
  numOfMoves = 0;
  speedSum = 0;

  perform(game: Game) {
    const start = performance.now();

    let validMoves = game.board.getAllValidMoves(this);
    if (validMoves.length == 0) {
      game.gameIsOver = true;
    }
    const randomMove =
      validMoves[Math.floor(Math.random() * validMoves.length)];
    const end = performance.now();
    this.numOfMoves += 1;
    this.speedSum += end - start;
    if (randomMove && randomMove.srcPos.piece && randomMove.destPos.tile) {
      this.selectPiece(randomMove.srcPos.piece, game.board);
      this.selectTile(randomMove.destPos.tile, game.board);
    } else {
      throw new Error("randomMove picked by AI is not valid");
    }
  }
}
