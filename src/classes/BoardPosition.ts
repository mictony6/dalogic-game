import Tile from "./Tile";
import Piece from "./Piece";

export default class BoardPosition {
  constructor(
    public tile: Tile,
    public piece: Piece | null,
  ) {}
  isValid() {
    //return true if no piece
    if (!this.piece) {
      return true;
    }

    // else return if piece and tile align
    return (
      this.tile.row === this.piece.row && this.tile.column === this.piece.column
    );
  }
}
