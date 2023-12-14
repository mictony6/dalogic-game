import Tile from "./Tile";
import Piece from "./Piece";

export default class BoardPosition {
  constructor(
    public tile: Tile,
    public piece: Piece | null,
  ) {}
}
