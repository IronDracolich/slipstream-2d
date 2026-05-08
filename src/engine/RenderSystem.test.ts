import { EntityManager } from './EntityManager';
import { ScreenBuffer } from './ScreenBuffer';
import { RenderSystem } from './RenderSystem';

describe('RenderSystem', () => {
  test('draws every entity with position + appearance', () => {
    const world = new EntityManager();
    const buffer = new ScreenBuffer(10, 5);

    const player = world.createEntity();
    world.addComponent(player, 'position', { x: 3, y: 2 });
    world.addComponent(player, 'appearance', { char: '@' });

    const wall = world.createEntity();
    world.addComponent(wall, 'position', { x: 5, y: 2 });
    world.addComponent(wall, 'appearance', { char: '#' });

    let displayed: ScreenBuffer | null = null;
    const system = new RenderSystem(buffer, (b) => { displayed = b; });

    system.update(world, 0);

    expect(buffer.get(3, 2)).toBe('@');
    expect(buffer.get(5, 2)).toBe('#');
    expect(displayed).toBe(buffer);
  });

  test('ignores entities without appearance', () => {
    const world = new EntityManager();
    const buffer = new ScreenBuffer(10, 5);

    const ghost = world.createEntity();
    world.addComponent(ghost, 'position', { x: 3, y: 2 });
    // no appearance — invisible trigger zone, for example

    const system = new RenderSystem(buffer, () => {});
    system.update(world, 0);

    expect(buffer.get(3, 2)).toBe('.'); // the fill character
  });

  test('clears the buffer each tick', () => {
    const world = new EntityManager();
    const buffer = new ScreenBuffer(10, 5);

    // Tick 1: draw something
    const mover = world.createEntity();
    world.addComponent(mover, 'position', { x: 3, y: 2 });
    world.addComponent(mover, 'appearance', { char: '@' });

    const system = new RenderSystem(buffer, () => {});
    system.update(world, 0);
    expect(buffer.get(3, 2)).toBe('@');

    // Move the entity and tick again
    (world.getComponent(mover, 'position') as any).x = 7;
    system.update(world, 0);

    expect(buffer.get(3, 2)).toBe('.'); // old position cleared
    expect(buffer.get(7, 2)).toBe('@'); // new position drawn
  });
});
