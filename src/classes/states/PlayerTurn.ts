import TransitioningState from "./TransitioningState";
import Game from "../Game";

export default class PlayerTurn implements TransitioningState {
  name: string = "playerTurn";

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
