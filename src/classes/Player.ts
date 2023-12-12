import Piece from "./Piece";
import Tile from "./Tile";
import Board from "./Board";
import { isTileWhite } from "./helpers";

export default class Player {
  color: number;
  pieces: Piece[];
  id: number;
  private selectedTile: Tile | null | undefined;
  selectedPiece: Piece | null | undefined;
  public isTurn = false;
  direction: number;
  public score: number = 0;
  constructor(color: number, id: number) {
    this.color = color;
    this.id = id;
    this.pieces = [];
    this.direction = this.id === 0 ? -1 : 1;
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

  selectPiece(piece: Piece, board: Board) {
    // if its the players turn
    if (!this.isTurn) {
      return;
    }

    // replace selected piece if it exists
    if (this.selectedPiece) {
      this.deselectPiece(this.selectedPiece);
    }
    this.selectedPiece = piece;

    piece.sprite!.scale.set(1.1);

    board.updateValidMovesForPiece(piece);
    piece.validMoves.forEach((move) => {
      move.destTile.highlight();
    });
  }

  deselectPiece(piece: Piece) {
    piece.sprite!.scale.set(1);
    piece.validMoves.forEach((move) => {
      move.destTile.resetColor();
    });
    this.selectedPiece = null;
  }

  selectTile(tile: Tile, board: Board) {
    if (this.selectedTile) {
      this.deselectTile(this.selectedTile);
    }

    if (this.selectedPiece && isTileWhite(tile.row, tile.column)) {
      this.selectedTile = tile;
    }
  }

  deselectTile(_tile: Tile) {
    this.selectedTile = null;
  }

  readyToMove() {
    return (
      this.isTurn &&
      this.selectedTile &&
      this.selectedPiece &&
      this.selectedMove
    );
  }

  get selectedMove() {
    const selectedMove = this.selectedPiece!.validMoves.find(
      (move) => move.destTile === this.selectedTile!,
    );
    if (selectedMove) {
      return selectedMove;
    }
  }

  removeSelections() {
    this.deselectPiece(this.selectedPiece!);
    this.deselectTile(this.selectedTile!);
  }

  addScore(val: number) {
    this.score += val;
  }
}
