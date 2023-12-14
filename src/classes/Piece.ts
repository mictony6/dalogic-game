import { Application, Graphics, Sprite, Text } from "pixi.js";
import Player from "./Player";
import Move from "./Move";
import Board from "./Board";

export default class Piece {
  row: number;
  column: number;
  private readonly size: number;
  private _sprite: Sprite | undefined;
  private _player: Player;
  private _pieceValue: number = 0;
  private text: Text | undefined;
  validMoves: Move[] | undefined;
  constructor(row: number, column: number, player: any) {
    this.row = row;
    this.column = column;
    this.size = 75;
    this._player = player;
  }

  init(app: Application) {
    const texture = new Graphics();
    texture.beginFill(this._player.color);
    texture.drawCircle(0, 0, this.size * 0.5);
    texture.endFill();
    this._sprite = new Sprite(app.renderer.generateTexture(texture));

    this.text = new Text("null", {
      fill: 0xffffff,
      fontSize: 26,
    });

    this.text.anchor.set(0.5);
    const centerX = this._sprite.width / 2;
    const centerY = this._sprite.height / 2;
    // Position text at the center of the circle
    this.text.position.set(centerX, centerY);
    this._sprite.addChild(this.text);

    this.pieceValue = Math.floor(Math.random() * 3);
  }

  setPosition(row: any, column: any) {
    this.row = row;
    this.column = column;
    this.sprite!.y = this.row * this.size;
    this.sprite!.x = this.column * this.size;
  }

  assignTo(player: Player) {
    this._player = player;
  }

  get sprite() {
    return this._sprite;
  }

  get player() {
    return this._player;
  }

  set pieceValue(value: number) {
    this._pieceValue = value;
    // return a string representation of the value in binary, add padding if value is 1 or 0
    const binaryString = this._pieceValue.toString(2);
    // Calculate the number of leading zeros needed for padding
    const paddingZeros = Math.max(0, 2 - binaryString.length);
    // Add leading zeros for padding
    this.text!.text = "0".repeat(paddingZeros) + binaryString;
  }

  get pieceValue() {
    return this._pieceValue;
  }

  get direction() {
    return this.player.direction;
  }

  isOpponentOf(piece: Piece | null) {
    return piece?.player !== this.player;
  }

  getValidMoves(board: Board) {
    const moves: Move[] = [];
    const srcPos = board.getBoardPosition([this.row, this.column]);
    if (srcPos === null || srcPos.piece == null) {
      throw new Error("Invalid srcPos");
    }

    const leftDest = board.getBoardPosition([
      this.row + this.direction,
      this.column - 1,
    ]);

    if (leftDest) {
      // check destination piece exist and is an opponents piece
      if (leftDest.piece && this.isOpponentOf(leftDest.piece)) {
        const leftJumpDest = board.getBoardPosition([
          this.row + this.direction * 2,
          this.column - 2,
        ]);
        // if jump destination is valid and empty, add to moves
        if (leftJumpDest && !leftJumpDest.piece) {
          moves.push(new Move(srcPos, leftJumpDest));
        }
      } else if (!leftDest.piece) {
        moves.push(new Move(srcPos, leftDest));
      }
    }
    const rightDest = board.getBoardPosition([
      this.row + this.direction,
      this.column + 1,
    ]);

    if (rightDest) {
      // check destination piece exist and is an opponents piece
      if (rightDest.piece && this.isOpponentOf(rightDest.piece)) {
        const rightJumpDest = board.getBoardPosition([
          this.row + this.direction * 2,
          this.column + 2,
        ]);
        // if jump destination is valid and empty, add to moves
        if (rightJumpDest && !rightJumpDest.piece) {
          moves.push(new Move(srcPos, rightJumpDest));
        }
      } else if (!rightDest.piece) {
        moves.push(new Move(srcPos, rightDest));
      }
    }
    this.validMoves = moves;
    return moves;
  }
}
