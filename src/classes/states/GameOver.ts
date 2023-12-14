import GameState from "./GameState";
import TransitioningState from "./TransitioningState";

export default class GameOver extends GameState implements TransitioningState {
  onEnter(): void {
    const player1 = this.game.getPlayers()[0];
    const player2 = this.game.getPlayers()[1];

    console.log(
      `Player ${player1.id} score is ${player1.score} || Player ${player2.id} score is ${player2.score}`,
    );
  }

  onExit(): void {}

  onUpdate(delta: number): void {}
}
