import Game from "../Game";

export default interface TransitioningState {
  /**
   * Gets called once on enter
   */
  onEnter(game: Game): void;
  onExit(game: Game): void;

  /**
   * called repeatedly every frame
   * @param delta
   */
  onUpdate(delta: number, game: Game): void;
}
