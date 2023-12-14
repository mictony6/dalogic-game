import GameState from "./GameState";
import TransitioningState from "./TransitioningState";

export default class Capturing extends GameState implements TransitioningState {
  onEnter(): void {
    console.log("Capturing...");
  }

  onExit(): void {
    console.log(this.game.currentPlayer.score);
  }

  onUpdate(delta: number): void {}
}
