import Game from "../Game";

export default class GameState {
  private game: Game;
  constructor(game: Game) {
    this.game = game;
  }
}