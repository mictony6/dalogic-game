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




