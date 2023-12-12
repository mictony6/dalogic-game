import { Application, Graphics, Sprite, Text } from "pixi.js";
import Player from "./Player";
import Move from "./Move";

export default class Piece {
  row: number;
  column: number;
  private readonly size: number;
  private _sprite: Sprite | undefined;
  private _player: Player;
  private _pieceValue: number = 0;
  private text: Text | undefined;
  public validMoves: Move[] = [];

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
}
