import { GameLoop } from './game_loop';
import { createGrid, isInBounds, setCell, getCell, gridToString } from '../screen_buffer_helper/grid-helper';
import { ScreenBuffer } from './ScreenBuffer';
import { Renderer } from './Renderer';
import { Renderable } from './Renderable';


describe('GameLoop', () => {
  let loop: GameLoop;

  afterEach(() => {
    if (loop && loop.isRunning()) {
      loop.stop();
    }
  });

  describe('construction', () => {
    test('should start in stopped state', () => {
      loop = new GameLoop(30, () => {});
      expect(loop.isRunning()).toBe(false);
    });

    test('should start with tick count of 0', () => {
      loop = new GameLoop(30, () => {});
      expect(loop.getTickCount()).toBe(0);
    });
  });

  describe('start()', () => {
    test('should set running to true', () => {
      loop = new GameLoop(30, () => {});
      loop.start();
      expect(loop.isRunning()).toBe(true);
      loop.stop();
    });

    test('should not error when called twice', () => {
      loop = new GameLoop(30, () => {});
      loop.start();
      loop.start(); // Should not throw
      expect(loop.isRunning()).toBe(true);
      loop.stop()
    });
  });

  describe('stop()', () => {
    test('should set running to false', () => {
      loop = new GameLoop(30, () => {});
      loop.start();
      loop.stop();
      expect(loop.isRunning()).toBe(false);
    });

    test('should not error when called on a stopped loop', () => {
      loop = new GameLoop(30, () => {});
      loop.stop();  // Should not throw
      expect(loop.isRunning()).toBe(false);
    });
  });

  describe('tick()', () => {
    test('should call onTick callback', () => {
      const mockOnTick = jest.fn();
      loop = new GameLoop(30, mockOnTick);
      loop.start();
      loop.tick();
      loop.stop()

      expect(mockOnTick).toHaveBeenCalledTimes(1);
    });

    test('should pass deltaTime as a number', () => {
      const mockOnTick = jest.fn();
      loop = new GameLoop(30, mockOnTick);
      loop.start();
      loop.tick();
      loop.stop()

      const deltaTime = mockOnTick.mock.calls[0][0];
      expect(typeof deltaTime).toBe('number');
    });

    test('should increment tick count', () => {
      const mockOnTick = jest.fn();
      loop = new GameLoop(30, mockOnTick);
      loop.start();

      loop.tick();
      loop.tick();
      loop.tick();
      loop.stop();

      expect(loop.getTickCount()).toBe(3);
    });

    test('should not tick when stopped', () => {
      const mockOnTick = jest.fn();
      loop = new GameLoop(30, mockOnTick);

      // Do NOT start the loop
      loop.tick();

      expect(mockOnTick).not.toHaveBeenCalled();
      expect(loop.getTickCount()).toBe(0);
    });

    test('should not tick after stop()', () => {
      const mockOnTick = jest.fn();
      loop = new GameLoop(1, mockOnTick);
      loop.start();
      loop.tick();
      loop.stop();
      loop.tick();        // This should be ignored

      expect(mockOnTick).toHaveBeenCalledTimes(1);
      expect(loop.getTickCount()).toBe(1);
    });
  });
});


describe('createGrid', () => {
  test('should create a grid of the correct dimensions', () => {
    const grid = createGrid(5, 3, ".");
    expect(grid.length).toBe(3);         // 3 rows
    expect(grid[0].length).toBe(5);      // 5 columns each
    expect(grid[1].length).toBe(5);
    expect(grid[2].length).toBe(5);
  });

  test('should fill every cell with the fill character', () => {
    const grid = createGrid(3, 2, "X");
    for (const row of grid) {
      for (const cell of row) {
        expect(cell).toBe("X");
      }
    }
  });

  test('rows should be independent (not shared references)', () => {
    const grid = createGrid(3, 2, ".");
    grid[0][0] = "#";
    expect(grid[1][0]).toBe(".");  // Row 1 should not be affected
  });
});

