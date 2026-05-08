import { System } from '../engine/System';
import { EntityManager } from '../engine/EntityManager';
import { InputSource } from '../engine/InputSource';
import { Velocity, Position } from './components';

export class PlayerInputSystem implements System {
  private speed:number;
  private input:InputSource

  constructor(input:InputSource, id: number){
    this.speed = 20;
    this.input = input;

  }

  update(world: EntityManager){
    //list of things that can be controlled
    // - forEach
    // - for
    for(let entity of world.query("position", "velocity", "movable")){
      let pos = world.getComponent(entity, "position") as Position;
      let vel = world.getComponent(entity, "velocity") as Velocity;

      if(this.input.isKeyPressed("d")){
        vel.dx = this.speed
      }else if( this.input.isKeyPressed("a")){
        vel.dx = -this.speed
      }else{
        vel.dx =0;
      }
    }
  }


  // TODO: constructor takes an InputSource and the player Entity id
  // TODO: each tick, read input state and set the player's velocity
  //   - left pressed  → velocity.dx = -speed
  //   - right pressed → velocity.dx = +speed
  //   - up pressed    → velocity.dy = -speed
  //   - down pressed  → velocity.dy = +speed
  //   - nothing pressed → dx = dy = 0
}
