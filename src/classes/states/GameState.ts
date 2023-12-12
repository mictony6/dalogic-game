import Game from "../Game";

export default class GameState {
  protected game: Game;
  constructor(game: Game) {
    this.game = game;
  }
}
