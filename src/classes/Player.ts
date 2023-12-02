import Piece from "./Piece";

export default class Player {
  color: number;
  private id: number;
  private pieces: any[];
  constructor(color: number, id: number) {
    this.color = color;
    this.id = id;
    this.pieces = [];
  }

  addPiece(piece: Piece) {
    this.pieces.push(piece);
  }

  removePiece(piece: Piece) {
    this.pieces = this.pieces.filter((p) => p !== piece);
  }

  owns(piece: Piece) {
    return piece.player === this;
  }
}
