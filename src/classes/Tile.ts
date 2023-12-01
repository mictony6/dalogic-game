import {Application, Graphics, ICanvas, Sprite} from "pixi.js";

export default class Tile{
  _sprite: Sprite | undefined;
  private row: number;
  private size: number;
  private column: number;
  private color: number;
  constructor(row : number, column : number){
    this.row = row;
    this.column = column;
    this.size = 64;
    this.color = (row + column) % 2 === 1 ? 0x000000 : 0xffffff;

  }

  init(app : Application<ICanvas>){
    const texture = new Graphics();
    texture.beginFill(this.color);
    texture.drawRect(0, 0, this.size, this.size);
    texture.endFill();

    this._sprite = new Sprite(app.renderer.generateTexture(texture));
    this._sprite.y = this.row * this.size;
    this._sprite.x = this.column * this.size;

  }

  get sprite(){
    return this._sprite;
  }



}