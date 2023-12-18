import Player from "./Player";
import Move from "./Move";
import TransitioningState from "./states/TransitioningState";
import GameState from "./states/GameState";

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

/**
 * Class representing a move event
 */

export class MoveEvent extends GameEvent {
  move: Move;
  /**
   * @param move {Move}
   */
  constructor(move: Move) {
    super("move", 2);
    this.move = move;
  }
}

/** Class representing a state change event */
export class StateChangeEvent extends GameEvent {
  state: TransitioningState;
  /**
   * @param {String} state
   */
  constructor(state: TransitioningState) {
    super("stateChange", 3);
    this.state = state;
  }
}
