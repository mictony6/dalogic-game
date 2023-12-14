import Player from "./Player";

/**
 * Class representing a game event
 */
export class GameEvent {
  name = "default";
  id = 0;
  /**
   * @param {String} name
   * @param {Number} id
   */
  constructor(name: string, id: number) {
    this.name = name;
    this.id += id;
  }
}

/**
 * Class representing a score event
 */
export class ScoreEvent extends GameEvent {
  scoringPlayer: Player | undefined;
  /**
   *
   * @param {Player} scoringPlayer
   */
  constructor(scoringPlayer: Player) {
    super("score", 1);
    this.scoringPlayer = scoringPlayer;
  }
}
