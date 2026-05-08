import { Renderable } from "../engine/Renderable";
import { ScreenBuffer } from "../engine/ScreenBuffer";

class IndRoadblock implements Renderable{
  x:number;
  y:number;
  model:string = "___"
  constructor(){
    this.x = 0;
    this.y = 0;
  }
  drawTo(buffer: ScreenBuffer): void {
      buffer.writeText(this.x, this.y, this.model) 
  }

}
