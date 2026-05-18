import { EntityManager } from './EntityManager';
import { System } from './System';
import { Position } from '../game/components';

/**
 * Keeps every positioned entity inside a rectangle [0, width) x [0, height).
 * Runs *after* MovementSystem: it assumes movement may have pushed things out,
 * and it clamps them back.
 */
export class BoundsSystem implements System {
  // TODO: store width and height as private readonly
  private width:number
  private height:number

  constructor(width: number, height: number) {
    // TODO: initialize
    this.width = width;
    this.height = height;
  }

  update(world: EntityManager, deltaTime: number): void {
 for(let entity of world.query("position")){
      let pos = world.getComponent(entity, "position") as Position;
      if(pos.x >= this.width-1){
        pos.x = this.width - 1
      }
      if(pos.y > this.height - 1){
        pos.y = this.height - 1
      }
      if(pos.y < 0){
        pos.y = 0
      }
      if(pos.x <0){
        pos.x = 0
      }

    }
    // TODO: query for "position" entities
    // TODO: clamp each one's x into [0, width - 1]
    // TODO: clamp each one's y into [0, height - 1]
  }
}
