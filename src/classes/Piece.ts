import {Application, Graphics, Sprite} from "pixi.js";
import Player from "./Player";

export default class Piece {
  private row: number;
  private column: number;
  private size: number;
  private _sprite: Sprite | undefined;
  private player: Player;
  private color: number | undefined;
  constructor( row: number, column: number, player: any) {
    this.row = row;
    this.column = column;
    this.size = 64;
    this.player = player;
  }

  init(app : Application) {
    const texture = new Graphics();
    texture.beginFill(this.player.color);
    texture.drawCircle(0, 0, this.size / 2);
    texture.endFill();
    this._sprite = new Sprite(app.renderer.generateTexture(texture));

  }

  setPosition(row: any, column: any){
    this.row = row;
    this.column = column;
    this.sprite!.y = this.row * this.size;
    this.sprite!.x = this.column * this.size;
  }

  assignTo(player : Player) {
    this.player = player;
    this.color = player.color;
  }

  get sprite(){
    return this._sprite;
  }
}