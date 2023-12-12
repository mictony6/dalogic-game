import GameState from "./GameState";
import TransitioningState from "./TransitioningState";

export default class SwitchTurn
  extends GameState
  implements TransitioningState
{
  onEnter(): void {
    console.log("Switching players");
    const prev = this.game.currentPlayer!;
    prev.isTurn = false;
    const players = this.game.getPlayers();
    this.game.currentPlayer = players.find((player) => player.id !== prev.id)!;
    if (this.game.currentPlayer) {
      this.game.currentPlayer.isTurn = true;
    } else {
      throw Error("No current player assigned");
    }
  }

  onExit(): void {
    console.log(`current player : Player ${this.game.currentPlayer.id}`);
  }

  onUpdate(delta: number): void {
    this.game.stateMachine.transitionTo(
      this.game.stateMachine.states.playerTurn,
    );
  }
}
