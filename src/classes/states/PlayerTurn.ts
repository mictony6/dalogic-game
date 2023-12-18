import TransitioningState from "./TransitioningState";
import GameState from "./GameState";
import Game from "../Game";

export default class PlayerTurn
  extends GameState
  implements TransitioningState
{
  onEnter(game: Game) {
    if (game.isOver()) {
      game.stateMachine.transitionTo(game.stateMachine.states.gameOver);
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
