export default class Player {
  color: number;
  private id: number;
  private pieces: any[];
  constructor(color: number, id: number) {
    this.color = color;
    this.id = id;
    this.pieces = [];
  }
}