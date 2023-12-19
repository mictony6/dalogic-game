import TransitioningState from "./TransitioningState";
import Game from "../Game";

export default class GameOver implements TransitioningState {
  name: string = "gameOver";

  onEnter(game: Game): void {
    const player1 = game.getPlayers()[0];
    const player2 = game.getPlayers()[1];

    console.log(
      `Player ${player1.id} score is ${player1.score} || Player ${player2.id} score is ${player2.score}`,
    );
    game.gui.showGameOver(game);
  }

  onExit(game: Game): void {
    game.gui.hideGameOver(game);
  }

  onUpdate(delta: number, game: Game): void {}
}
