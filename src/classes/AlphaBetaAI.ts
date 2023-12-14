import Player from "./Player";
import Game from "./Game";
import Move from "./Move";

export default class AlphaBetaAI extends Player {
  private depth: number;
  constructor(color: number, id: number, depth: number) {
    super(color, id);
    this.depth = depth;
  }
  perform(game: Game) {
    const start = performance.now();
    let [bestScore, bestMove] = this.minimax(game, this.depth, true, null)!;
    const end = performance.now();
    console.log(
      `Time taken by minimax with alpha-beta: ${end - start} milliseconds`,
    );

    if (bestMove && bestMove.srcPos.piece && bestMove.destPos.tile) {
      this.selectPiece(bestMove.srcPos.piece, game.board);
      this.selectTile(bestMove.destPos.tile, game.board);
    } else {
      throw new Error("randomMove picked by AI is not valid");
    }
  }

  private minimax(
    game: Game,
    depth: number,
    maximizingPlayer: boolean,
    position: Move | null,
    alpha = -Infinity,
    beta = Infinity,
  ): [number, Move] {
    if (depth === 0 || game.isOver()) {
      if (position) {
        return [game.evaluate(), position];
      }
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      let bestMove = null;

      let moves = game.board.getAllValidMoves(this);
      for (let move of moves) {
        move.execute(game.board);
        let currentEval = this.minimax(
          game,
          depth - 1,
          false,
          move,
          alpha,
          beta,
        )[0];
        move.undo(game.board);

        if (currentEval > maxEval) {
          maxEval = currentEval;
          bestMove = move;
        }

        alpha = Math.max(alpha, currentEval);
        if (beta <= alpha) {
          break;
        }
      }

      return [maxEval, bestMove!];
    } else {
      let minEval = Infinity;
      let bestMove = null;

      const otherPlayer = game.getPlayers().find((p) => p != this)!;
      let moves = game.board.getAllValidMoves(otherPlayer);

      for (let move of moves) {
        move.execute(game.board);
        let currentEval = this.minimax(
          game,
          depth - 1,
          true,
          move,
          alpha,
          beta,
        )[0];
        move.undo(game.board);

        if (currentEval < minEval) {
          minEval = currentEval;
          bestMove = move;
        }

        beta = Math.min(beta, currentEval);
        if (beta <= alpha) {
          break;
        }
      }

      return [minEval, bestMove!];
    }
  }
}
