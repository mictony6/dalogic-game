import GameState from "./GameState";
import TransitioningState from "./TransitioningState";
import Game from "../Game";

export default class SwitchTurn
  extends GameState
  implements TransitioningState
{
  onEnter(game: Game): void {
    const prev = game.currentPlayer!;
    prev.isTurn = false;
    const players = game.getPlayers();
    game.currentPlayer = players.find((player) => player.id !== prev.id)!;
    if (game.currentPlayer) {
      game.currentPlayer.isTurn = true;
    } else {
      throw Error("No current player assigned");
    }
  }

  onExit(): void {
    // console.log(`current player : Player ${this.game.currentPlayer.id}`);
  }

  onUpdate(delta: number, game: Game): void {
    game.stateMachine.transitionTo(game.stateMachine.states.playerTurn);
  }
}
