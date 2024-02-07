import Player from "./Player";
import Game from "./Game";
import Move from "./Move";

export default class ExpectimaxAI extends Player {
  private readonly depth: number;
  iterations: number = 0;
  numOfMoves = 0;
  speedSum = 0;
  constructor(color: number, id: number, depth: number) {
    super(color, id);
    this.depth = depth;
  }
  perform(game: Game) {
    const start = performance.now();
    let [bestScore, bestMove] = this.expectimax(game, this.depth, true, null)!;
    const end = performance.now();
    console.log(`Time taken by minimax: ${end - start} milliseconds`);
    this.numOfMoves += 1;
    this.speedSum += end - start;

    if (bestMove && bestMove.srcPos.piece && bestMove.destPos.tile) {
      this.selectPiece(bestMove.srcPos.piece, game.board);
      this.selectTile(bestMove.destPos.tile, game.board);
    } else {
      throw new Error("randomMove picked by AI is not valid");
    }
  }

  private expectimax(
    game: Game,
    depth: number,
    maximizingPlayer: boolean,
    position: Move | null,
  ): [number, Move | null] {
    this.iterations += 1;
    if (depth === 0 || game.isOver()) {
      if (position) {
        return [game.evaluate(), position];
      }
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      let bestMove: Move | null = null;

      let moves = game.board.getAllValidMoves(this);
      for (let move of moves) {
        move.execute(game.board);
        let currentEval = this.expectimax(game, depth - 1, false, move)[0];
        move.undo(game.board);

        if (currentEval > maxEval) {
          maxEval = currentEval;
          bestMove = move;
        }
      }

      return [maxEval, bestMove!];
    } else {
      let minEval = Infinity;

      const otherPlayer = game.getPlayers().find((p) => p != this)!;
      let moves = game.board.getAllValidMoves(otherPlayer);

      let total = 0;
      for (let move of moves) {
        move.execute(game.board);
        let currentEval = this.expectimax(game, depth - 1, true, move)[0];
        move.undo(game.board);

        total += currentEval;
      }

      return [total / moves.length, null];
    }
  }
}
