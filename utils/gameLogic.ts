import { BoardState, Player, WinningLine } from '../types';

// Dimensions
const SIZE = 3;
const TOTAL_CELLS = SIZE * SIZE * SIZE;

/**
 * Converts 3D coordinates to a flat index.
 */
export const getIndex = (x: number, y: number, z: number): number => {
  return x + y * SIZE + z * SIZE * SIZE;
};

/**
 * Converts a flat index to 3D coordinates.
 */
export const getCoords = (index: number): { x: number; y: number; z: number } => {
  const z = Math.floor(index / (SIZE * SIZE));
  const remZ = index % (SIZE * SIZE);
  const y = Math.floor(remZ / SIZE);
  const x = remZ % SIZE;
  return { x, y, z };
};

/**
 * Generates all possible winning lines for a 3x3x3 cube.
 * Run once to populate the constant.
 */
const generateWinningLines = (): WinningLine[] => {
  const lines: WinningLine[] = [];

  // Helper to add a line if valid
  const checkAndAddLine = (start: { x: number; y: number; z: number }, dx: number, dy: number, dz: number, name: string) => {
    const indices: number[] = [];
    for (let i = 0; i < SIZE; i++) {
      const x = start.x + dx * i;
      const y = start.y + dy * i;
      const z = start.z + dz * i;
      if (x < 0 || x >= SIZE || y < 0 || y >= SIZE || z < 0 || z >= SIZE) return;
      indices.push(getIndex(x, y, z));
    }
    if (indices.length === SIZE) {
      lines.push({ indices, name });
    }
  };

  // Iterate through all cells to find starting points for lines
  // We only need to check lines starting from certain boundaries to avoid duplicates,
  // but iterating all valid vectors is robust enough if we use a Set to dedupe (or just logic).
  // Simplified approach: Define the 13 unique direction vectors in 3D space.
  const directions = [
    [1, 0, 0], // x-axis
    [0, 1, 0], // y-axis
    [0, 0, 1], // z-axis
    [1, 1, 0], // xy-diagonal 1
    [1, -1, 0], // xy-diagonal 2
    [1, 0, 1], // xz-diagonal 1
    [1, 0, -1], // xz-diagonal 2
    [0, 1, 1], // yz-diagonal 1
    [0, 1, -1], // yz-diagonal 2
    [1, 1, 1], // xyz-diagonal 1 (main 3D)
    [1, 1, -1], // xyz-diagonal 2
    [1, -1, 1], // xyz-diagonal 3
    [1, -1, -1] // xyz-diagonal 4
  ];

  for (let z = 0; z < SIZE; z++) {
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        for (const [dx, dy, dz] of directions) {
            checkAndAddLine({ x, y, z }, dx, dy, dz, 'Win');
        }
      }
    }
  }

  return lines;
};

// Precompute lines
export const WINNING_LINES = generateWinningLines();

export const checkWinner = (board: BoardState): { winner: Player | null; line: number[] | null } => {
  for (const { indices } of WINNING_LINES) {
    const [a, b, c] = indices;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: indices };
    }
  }
  return { winner: null, line: null };
};

export const checkDraw = (board: BoardState): boolean => {
  return board.every((cell) => cell !== null);
};