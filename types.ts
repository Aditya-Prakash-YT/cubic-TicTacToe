export type Player = 'X' | 'O';
export type CellValue = Player | null;

// The board is represented as a flat array of 27 cells (3x3x3)
// Index = x + (y * 3) + (z * 9)
// x: 0-2 (Column)
// y: 0-2 (Row)
// z: 0-2 (Layer: Bottom, Middle, Top)
export type BoardState = CellValue[];

export interface WinningLine {
  indices: number[]; // The indices [a, b, c] that form the line
  name: string;      // Description (e.g., "Vertical Pillar", "3D Diagonal")
}

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  winner: Player | 'Draw' | null;
  winningLine: number[] | null; // Indices of the winning cells
}