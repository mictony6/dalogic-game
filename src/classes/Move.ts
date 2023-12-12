import BoardPosition from "./BoardPosition";
import Board from "./Board";
import Piece from "./Piece";

export default class Move {
  isValid: boolean = false;
  isCapture: boolean = false;
  captureDest: BoardPosition | null = null;
  capturedPiece: Piece | null = null;
  movingPiece: Piece | null;

  constructor(
    private srcPos: BoardPosition,
    private destPos: BoardPosition,
    board: Board,
  ) {
    this.movingPiece = srcPos.piece;
    this.isValid = this.validateMove(board);
  }

  get destTile() {
    return this.destPos.tile;
  }

  get srcTile() {
    return this.srcPos.tile;
  }

  isDone() {
    return (
      this.movingPiece!.row === this.destTile.row &&
      this.movingPiece!.column === this.destTile.column
    );
  }
  private validateMove(board: Board): boolean {
    // Check if the move is within the bounds of the board
    if (!board.inBounds([this.destPos.tile.row, this.destPos.tile.column])) {
      return false;
    }

    // Check if the destination tile is occupied by an opponent's piece
    const opponentPiece = this.destPos.piece;
    if (opponentPiece) {
      if (opponentPiece.isOpponentOf(this.movingPiece)) {
        this.isCapture = true;
        this.capturedPiece = opponentPiece;
      } else {
        return false;
      }
    }

    // Check if the tile across is empty for capturing moves
    if (this.isCapture) {
      const acrossPos = [
        this.destTile.row + this.movingPiece!.direction,
        this.destTile.column + this.colDiff,
      ];
      if (board.inBounds(acrossPos))
        this.destPos = board.getBoardContentAt(acrossPos);
      if (!this.destPos || this.destPos.piece) {
        this.isCapture = false;
        return false;
      }
    }

    return true;
  }

  private get colDiff() {
    return this.destTile.column - this.srcTile.column;
  }
}
