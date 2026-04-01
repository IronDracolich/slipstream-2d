import {ScreenBuffer} from "./ScreenBuffer";
import {Player} from "../game/player"
import {GameLoop} from "./game_loop";
import {Renderer} from "./Renderer"

export const ENGINE_VERSION: string = "0.1.0"
export const ENGINE_NAME:string = "Slipstream 2D"
export const ENGINE_STATUS:string = "stable"
const SCREEN_BUFFER: ScreenBuffer = new ScreenBuffer(20, 20, "-")
const PLAYER:Player = new Player
const RENDERER: Renderer = new Renderer(SCREEN_BUFFER);

const GAME_LOOP: GameLoop = new GameLoop(1, step)

function step(deltaT:number):void{
  PLAYER.update(deltaT, SCREEN_BUFFER);
  RENDERER.render();
  RENDERER.display();
}

export function run(){
  console.log("=".repeat(15));
  console.log("Engine started");
  console.log("Engine version: " + ENGINE_VERSION);
  console.log(ENGINE_NAME + ":");
  console.log(" Engine status: " + ENGINE_STATUS);
  RENDERER.add(PLAYER);
  GAME_LOOP.start();
  
  console.log("Engine stopped");
  console.log("=".repeat(15));
}


