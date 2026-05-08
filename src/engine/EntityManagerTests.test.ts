import {EntityManager} from "./EntityManager";
import {createWorld} from "../game/setup"

describe('EntityManager', () => {
  let world: EntityManager;

  beforeEach(() => {
    world = new EntityManager();
  });

  test('should create entities with unique IDs', () => {
    const a = world.createEntity();
    const b = world.createEntity();
    expect(a).not.toBe(b);
  });

  test('should track entity existence', () => {
    const e = world.createEntity();
    expect(world.entityExists(e)).toBe(true);
    world.destroyEntity(e);
    expect(world.entityExists(e)).toBe(false);
  });

  test('should add and retrieve components', () => {
    const e = world.createEntity();
    world.addComponent(e, "position", { x: 5, y: 3 });

    const pos = world.getComponent(e, "position");
    expect(pos.x).toBe(5);
    expect(pos.y).toBe(3);
  });

  test('should return undefined for missing components', () => {
    const e = world.createEntity();
    expect(world.getComponent(e, "position")).toBeUndefined();
  });

  test('should remove components', () => {
    const e = world.createEntity();
    world.addComponent(e, "health", { current: 100, max: 100 });
    world.removeComponent(e, "health");
    expect(world.hasComponent(e, "health")).toBe(false);
  });

  test('should remove all components when entity is destroyed', () => {
    const e = world.createEntity();
    world.addComponent(e, "position", { x: 0, y: 0 });
    world.addComponent(e, "health", { current: 50, max: 50 });
    world.destroyEntity(e);
    expect(world.getComponent(e, "position")).toBeUndefined();
  });
});

describe('query', () => {
  test('should find entities with matching components', () => {
    const world = new EntityManager();

    const player = world.createEntity();
    world.addComponent(player, "position", { x: 0, y: 0 });
    world.addComponent(player, "velocity", { dx: 1, dy: 0 });
    world.addComponent(player, "appearance", { char: "@" });

    const wall = world.createEntity();
    world.addComponent(wall, "position", { x: 5, y: 5 });
    world.addComponent(wall, "appearance", { char: "#" });

    // Query for things that move
    const movers = world.query("position", "velocity");
    expect(movers).toContain(player);
    expect(movers).not.toContain(wall);

    // Query for things that can be drawn
    const drawables = world.query("position", "appearance");
    expect(drawables).toContain(player);
    expect(drawables).toContain(wall);
  });

  test('should return empty array when no entities match', () => {
    const world = new EntityManager();
    const e = world.createEntity();
    world.addComponent(e, "position", { x: 0, y: 0 });

    const result = world.query("health");
    expect(result).toEqual([]);
  });
});

describe('createWorld', () => {
  test('should create a player with position and appearance', () => {
    const world = createWorld();
    const players = world.query("position", "model");
    expect(players.length).toBe(3);

    const pos = world.getComponent(players[0], "position");
    expect(pos.x).toBeDefined();
    expect(pos.y).toBeDefined();
  });

  test('should create at least one wall', () => {
    const world = createWorld();
    const walls = world.query("position", "model");
    // Should have more than just the player
    expect(walls.length).toBeGreaterThan(1);
  });
});
