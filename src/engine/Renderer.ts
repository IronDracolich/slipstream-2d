import { ScreenBuffer } from './ScreenBuffer';
import { Renderable } from './Renderable';

/**
 * Orchestrates the rendering pipeline.
 * Clears the screen buffer, draws all renderables, and displays the result.
 */
export class Renderer {
  private buffer: ScreenBuffer;
  private renderables: Renderable[];

  /**
   * Create a new Renderer.
   * @param buffer - The screen buffer to draw on
   */
  constructor(buffer: ScreenBuffer) {
    // TODO: Initialize properties
    this.buffer = buffer;
    this.renderables = [];
  }

  /**
   * Add a renderable to the draw list.
   * It will be drawn each frame in the order it was added.
   * @param renderable - The object to add
   */
  add(renderable: Renderable): void {
    // TODO: Implement
    this.renderables.push(renderable)
  }

  /**
   * Remove a renderable from the draw list.
   * Does nothing if the renderable is not in the list.
   * @param renderable - The object to remove
   */
  remove(renderable: Renderable): void {
    // TODO: Implement (use indexOf and splice)
    for (let i = 0; i < this.renderables.length; i++){
      if (this.renderables[i] === renderable && this.renderables[i]){
        this.renderables.splice(i,1);
      }
    }
  }

  /**
   * Execute the render pipeline: clear buffer, draw all renderables.
   * Does NOT display to the terminal (call display() separately).
   */
  render(): void {
    // TODO: Clear the buffer, then loop through renderables calling drawTo
    this.buffer.clear();
    for(let i = 0; i < this.renderables.length; i++){
      this.renderables[i]?.drawTo(this.buffer)
    }


  }

  /**
   * Display the current buffer contents to the terminal.
   */
  display(): void {
    // TODO: Clear the terminal and print the buffer
    console.clear();
    console.log(this.buffer.toString());
  }

  /**
   * Get the number of renderables in the draw list.
   */
  getRenderableCount(): number {
    // TODO: Implement
    return this.renderables.length
  }

  /**
   * Get the underlying buffer (useful for testing).
   */
  getBuffer(): ScreenBuffer {
    return this.buffer;
  }
}
