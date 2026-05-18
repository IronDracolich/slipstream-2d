import { GameLoop } from '../engine/game_loop';
import { EntityManager } from '../engine/EntityManager';
import { ScreenBuffer } from '../engine/ScreenBuffer';
import { SystemManager } from '../engine/SystemManager';
import { MovementSystem } from '../engine/MovementSystem';
import { BoundsSystem } from '../engine/BoundsSystem';
import { RenderSystem } from '../engine/RenderSystem';
import { Input } from '../engine/Input';
import { PlayerInputSystem } from '../game/PlayerInputSystem';
import { System } from '../engine/System';
import {IndRoadblock} from '../game/indestructable_roadblock'
import { Position, Velocity, Movable } from '../game/components';

const WIDTH = 60;
const HEIGHT = 20;

const world = new EntityManager();
const input = new Input();
const buffer = new ScreenBuffer(WIDTH, HEIGHT);

// Player
const player = world.createEntity();
const ind_roadblock = world.createEntity();
world.addComponent(player, 'position',   { x: WIDTH / 2, y: HEIGHT / 2 });
world.addComponent(player, 'velocity',   { dx: 0, dy: 0 });
world.addComponent(player, 'movable', {movable:true})
world.addComponent(player, 'appearance', { char: 'H' });
world.addComponent(ind_roadblock, 'position',   { x: WIDTH / 2, y: 0});
world.addComponent(ind_roadblock, 'velocity',   { dx: 0, dy: 1 });
world.addComponent(ind_roadblock, 'appearance', { char: '_' });

// A handful of drifting obstacles — no extra classes needed
for (let i = 0; i < 10; i++) {
  const e = world.createEntity();
  let startpos = { x: Math.random() * WIDTH, y: Math.random() * HEIGHT };
  world.addComponent(e, 'position',   startpos);
  world.addComponent(e, 'velocity',   { dx: (Math.random() - 0.5) * 10, dy: Math.random() * 5 });
  world.addComponent(e, 'appearance', { char: '*' });
}



// The pipeline — order matters!
const systems = new SystemManager();
systems.add(new PlayerInputSystem(input, player));
systems.add(new MovementSystem());
systems.add(new BoundsSystem(WIDTH, HEIGHT));
systems.add(new RenderSystem(buffer, (b) => {
  process.stdout.write('\x1b[H'); // move cursor to top-left
  process.stdout.write(b.toString());
}));
setupScreen();
let frame = 0;

function spawn_roadblock(){
  let roadblock = world.createEntity()
  let delay = 1000;

  const e = world.createEntity();
  let startpos = { x: Math.random() * WIDTH, y: 0 };
  world.addComponent(e, 'position',   startpos);
  world.addComponent(e, 'velocity',   { dx: 0, dy: 7 });
  world.addComponent(e, 'appearance', { char: '_' });
  //delay -=0.2

}

let intervalid = setInterval(((a)=>{
  spawn_roadblock();

}), 100)

function check_collision(): boolean{
  let p = world.query("movable")[0]!;
  let entities = world.query("position", "velocity");
//BUG: i is a position in an array and because the player is the first thing imported it has to be one this will cause errors
  for(let i = 1; i<entities.length; i++){
    let entity = entities[i]!;
    let pos = world.getComponent(entity, "position") as Position;
    let vel = world.getComponent(entity, "velocity") as Velocity;
    let player_pos = world.getComponent(p, "position") as Position;
    let player_velocity = world.getComponent(p, "velocity") as Velocity;
    let player_movable = world.getComponent(p, "movable") as Movable
    if(pos.y >= HEIGHT - 1){
      world.destroyEntity(entity);
    }
    if(Math.round(pos.y) === Math.round(player_pos.y) && Math.round(pos.x) === Math.round(player_pos.x)){
      player_velocity.dy = 0;
      player_velocity.dx = 0;
      player_movable.movable = false;
      world.destroyEntity(entity);

      return true;

    }
  }
  return false;

}
function cleanup(loop:GameLoop): void {
  loop.stop();
  input.close();
  resetScreen();
  process.exit(0);
}

function main(){
  const loop = new GameLoop(30, (deltaTime) => {
    systems.update(world, deltaTime);
    let p = world.query("movable")[0]!;
    let player_pos = world.getComponent(p, "position") as Position;

    if (check_collision() === true){
      let pos_array = [{x:player_pos.x, y:player_pos.y + 1}, {x:player_pos.x + 1, y:player_pos.y}, {x: player_pos.x - 1, y:player_pos.y}, {x:player_pos.x, y:player_pos.y -1}]
      for (let i = 0; i < 4; i++){
        const e = world.createEntity();
        world.addComponent(e, 'position', pos_array[i]!)
        world.addComponent(e, "appearance", {char: "*"})
      }
      const game_over = world.createEntity();
      world.addComponent(game_over, 'position', {x: player_pos.x, y: player_pos.y - 2})
      world.addComponent(game_over, "appearance", {char: "Game Over"})

      let timeout = setTimeout(((a)=>{
        cleanup(loop);

      }), 3000)

    }



    if (input.wasJustPressed('ctrl-c') || input.wasJustPressed('escape')) {
      cleanup(loop);
    }
    input.endFrame();
    console.log(`end frame ${frame}`);
    frame++;
    let player = world.query("movable");
    let pos = world.getComponent(player[0]!, "position");
    console.log(`player position: ${JSON.stringify(pos)}`)
  });


  process.on('SIGINT', cleanup);
  process.on('exit', resetScreen);

  loop.start();
}

main();

function resetScreen(): void {
  process.stdout.write('\x1b[?25h'); // unhide cursor
  process.stdout.write('\u001B[?1049l'); // switch back to main buffer
}

function setupScreen(){
  process.stdout.write('\u001B[?1049h') // switch to alternate buffer
  process.stdout.write('\x1b[?25l'); // hide cursor
}
