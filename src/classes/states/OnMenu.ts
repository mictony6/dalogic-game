import TransitioningState from "./TransitioningState";
import Game from "../Game";

export default class OnMenu implements TransitioningState {
  name: string = "onMenu";

  onEnter(game: Game): void {
    game.gui.showMenu(game);
  }

  onExit(game: Game): void {
    game.gui.hideMenu(game);
  }

  onUpdate(delta: number, game: Game): void {}
}
