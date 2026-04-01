import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  TARGET_FPS,
  GAME_TITLE,
  MAX_ENTITIES,
  EMPTY_CHAR,
  BORDER_CHAR
} from './constants';

describe('Engine Constants', () => {
  test('screen dimensions are positive numbers', () => {
    expect(SCREEN_WIDTH).toBeGreaterThan(0);
    expect(SCREEN_HEIGHT).toBeGreaterThan(0);
  });

  test('screen dimensions are reasonable', () => {
    // Screen should be at least 20x10 and no more than 200x100
    expect(SCREEN_WIDTH).toBeGreaterThanOrEqual(20);
    expect(SCREEN_WIDTH).toBeLessThanOrEqual(200);
    expect(SCREEN_HEIGHT).toBeGreaterThanOrEqual(10);
    expect(SCREEN_HEIGHT).toBeLessThanOrEqual(100);
  });

  test('target FPS is a positive number', () => {
    expect(TARGET_FPS).toBeGreaterThan(0);
  });

  test('target FPS is reasonable for a game', () => {
    // Games typically run at 30-120 FPS
    expect(TARGET_FPS).toBeGreaterThanOrEqual(15);
    expect(TARGET_FPS).toBeLessThanOrEqual(120);
  });

  test('frame duration can be calculated without division by zero', () => {
    const frameDuration = 1000 / TARGET_FPS;
    expect(frameDuration).toBeGreaterThan(0);
    expect(Number.isFinite(frameDuration)).toBe(true);
  });

  test('game title is a non-empty string', () => {
    expect(GAME_TITLE.length).toBeGreaterThan(0);
  });

  test('max entities is a positive number', () => {
    expect(MAX_ENTITIES).toBeGreaterThan(0);
  });

  test('display characters are single characters', () => {
    expect(EMPTY_CHAR.length).toBe(1);
    expect(BORDER_CHAR.length).toBe(1);
  });

  test('display characters are different from each other', () => {
    expect(EMPTY_CHAR).not.toBe(BORDER_CHAR);
  });
});
