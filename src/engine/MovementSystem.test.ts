import { EntityManager } from './EntityManager';
import { MovementSystem } from './MovementSystem';
import { Position, Velocity } from '../game/components';

describe('MovementSystem', () => {
  test('moves entities with position and velocity', () => {
    const world = new EntityManager();
    const mover = world.createEntity();
    world.addComponent(mover, 'position', { x: 0, y: 0 });
    world.addComponent(mover, 'velocity', { dx: 10, dy: 5 });

    const system = new MovementSystem();
    system.update(world, 1); // one second

    const pos = world.getComponent(mover, 'position') as Position;
    expect(pos.x).toBe(10);
    expect(pos.y).toBe(5);
  });

  test('scales by deltaTime', () => {
    const world = new EntityManager();
    const mover = world.createEntity();
    world.addComponent(mover, 'position', { x: 0, y: 0 });
    world.addComponent(mover, 'velocity', { dx: 60, dy: 0 });

    const system = new MovementSystem();
    system.update(world, 0.5); // half a second

    const pos = world.getComponent(mover, 'position') as Position;
    expect(pos.x).toBe(30);
  });

  test('does not move entities without velocity', () => {
    const world = new EntityManager();
    const still = world.createEntity();
    world.addComponent(still, 'position', { x: 5, y: 5 });

    const system = new MovementSystem();
    system.update(world, 1);

    const pos = world.getComponent(still, 'position') as Position;
    expect(pos.x).toBe(5);
    expect(pos.y).toBe(5);
  });

  test('moves many entities independently', () => {
    const world = new EntityManager();
    const a = world.createEntity();
    const b = world.createEntity();
    world.addComponent(a, 'position', { x: 0, y: 0 });
    world.addComponent(a, 'velocity', { dx: 1, dy: 0 });
    world.addComponent(b, 'position', { x: 10, y: 10 });
    world.addComponent(b, 'velocity', { dx: 0, dy: -2 });

    const system = new MovementSystem();
    system.update(world, 1);

    expect((world.getComponent(a, 'position') as Position).x).toBe(1);
    expect((world.getComponent(b, 'position') as Position).y).toBe(8);
  });
});
