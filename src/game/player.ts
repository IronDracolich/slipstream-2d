import { Renderable } from "../engine/Renderable";
import { ScreenBuffer } from "../engine/ScreenBuffer";

export class Player implements Renderable{
  x:number;
  y:number;
  player_model:string = "@"
  constructor(){
    this.x = 3;
    this.y = 3;
  }
  update(deltaTime:number, screen_buffer: ScreenBuffer){
    if (this.x === screen_buffer.width){
      this.x = 0;
    } else {
      this.x += 1;
    }
  }


  drawTo(buffer: ScreenBuffer): void {
      buffer.writeText(this.x, this.y, this.player_model) 
  }

}
