import { Application, Container, ICanvas } from "pixi.js";
import Tile from "./Tile";
import Piece from "./Piece";
import Player from "./Player";
import { isTileWhite } from "./helpers";
import BoardPosition from "./BoardPosition";
import Move from "./Move";

export default class Board {
  private rows = 8;
  private columns = 8;
  private container: Container = new Container();
  private grid: Array<BoardPosition[]> = [];
  public tiles: Tile[] = [];

  constructor(private app: Application) {}

  initBoard() {
    // Create a container object for the board
    this.app.stage.addChild(this.container);

    // generate the tiles
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let column = 0; column < this.columns; column++) {
        const tile = new Tile(row, column);
        tile.init(this.app);
        if (tile.sprite) this.container.addChild(tile.sprite);
        this.grid[row][column] = new BoardPosition(tile, null);
        this.tiles.push(tile);
      }
    }
  }

  initPieces(app: Application<ICanvas>, player1: Player, player2: Player) {
    // generate pieces for player 2
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (isTileWhite(row, column)) {
          const piece = new Piece(row, column, player1);
          piece.init(app);
          if (piece.sprite) this.container.addChild(piece.sprite);
          this.setPiecePosition(row, column, piece);
          // ownership of the piece is assigned to player 1
          player2.addPiece(piece);
          piece.assignTo(player2);
        }
      }
    }

    // generate pieces for player 1
    for (let row = 5; row < 8; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (isTileWhite(row, column)) {
          const piece = new Piece(row, column, player2);
          piece.init(app);
          if (piece.sprite) this.container.addChild(piece.sprite);
          this.setPiecePosition(row, column, piece);
          // ownership of the piece is assigned to player 2
          player1.addPiece(piece);
          piece.assignTo(player1);
        }
      }
    }
  }

  getTile(row: number, column: number) {
    return this.grid[row][column].tile;
  }

  getPiece(row: number, column: number) {
    return this.grid[row][column].piece;
  }

  /**
   * Updates the boards grid and sets the piece's position.
   * Use this rather than the piece's setPosition method.
   * @param row
   * @param column
   * @param piece
   */
  setPiecePosition(row: number, column: number, piece: Piece) {
    this.grid[piece.row][piece.column].piece = null;
    this.grid[row][column].piece = piece;
    piece.setPosition(row, column);
  }

  removePieceFromBoard(row: number, column: number) {
    const piece = this.getPiece(row, column);
    if (piece) {
      this.grid[row][column].piece = null;
      this.container.removeChild(piece.sprite!);
    }
  }

  /**
   * Return the tile or piece at the specified position.
   * Bound checking should be done before calling the method.
   * @returns {BoardPosition}
   * @param position
   */
  getBoardContentAt(position: number[]): BoardPosition {
    if (!this.inBounds(position)) {
      throw Error(`Position [${position[0]}, ${position[1]}]out of bounds`);
    }
    return this.grid[position[0]][position[1]];
  }

  inBounds(position: number[]) {
    return (
      0 <= position[0] &&
      position[0] < this.rows &&
      0 <= position[1] &&
      position[1] < this.columns
    );
  }

  updateValidMovesForPiece(piece: Piece) {
    piece.validMoves = [];
    const currentPosition = this.getBoardContentAt([piece.row, piece.column]);

    const forwardLeft = [piece.row + piece.direction, piece.column - 1];
    if (this.inBounds(forwardLeft)) {
      let fL = new Move(
        currentPosition,
        this.getBoardContentAt(forwardLeft),
        this,
      );
      if (fL.isValid) {
        piece.validMoves.push(fL);
      }
    }

    const forwardRight = [piece.row + piece.direction, piece.column + 1];
    if (this.inBounds(forwardRight)) {
      let fR = new Move(
        currentPosition,
        this.getBoardContentAt(forwardRight),
        this,
      );
      if (fR.isValid) {
        piece.validMoves.push(fR);
      }
    }
  }
}
