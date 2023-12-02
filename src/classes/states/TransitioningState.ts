export default interface TransitioningState {
  onEnter(): void;
  onExit(): void;
  onUpdate(delta: number): void;
}
