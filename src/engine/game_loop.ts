// src/engine/GameLoop.ts
export class GameLoop {
  private running: boolean;
  private tickCount: number;
  private lastTickTime: number;
  private targetFps: number;
  private frameInterval: number;
  private intervalId: ReturnType<typeof setInterval> | null;
  private onTick: (deltaTime: number) => void;
  private date:Date
  private current_time:number
  private delta_time:number
  private tickTimestamps: number[];

  constructor(targetFps: number = 30, onTick: (deltaTime: number) => void) {
    this.running = false
    this.tickCount = 0;
    this.targetFps = targetFps
    this.frameInterval = 1/this.targetFps * 1000
    this.onTick = onTick
    this.intervalId = null
    this.date = new Date();
    this.current_time = this.date.valueOf()/1000.0;
    this.lastTickTime = this.current_time - 1.0/targetFps;
    this.tickTimestamps = [this.lastTickTime];
    this.delta_time = 1.0/targetFps;
  }
  /** Start the game loop */
  start(): void {
    if(this.running){
      return;
    }
    if(this.intervalId){
      clearInterval(this.intervalId);
    }
    this.running = true
    this.intervalId = setInterval(()=>{
      this.tick();
      //console.log(this.lastTickTime)
  }, this.frameInterval);
  }

  /** Stop the game loop */
  stop(): void {
    this.running = false
    clearInterval(this.intervalId!);
  }

  /** Execute one tick of the game loop */
  tick(): void {
    //console.log("called")

    if (this.isRunning()){
      this.current_time = this.date.valueOf()/1000.0;
      this.tickTimestamps.push(this.current_time);
      this.delta_time = this.current_time - this.lastTickTime
      this.lastTickTime = this.current_time
      this.tickCount += 1;
      this.onTick(this.delta_time)
      this.date = new Date();
    }

  }

  /** Get the total number of ticks since construction */
  getTickCount(): number {
    return this.tickCount;
  }

  /** Check if the loop is currently running */
  isRunning(): boolean {
    return this.running;
  }

  getActualFps(): number {
    const oneSecondAgo = this.current_time - 1000;

    this.tickTimestamps.filter((entry)=>entry > oneSecondAgo)

    return this.tickTimestamps.length;
  }

}
