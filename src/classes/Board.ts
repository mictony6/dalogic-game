import { Application, Container, ICanvas } from "pixi.js";
import Tile from "./Tile";
import Piece from "./Piece";
import Player from "./Player";
import { isTileWhite } from "./helpers";

export default class Board {
  private rows = 8;
  private columns = 8;
  private container: Container = new Container();
  private grid: any[] = [];
  public tiles: Tile[] = [];
  private selectedTile: Tile | null | undefined;
  private selectedPiece: Piece | null | undefined;

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
        if (tile.sprite !== undefined) {
          this.container.addChild(tile.sprite);
        }
        this.grid[row][column] = { tile: tile, piece: null };
        this.tiles.push(tile);
      }
    }
  }

  initPieces(app: Application<ICanvas>, player1: Player, player2: Player) {
    // generate pieces for player 1
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (isTileWhite(row, column)) {
          const piece = new Piece(row, column, player1);
          piece.init(app);
          if (piece.sprite !== undefined) this.container.addChild(piece.sprite);
          this.setPiecePosition(row, column, piece);
          // ownership of the piece is assigned to player 1
          player1.addPiece(piece);
          piece.assignTo(player1);

          // set event listeners for the piece
          piece.sprite!.eventMode = "static";
          piece.sprite!.on("pointerdown", () => {
            this.selectPiece(piece);
          });
        }
      }
    }

    // generate pieces for player 2
    for (let row = 5; row < 8; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (isTileWhite(row, column)) {
          const piece = new Piece(row, column, player2);
          piece.init(app);
          if (piece.sprite !== undefined) this.container.addChild(piece.sprite);
          this.setPiecePosition(row, column, piece);
          // ownership of the piece is assigned to player 2
          player2.addPiece(piece);
          piece.assignTo(player2);

          // set event listeners for the piece
          piece.sprite!.eventMode = "static";
          piece.sprite!.on("pointerdown", () => {
            this.selectPiece(piece);
          });
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

  setPiecePosition(row: number, column: number, piece: Piece) {
    this.grid[row][column].piece = piece;
    piece.setPosition(row, column);
  }

  removePieceFromBoard(row: number, column: number) {
    const piece = this.getPiece(row, column);
    this.grid[row][column].piece = null;
    this.container.removeChild(piece.sprite);
  }

  selectPiece(piece: Piece) {
    if (this.selectedPiece) {
      this.deselectPiece(this.selectedPiece);
    }
    this.selectedPiece = piece;

    piece.sprite!.scale.set(1.2);
  }

  deselectPiece(piece: Piece) {
    piece.sprite!.scale.set(1);
    this.selectedPiece = null;
  }

  selectTile(tile: Tile) {
    if (this.selectedTile) {
      this.deselectTile(this.selectedTile);
    }
    this.selectedTile = tile;
  }

  deselectTile(_tile: Tile) {
    this.selectedTile = null;
  }
}
