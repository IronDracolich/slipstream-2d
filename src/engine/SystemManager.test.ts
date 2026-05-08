import { EntityManager } from './EntityManager';
import { SystemManager } from './SystemManager';
import { System } from './System';

describe('SystemManager', () => {
  test('starts empty', () => {
    const manager = new SystemManager();
    expect(manager.count()).toBe(0);
  });

  test('add increases count', () => {
    const manager = new SystemManager();
    manager.add({ update: () => {} });
    manager.add({ update: () => {} });
    expect(manager.count()).toBe(2);
  });

  test('update calls every system once', () => {
    const world = new EntityManager();
    const manager = new SystemManager();

    const callsA: number[] = [];
    const callsB: number[] = [];
    manager.add({ update: (_w, dt) => callsA.push(dt) });
    manager.add({ update: (_w, dt) => callsB.push(dt) });

    manager.update(world, 0.033);

    expect(callsA).toEqual([0.033]);
    expect(callsB).toEqual([0.033]);
  });

  test('update calls systems in the order they were added', () => {
    const world = new EntityManager();
    const manager = new SystemManager();
    const order: string[] = [];

    manager.add({ update: () => order.push('first') });
    manager.add({ update: () => order.push('second') });
    manager.add({ update: () => order.push('third') });

    manager.update(world, 0);

    expect(order).toEqual(['first', 'second', 'third']);
  });

  test('each system receives the same world instance', () => {
    const world = new EntityManager();
    const manager = new SystemManager();
    const seen: EntityManager[] = [];

    manager.add({ update: (w) => seen.push(w) });
    manager.add({ update: (w) => seen.push(w) });

    manager.update(world, 0);

    expect(seen[0]).toBe(world);
    expect(seen[1]).toBe(world);
  });
});
