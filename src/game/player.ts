import { Renderable } from "../engine/Renderable";
import { ScreenBuffer } from "../engine/ScreenBuffer";
import {Input} from "../engine/Input"
export class Player implements Renderable{
  x:number;
  y:number;
  input:Input;
  player_model:string = "@"
  constructor(){
    this.input = new Input();
    this.x = 3;
    this.y = 3;
  }
  update(deltaTime:number, screen_buffer: ScreenBuffer){
    return;
    if (this.input.isKeyPressed('a') && this.x >=0){
      this.x -=1;
    }
    if(this.input.isKeyPressed('d') && this.x <= screen_buffer.width){
      this.x += 1
    }
  }


  drawTo(buffer: ScreenBuffer): void {
      buffer.writeText(this.x, this.y, this.player_model) 
  }

}
