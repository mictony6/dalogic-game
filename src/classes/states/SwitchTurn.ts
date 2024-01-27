import TransitioningState from "./TransitioningState";
import Game from "../Game";
import gameEventListener from "../GameEventListener";
import {ScoreEvent} from "../GameEvent";

export default class SwitchTurn implements TransitioningState {
  name: string = "switchTurn";

  onEnter(game: Game): void {
    const prev = game.currentPlayer;
    gameEventListener.trigger(new ScoreEvent(prev));
    if (prev) {
      prev.isTurn = false;
      const players = game.getPlayers();
      game.currentPlayer = players.find((player) => player.id !== prev.id)!;
    } else {
      game.currentPlayer = game.getPlayers()[0];
    }
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
