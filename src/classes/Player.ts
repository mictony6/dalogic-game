import Piece from "./Piece";
import Tile from "./Tile";
import Board from "./Board";
import Move from "./Move";
import Game from "./Game";

const playerDebug = document.getElementById("playerDebug")!;

export default class Player {
  color: number;
  id: number;
  selectedTile: Tile | null | undefined;
  selectedPiece: Piece | null | undefined;
  public isTurn = false;
  direction: number;
  public score: number = 0;
  selectedMove: Move | undefined;
  constructor(color: number, id: number) {
    this.color = color;
    this.id = id;
    this.direction = this.id === 0 ? -1 : 1;
  }

  owns(piece: Piece) {
    return piece.player === this;
  }

  selectPiece(piece: Piece, board: Board) {
    if (!this.isTurn) return;

    // check if may selected piece
    if (this.selectedPiece) {
      //if meron deselect
      this.deselectPiece(this.selectedPiece);
    }
    // set selectedPiece
    // get valid moves for selectedpiece

    this.selectedPiece = piece;
    const moves = this.selectedPiece.getValidMoves(board);
    moves.forEach((move) => {
      move.destPos.tile.highlight();
    });

    playerDebug.innerHTML = `Player ${this.id} selected piece at ${piece.row}, ${piece.column}`;
  }

  deselectPiece(piece: Piece) {
    // if may selectedpiece, set it to null
    if (this.selectedPiece) {
      this.selectedPiece.validMoves?.forEach((move) => {
        move.destPos.tile.resetColor();
      });
      this.selectedPiece.validMoves = [];
      this.selectedPiece = null;
    }
    // also removed valid moves
  }

  selectTile(tile: Tile, board: Board) {
    if (!this.isTurn) return;
    if (this.selectedTile) {
      this.deselectTile(this.selectedTile);
    }
    // check if may selected piece
    if (this.selectedPiece) {
      const selectedMove = this.selectedPiece.validMoves!.find(
        (move) => move.destPos.tile === tile,
      );
      this.selectedTile = tile;
      this.selectedMove = selectedMove;
    }
  }

  deselectTile(_tile: Tile) {
    this.selectedTile = null;
  }

  addScore(val: number) {
    this.score += val;
  }

  resetSelections() {
    this.deselectPiece(this.selectedPiece!);
    this.deselectTile(this.selectedTile!);
    this.selectedMove = undefined;
  }

  perform(game: Game) {}
}
