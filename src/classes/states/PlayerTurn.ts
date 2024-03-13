import TransitioningState from "./TransitioningState";
import Game from "../Game";
import AlphaBetaAI from "../AlphaBetaAI";
import { GAMEMODE, socket } from "../helpers";
import RandomAI from "../RandomAI";
import MiniMaxAI from "../MiniMaxAI";
import ExpectimaxAI from "../ExpectimaxAI";

export default class PlayerTurn implements TransitioningState {
  name: string = "playerTurn";

  onEnter(game: Game) {
    if (game.isOver()) {
      const player1 = game.getPlayers()[0];
      const player2 = game.getPlayers()[1];

      if (
        game.gameMode === GAMEMODE.AIVsAI &&
        (player1 instanceof AlphaBetaAI ||
          player1 instanceof RandomAI ||
          player1 instanceof MiniMaxAI ||
          player1 instanceof ExpectimaxAI)
      ) {
        const averageSpeed = player1.speedSum / player1.numOfMoves;
        socket.emit("alphaBetaMetrics", [
          {
            avgSpeed: averageSpeed,
            iterations: player1.iterations,
            avgIterationPerMove: player1.iterations / player1.numOfMoves,
            win:
              player1.score > player2.score
                ? 1
                : player1.score === player2.score
                  ? 0
                  : -1,
          },
        ]);
      }

      if (game.gameMode === GAMEMODE.AIVsAI) {
        game.restart();
      } else {
        game.stateMachine.transitionTo(game.stateMachine.states.gameOver);
      }
    } else {
      game.currentPlayer.perform(game);
    }
  }

  onExit(game: Game) {}

  onUpdate(_delta: number, game: Game) {
    const currentPlayer = game.currentPlayer;
    if (currentPlayer && currentPlayer.selectedMove) {
      game.stateMachine.transitionTo(game.stateMachine.states.moving);
    }
  }
}
