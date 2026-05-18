import { EntityManager } from './EntityManager';
import { System } from './System';
import { ScreenBuffer } from './ScreenBuffer';
import { Position, Appearance } from '../game/components';

export class RenderSystem implements System {
  constructor(
    private buffer: ScreenBuffer,
    private display: (buffer: ScreenBuffer) => void
  ) {}

  update(world: EntityManager, deltaTime: number): void {
    this.buffer.clear();
    let entities = world.query("position", "appearance");
    for (const entity of entities) {
      const pos = world.getComponent(entity, "position") as Position;
      const app = world.getComponent(entity, "appearance") as Appearance;
      this.buffer.set(Math.round(pos.x), Math.round(pos.y), app.char);
    }
    this.display(this.buffer);
  }
}
