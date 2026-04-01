import {ScreenBuffer} from "./ScreenBuffer"
export interface Renderable {
  /**
   * Draw this object onto the given buffer.
   * @param buffer - The screen buffer to draw on
   */
  drawTo(buffer: ScreenBuffer): void;
}
