// src/game/setup.ts
import { EntityManager } from '../engine/EntityManager';

export function createWorld(): EntityManager {
  const world = new EntityManager();

  // Create the player
  const player = world.createEntity();
  const roadblock = world.createEntity();
  const score = world.createEntity();
  const wall = world.createEntity();
  world.addComponent(player, "position", { x: 5, y: 5 });
  // ... add more components ...
  world.addComponent(player, "model", {model:"H"})
  world.addComponent(player, "movable", {movable:true})
  world.addComponent(player, "velocity", {dx:0, dy:0})
  world.addComponent(roadblock, "position", {x: 3, y:3});
  world.addComponent(roadblock, "model", {model:"_"})
  world.addComponent(score, "model", {model: "/NaN/"})
  world.addComponent(score, "position", {x:0, y:0})
  world.addComponent(wall, "position", {x:0, y:2})

  // Create walls, enemies, items...

  return world;
}
