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
  container: Container = new Container();
  grid: Array<BoardPosition[]> = [];
  public tiles: Tile[] = [];
  public pieces: Piece[] = [];
  private removedPieces: Piece[] = [];
  pieceValues = [
    [3, 3, 3, 3],
    [1, 2, 2, 1],
    [1, 0, 0, 1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [1, 0, 0, 1],
    [1, 2, 2, 1],
    [3, 3, 3, 3],
  ];

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
    for (let row = 0; row < (this.rows - 2) / 2; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (isTileWhite(row, column)) {
          const piece = new Piece(row, column, player2);
          piece.init(app);
          if (piece.sprite) this.container.addChild(piece.sprite);
          this.movePiecePosition(piece, this.getBoardPosition([row, column])!);
          // ownership of the piece is assigned to player 1
          piece.assignTo(player2);
          piece.pieceValue =
            this.pieceValues[row][
              Math.floor(Math.random() * this.pieceValues[row].length)
            ];
          let index = this.pieceValues[row].indexOf(piece.pieceValue);
          this.pieceValues[row].splice(index, 1); // Remove the pieceValue

          this.pieces.push(piece);
        }

        if (isTileWhite(this.rows - 1 - row, column)) {
          const piece = new Piece(this.rows - 1 - row, column, player1);
          piece.init(app);
          if (piece.sprite) {
            this.container.addChild(piece.sprite);
          }
          this.movePiecePosition(
            piece,
            this.getBoardPosition([this.rows - 1 - row, column])!,
          );
          // ownership of the piece is assigned to player 2
          piece.assignTo(player1);
          piece.pieceValue =
            this.pieceValues[this.rows - 1 - row][
              Math.floor(
                Math.random() * this.pieceValues[this.rows - 1 - row].length,
              )
            ];
          let index = this.pieceValues[this.rows - 1 - row].indexOf(
            piece.pieceValue,
          );
          this.pieceValues[this.rows - 1 - row].splice(index, 1); // Remove the pieceValue

          this.pieces.push(piece);
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
   * @param piece
   * @param position
   */
  movePiecePosition(piece: Piece, position: BoardPosition) {
    this.grid[piece.row][piece.column].piece = null;
    position.piece = piece;
    piece.setPosition(position.tile.row, position.tile.column);
  }

  removePieceFromBoard(row: number, column: number) {
    const piece = this.getPiece(row, column);
    if (piece) {
      this.grid[row][column].piece = null;
      this.pieces = this.pieces.filter((p) => p != piece);
      this.container.removeChild(piece.sprite!);
    }
  }

  /**
   * Return the tile or piece at the specified position.
   * Bound checking should be done before calling the method.
   * @returns {BoardPosition}
   * @param position
   */
  getBoardPosition(position: number[]): BoardPosition | null {
    if (!this.inBounds(position)) {
      return null;
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

  getAllValidMoves(player: Player) {
    const moves: Move[] = [];
    const pieces = this.pieces.filter((piece) => player.owns(piece));
    pieces.forEach((piece) => {
      const validMoves = piece.getValidMoves(this);
      moves.push(...validMoves);
    });
    return moves;
  }

  removePieceAtPosition(position: BoardPosition) {
    const piece = position.piece;
    if (piece) {
      this.removePieceFromBoard(piece.row, piece.column);
      this.pieces = this.pieces.filter((p) => p != piece);
    }
  }

  addPieceAtPosition(piece: Piece, position: BoardPosition) {
    // check if position is empty
    if (position.piece) {
      throw new Error("Position is not empty");
    }
    this.grid[position.tile.row][position.tile.column].piece = piece;
    piece.setPosition(position.tile.row, position.tile.column);
    this.pieces.push(piece);
    this.container.addChild(piece.sprite!);
  }

  get size() {
    return this.rows;
  }

  convertPieceRepToPiece(
    players: Player[],
    myPieces: {
      row: number;
      column: number;
      value: number;
      playerId: string;
    }[],
    otherPieces: {
      row: number;
      column: number;
      value: number;
      playerId: string;
    }[],
  ) {
    // set my pieces to the correct position on the bottom of the board
    myPieces.forEach((pieceRep) => {
      pieceRep.row = 7 - pieceRep.row;
      pieceRep.column = 7 - pieceRep.column;
    });

    // generate actual pieces
    myPieces.forEach((pieceRep) => {
      const player = players.find((p) => p.id === pieceRep.playerId);
      if (!player) {
        throw new Error("Player not found");
      }
      const piece = new Piece(pieceRep.row, pieceRep.column, player);
      piece.init(this.app);
      this.movePiecePosition(
        piece,
        this.getBoardPosition([piece.row, piece.column])!,
      );
      piece.pieceValue = pieceRep.value;
      piece.assignTo(player);
      this.pieces.push(piece);
      this.container.addChild(piece.sprite!);
    });

    otherPieces.forEach((pieceRep) => {
      const player = players.find((p) => p.id === pieceRep.playerId);
      if (!player) {
        throw new Error("Player not found");
      }
      const piece = new Piece(pieceRep.row, pieceRep.column, player);
      piece.init(this.app);
      this.movePiecePosition(
        piece,
        this.getBoardPosition([piece.row, piece.column])!,
      );
      piece.pieceValue = pieceRep.value;
      piece.assignTo(player);
      this.pieces.push(piece);
      this.container.addChild(piece.sprite!);
    });
  }
}
