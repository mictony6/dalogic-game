export default interface TransitioningState {
  /**
   * Gets called once on enter
   */
  onEnter(): void;
  onExit(): void;

  /**
   * called repeatedly every frame
   * @param delta
   */
  onUpdate(delta: number): void;
}
