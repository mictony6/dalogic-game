import BoardPosition from "./BoardPosition";

export default class Move {
  constructor(
    public srcPos: BoardPosition,
    public destPos: BoardPosition,
  ) {
    if (srcPos.piece === null) {
      throw new Error("Move srcPos must have a piece");
    }
  }
}
