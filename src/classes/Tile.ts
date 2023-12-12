import {
  Application,
  Graphics,
  ICanvas,
  RenderTexture,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";
import * as OPERATIONS from "./Operation";
import { isTileWhite } from "./helpers";
import Piece from "./Piece";

let operations: Function[] = [
  OPERATIONS.AND,
  OPERATIONS.OR,
  OPERATIONS.XOR,
  OPERATIONS.NAND,
];
export default class Tile {
  _sprite: Sprite | undefined;
  readonly row: number;
  readonly size: number;
  readonly column: number;
  readonly color: number;
  readonly id: number;
  private operation: Function;
  private text: Text | undefined;
  private defaultTexture: RenderTexture | undefined;
  private highlightTexture: RenderTexture | undefined;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
    this.size = 75;
    this.color = (row + column) % 2 === 1 ? 0x282814 : 0x3c5028;
    this.id = row * 8 + column;
    this.operation = operations[this.id % operations.length];
  }

  init(app: Application<ICanvas>) {
    const texture = new Graphics();
    texture.beginFill(this.color);
    texture.drawRect(0, 0, this.size, this.size);
    texture.endFill();

    this.defaultTexture = app.renderer.generateTexture(texture);
    texture.clear();
    texture.beginFill(0x00aa00);
    texture.drawRect(0, 0, this.size, this.size);
    texture.endFill();
    this.highlightTexture = app.renderer.generateTexture(texture);

    this._sprite = new Sprite(this.defaultTexture);
    this._sprite.y = this.row * this.size;
    this._sprite.x = this.column * this.size;

    if (isTileWhite(this.row, this.column)) {
      this.text = new Text(
        this.operation.name,
        new TextStyle({
          fill: 0xffffff,
          fontSize: 12,
        }),
      );
      this.text.anchor.set(0.5, 0);
      const centerX = this._sprite.width / 2;
      // Position text at the center of the circle
      this.text.position.set(centerX, this.text.y);
      this._sprite.addChild(this.text);
    }
  }

  get sprite() {
    return this._sprite;
  }

  renderText() {
    if (isTileWhite(this.row, this.column)) {
      if (this.text !== undefined && this._sprite !== undefined) {
        // Calculate the center coordinates of the circle
        const centerX = this._sprite.width / 2;
        // Position text at the center of the circle
        this.text.position.set(centerX, this.text.y);
      }
    }
  }

  highlight() {
    this._sprite!.texture = this.highlightTexture!;
  }

  resetColor() {
    this._sprite!.texture = this.defaultTexture!;
  }

  performOperation(a: Piece, b: Piece) {
    return this.operation(a.pieceValue, b.pieceValue);
  }
}
