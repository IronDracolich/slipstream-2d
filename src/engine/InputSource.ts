/**
 * Contract for anything that can tell the game what keys are pressed.
 * The real Input class implements this against stdin.
 * Tests implement it with a mock.
 */


export interface InputSource {
  /** True if the key is currently held (pressed within the recent window). */
  isKeyPressed(key: string): boolean;

  /** True ONLY on the tick when the key was first pressed this frame. */
  wasJustPressed(key: string): boolean;

  /** Called once per tick, after game logic has read inputs. Clears just-pressed state. */
  endFrame(): void;

  /** Tear down any listeners and restore terminal state. */
  close(): void;
}
