import {
  Application,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
  Ticker,
} from "pixi.js";
import Player from "./Player";
import Move from "./Move";
import Board from "./Board";
import BoardPosition from "./BoardPosition";
import pieceSpriteImg from "../assets/pieceSprite.png";

export default class Piece {
  row: number;
  column: number;
  private readonly size: number;
  private _sprite: Sprite | undefined;
  private _player: Player;
  private _pieceValue: number = 0;
  text: Text | undefined;
  validMoves: Move[] | undefined;
  constructor(row: number, column: number, player: any) {
    this.row = row;
    this.column = column;
    this.size = 75;
    this._player = player;
  }

  init(app: Application) {
    // const texture = new Graphics();
    // texture.beginFill(this._player.color);
    // texture.drawCircle(0, 0, this.size * 0.5);
    // texture.endFill();
    // load piece sprite as texture
    let texture = Texture.from(pieceSpriteImg);

    this._sprite = new Sprite(texture);
    this._sprite.tint = this._player.color;

    // the image is 150x150, so we need to scale it down to 75x75
    this._sprite.scale.set(0.5);

    this.text = new Text("null", {
      fill: 0xffffff,
      fontSize: 26 * 1.5,
      fontWeight: "bold",
    });

    this.text.anchor.set(0.5);
    const centerX = 150 / 2;
    const centerY = 150 / 2;

    console.log(centerX, centerY);
    // Position text at the center of the circle
    this.text.position.set(centerX, centerY);

    this.pieceValue = Math.floor(Math.random() * 3);
    this._sprite.addChild(this.text);
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

  /**
   * Private function to move the piece a bit towards the destination in a certain speed
   * @param {Object} destination
   */
  moveTowards(dest: BoardPosition) {
    const SPEED = 200;
    const { deltaTime } = Ticker.shared;
    this._sprite!.x = this.moveToward(
      this._sprite!.x,
      dest.tile.sprite!.x,
      SPEED * deltaTime,
    );
    this._sprite!.y = this.moveToward(
      this._sprite!.y,
      dest.tile.sprite!.y,
      SPEED * deltaTime,
    );
  }

  moveToward(from: number, to: number, delta: number) {
    const diff = to - from;

    const direction = diff > 0 ? 1 : diff < 0 ? -1 : 0;

    // Calculate the absolute difference
    const absDiff = Math.abs(diff);

    // Check if the absolute difference is less than or equal to the specified delta
    if (absDiff <= delta || absDiff < Number.EPSILON) {
      // If so, return the target value
      return to;
    }
    // Otherwise, calculate the new position by moving towards the target
    return from + direction * delta;
  }
}
