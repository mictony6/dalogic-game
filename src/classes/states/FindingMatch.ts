import TransitioningState from "./TransitioningState";
import Game from "../Game";

export default class FindingMatch implements TransitioningState {
  name: string = "findingMatch";

  onEnter(game: Game): void {
    game.gui.showWaitingScreen(game);
  }

  onExit(game: Game): void {
    game.gui.hideWaitingScreen(game);
  }

  onUpdate(delta: number, game: Game): void {}
}
