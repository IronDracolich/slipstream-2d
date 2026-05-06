import {createGrid, isInBounds, setCell, getCell, gridToString} from "../screen_buffer_helper/grid-helper";

/**
 * A 2D character buffer for building terminal display frames.
 *
 * Coordinates use (x, y) where x is the column and y is the row.
 * The origin (0, 0) is the top-left corner.
 */
export class ScreenBuffer {
  // TODO: Add private properties:
  //   - width: number
        width:number
        height:number
        fillCharacter:string
        grid:string[][]
  /**
   * Create a new ScreenBuffer.
   * @param width - Number of columns
   * @param height - Number of rows
   * @param fillChar - Character used for empty cells (default: ".")
   */
  constructor(width: number, height: number, fillChar: string = ".") {
    // TODO: Initialize properties and build the grid
    this.width = width
    this.height = height    
    this.fillCharacter = fillChar
    this.grid = createGrid(this.width, this.height, this.fillCharacter)
  }

  /** Fill every cell with the fill character */
  clear(): void {
    // TODO: Implement
    this.grid = createGrid(this.width, this.height, this.fillCharacter)
  }

  /**
   * Set a character at (x, y). Does nothing if out of bounds.
   * @param x - Column index
   * @param y - Row index
   * @param char - The character to place (must be a single character)
   */
  set(x: number, y: number, char: string): void {
    // TODO: Implement with bounds checking
    setCell(this.grid, x, y, char, this.width, this.height)
  }

  /**
   * Get the character at (x, y). Returns fillChar if out of bounds.
   * @param x - Column index
   * @param y - Row index
   * @returns The character at the position
   */
  get(x: number, y: number): string {
    // TODO: Implement with bounds checking
    return getCell(this.grid, x, y, this.width, this.height, this.fillCharacter);

  }

  /**
   * Write a string starting at (x, y), extending to the right.
   * Characters that extend past any edge are clipped.
   * @param x - Starting column
   * @param y - Row
   * @param text - The string to write
   */

  // x = .............. y =\
  //      ..............   \
  writeText(x_start: number, y_start: number, text: string): void {
    let x:number = x_start;
    let y:number = y_start;
    for(let i = 0; i < text.length; i++){
      if(text[i] != "\n"){
        this.set(x, y, text[i]!);
        x++;
      }else{
        y++
        x = x_start;
      }
    }
  }

  /**
   * Convert the buffer to a single display string.
   * Rows are joined with newlines.
   * @returns The buffer as a printable string
   */
  toString(): string {
    // TODO: Implement
    return gridToString(this.grid)
  }

  /** @returns The buffer width in columns */
  getWidth(): number {
    return this.width;
  }

  /** @returns The buffer height in rows */
  getHeight(): number {
    return this.height;
  }
}