describe('isInBounds', () => {
  test('should return true for valid positions', () => {
    expect(isInBounds(0, 0, 10, 5)).toBe(true);
    expect(isInBounds(9, 4, 10, 5)).toBe(true);
    expect(isInBounds(5, 2, 10, 5)).toBe(true);
  });

  test('should return false for negative positions', () => {
    expect(isInBounds(-1, 0, 10, 5)).toBe(false);
    expect(isInBounds(0, -1, 10, 5)).toBe(false);
  });

  test('should return false for positions at or beyond the boundary', () => {
    expect(isInBounds(10, 0, 10, 5)).toBe(false);
    expect(isInBounds(0, 5, 10, 5)).toBe(false);
  });
});

describe('setCell and getCell', () => {
  test('should write and read a character', () => {
    const grid = createGrid(5, 3, ".");
    setCell(grid, 2, 1, "@", 5, 3);
    expect(getCell(grid, 2, 1, 5, 3, ".")).toBe("@");
  });

  test('setCell should ignore out-of-bounds writes', () => {
    const grid = createGrid(5, 3, ".");
    setCell(grid, -1, 0, "@", 5, 3);   // Should not crash
    setCell(grid, 99, 0, "@", 5, 3);   // Should not crash
    // Grid should be unchanged
    expect(getCell(grid, 0, 0, 5, 3, ".")).toBe(".");
  });

  test('getCell should return fill for out-of-bounds reads', () => {
    const grid = createGrid(5, 3, ".");
    expect(getCell(grid, -1, 0, 5, 3, ".")).toBe(".");
    expect(getCell(grid, 99, 0, 5, 3, ".")).toBe(".");
  });
});

describe('gridToString', () => {
  test('should join rows with newlines', () => {
    const grid = createGrid(3, 2, ".");
    const result = gridToString(grid);
    expect(result).toBe("...\n...");
  });

  test('should reflect changes made with setCell', () => {
    const grid = createGrid(3, 2, ".");
    setCell(grid, 1, 0, "@", 3, 2);
    const result = gridToString(grid);
    expect(result).toBe(".@.\n...");
  });
});

