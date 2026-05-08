import { EntityManager } from './EntityManager';

/**
 * A system is a small, focused piece of logic that runs once per tick.
 * It reads and/or writes components through world queries.
 * Systems should not store game state — all state lives in components.
 */
export interface System {
  /**
   * Run this system once.
   * @param world      The entity manager to query and mutate
   * @param deltaTime  Time elapsed since the previous tick, in seconds
   */
  update(world: EntityManager, deltaTime: number): void;
}
