import { GameLoop } from './game_loop';
import { EntityManager } from '../engine/EntityManager';
import { ScreenBuffer } from '../engine/ScreenBuffer';
import { SystemManager } from '../engine/SystemManager';
import { MovementSystem } from '../engine/MovementSystem';
import { BoundsSystem } from '../engine/BoundsSystem';
import { RenderSystem } from '../engine/RenderSystem';
import { Input } from '../engine/Input';
import { PlayerInputSystem } from '../game/PlayerInputSystem';
import {Velocity} from '../game/components'

const WIDTH = 60;
const HEIGHT = 20;

const world = new EntityManager();
const input = new Input();
const buffer = new ScreenBuffer(WIDTH, HEIGHT);

// Player
const player = world.createEntity();
world.addComponent(player, 'position',   { x: WIDTH / 2, y: HEIGHT / 2 });
world.addComponent(player, 'velocity',   { dx: 0, dy: 0 });
world.addComponent(player, 'appearance', { char: '@' });

// A handful of drifting obstacles — no extra classes needed
for (let i = 0; i < 10; i++) {
  const e = world.createEntity();
  world.addComponent(e, 'position',   { x: Math.random() * WIDTH, y: Math.random() * HEIGHT });
  world.addComponent(e, 'velocity',   { dx: (Math.random() - 0.5) * 10, dy: (Math.random() - 0.5) * 10 });
  world.addComponent(e, 'appearance', { char: '*' });
}

// The pipeline — order matters!
const systems = new SystemManager();
systems.add(new PlayerInputSystem(input, player));
systems.add(new MovementSystem());
systems.add(new BoundsSystem(WIDTH, HEIGHT));
systems.add(new RenderSystem(buffer, (b) => {
  process.stdout.write('\x1b[H');
  process.stdout.write(b.toString());
}));

process.stdout.write('\x1b[?25l'); // hide cursor

const loop = new GameLoop(30, (deltaTime) => {
  systems.update(world, deltaTime);

  if (input.wasJustPressed('ctrl-c') || input.wasJustPressed('escape')) {
    cleanup();
  }
  input.endFrame();

});

function cleanup(): void {
  loop.stop();
  input.close();
  process.stdout.write('\x1b[?25h');
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('exit', () => process.stdout.write('\x1b[?25h'));

loop.start();


