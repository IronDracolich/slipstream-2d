// These interfaces describe the shape of your components.
// They are not enforced at runtime yet, but they document
// what data each component holds.

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  dx: number;
  dy: number;
}

export interface Movable{
  movable:boolean
}

// Add your game-specific components...

export interface Appearance {
  char: string;
}
