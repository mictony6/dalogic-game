/**
 * Class representing a game event
 */
export class GameEvent {
  name = "default";
  id = 0;
  details = {};
  /**
   * @param {String} name
   * @param {Number} id
   * @param details
   */
  constructor(name: string, id: number, details = {}) {
    this.name = name;
    this.id += id;
    this.details = details;
  }
}