describe('ScreenBuffer', () => {
  describe('construction', () => {
    test('should create a buffer with the correct dimensions', () => {
      const buf = new ScreenBuffer(10, 5);
      expect(buf.getWidth()).toBe(10);
      expect(buf.getHeight()).toBe(5);
    });

    test('should fill with the default fill character', () => {
      const buf = new ScreenBuffer(3, 2);
      expect(buf.get(0, 0)).toBe(".");
      expect(buf.get(2, 1)).toBe(".");
    });

    test('should accept a custom fill character', () => {
      const buf = new ScreenBuffer(3, 2, " ");
      expect(buf.get(0, 0)).toBe(" ");
    });
  });

  describe('set and get', () => {
    test('should write and read a character', () => {
      const buf = new ScreenBuffer(10, 5);
      buf.set(3, 2, "@");
      expect(buf.get(3, 2)).toBe("@");
    });

    test('should not crash on out-of-bounds set', () => {
      const buf = new ScreenBuffer(10, 5);
      buf.set(-1, 0, "@");
      buf.set(0, -1, "@");
      buf.set(10, 0, "@");
      buf.set(0, 5, "@");
      // Should not throw
    });

    test('should return fill char for out-of-bounds get', () => {
      const buf = new ScreenBuffer(10, 5);
      expect(buf.get(-1, 0)).toBe(".");
      expect(buf.get(10, 0)).toBe(".");
    });
  });

  describe('clear', () => {
    test('should reset all cells to the fill character', () => {
      const buf = new ScreenBuffer(5, 3);
      buf.set(0, 0, "#");
      buf.set(2, 1, "@");
      buf.set(4, 2, "!");

      buf.clear();

      expect(buf.get(0, 0)).toBe(".");
      expect(buf.get(2, 1)).toBe(".");
      expect(buf.get(4, 2)).toBe(".");
    });
  });

  describe('writeText', () => {
    test('should write a string starting at the given position', () => {
      const buf = new ScreenBuffer(10, 3);
      buf.writeText(2, 1, "Hello");
      expect(buf.get(2, 1)).toBe("H");
      expect(buf.get(3, 1)).toBe("e");
      expect(buf.get(4, 1)).toBe("l");
      expect(buf.get(5, 1)).toBe("l");
      expect(buf.get(6, 1)).toBe("o");
    });

    test('should clip text that extends past the right edge', () => {
      const buf = new ScreenBuffer(5, 1);
      buf.writeText(3, 0, "Hello");
      // Only "He" fits (positions 3 and 4)
      expect(buf.get(3, 0)).toBe("H");
      expect(buf.get(4, 0)).toBe("e");
    });

    test('should handle text starting off-screen to the left', () => {
      const buf = new ScreenBuffer(5, 1);
      buf.writeText(-2, 0, "Hello");
      // "Hel" is off-screen, "lo" lands at positions 0 and 1
      expect(buf.get(0, 0)).toBe("l");
      expect(buf.get(1, 0)).toBe("l");
    });
  });

  describe('toString', () => {
    test('should produce a string with rows separated by newlines', () => {
      const buf = new ScreenBuffer(3, 2);
      expect(buf.toString()).toBe("...\n...");
    });

    test('should reflect set characters', () => {
      const buf = new ScreenBuffer(3, 2);
      buf.set(1, 0, "@");
      expect(buf.toString()).toBe(".@.\n...");
    });

    test('should show a complete scene', () => {
      const buf = new ScreenBuffer(5, 3, " ");
      // Draw a border on the top and bottom rows
      for (let x = 0; x < 5; x++) {
        buf.set(x, 0, "#");
        buf.set(x, 2, "#");
      }
      buf.set(2, 1, "@");

      const expected = "#####\n  @  \n#####";
      expect(buf.toString()).toBe(expected);
    });
  });
});

describe('Renderer', () => {
  let buffer: ScreenBuffer;
  let renderer: Renderer;

  beforeEach(() => {
    buffer = new ScreenBuffer(10, 5);
    renderer = new Renderer(buffer);
  });

  describe('add and remove', () => {
    test('should start with no renderables', () => {
      expect(renderer.getRenderableCount()).toBe(0);
    });

    test('should add renderables', () => {
      const obj: Renderable = { drawTo: () => {} };
      renderer.add(obj);
      expect(renderer.getRenderableCount()).toBe(1);
    });

    test('should remove renderables', () => {
      const obj: Renderable = { drawTo: () => {} };
      renderer.add(obj);
      renderer.remove(obj);
      expect(renderer.getRenderableCount()).toBe(0);
    });

    test('should not error when removing something not in the list', () => {
      const obj: Renderable = { drawTo: () => {} };
      renderer.remove(obj);  // Should not throw
      expect(renderer.getRenderableCount()).toBe(0);
    });
  });

  describe('render', () => {
    test('should clear the buffer', () => {
      buffer.set(0, 0, "X");
      renderer.render();
      expect(buffer.get(0, 0)).toBe(".");
    });

    test('should call drawTo on all renderables', () => {
      const mockDraw = jest.fn();
      const obj: Renderable = { drawTo: mockDraw };
      renderer.add(obj);

      renderer.render();

      expect(mockDraw).toHaveBeenCalledTimes(1);
      expect(mockDraw).toHaveBeenCalledWith(buffer);
    });

    test('should draw renderables in order (later overwrites earlier)', () => {
      const background: Renderable = {
        drawTo: (buf) => buf.set(5, 2, ".")
      };
      const player: Renderable = {
        drawTo: (buf) => buf.set(5, 2, "@")
      };

      renderer.add(background);
      renderer.add(player);
      renderer.render();

      expect(buffer.get(5, 2)).toBe("@");  // Player drawn on top
    });
  });
});
