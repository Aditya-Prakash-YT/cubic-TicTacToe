import React from 'react';
import { BoardState } from '../types';
import { Cell } from './Cell';
import { getIndex } from '../utils/gameLogic';

interface LayerProps {
  layerIndex: number; // Now represents Y-axis (Depth)
  board: BoardState;
  onCellClick: (index: number) => void;
  onCellHover: (index: number | null) => void;
  winningLine: number[] | null;
  disabled: boolean;
  lastMoveIndex: number | null;
}

export const Layer: React.FC<LayerProps> = ({ 
  layerIndex, 
  board, 
  onCellClick, 
  onCellHover,
  winningLine, 
  disabled,
  lastMoveIndex
}) => {
  // Layer Labels for Y-axis slices
  // Y=0: Back, Y=1: Middle, Y=2: Front (based on standard right-handed coords often used, or CSS perspective)
  // In Cube3D: ty = (1-z), tx = (x-1), tz = (y-1).
  // Y=0 -> tz=-1 (Back). Y=2 -> tz=1 (Front).
  const labels = ["Back Slice (Y=1)", "Middle Slice (Y=2)", "Front Slice (Y=3)"];

  // Generate cells for this layer (3x3 grid of X vs Z)
  const renderCells = () => {
    const cells = [];
    // Visual Grid Rows correspond to Z axis (Stack Height).
    // Row 0 is visual top, so Z=2. Row 2 is visual bottom, so Z=0.
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        // Map grid coordinates to 3D coordinates
        const x = col;
        const z = 2 - row; // Invert row index to map to Z height
        const y = layerIndex; // Fixed for this layer

        const index = getIndex(x, y, z);
        const isWinningCell = winningLine ? winningLine.includes(index) : false;
        
        cells.push(
          <Cell
            key={index}
            value={board[index]}
            onClick={() => onCellClick(index)}
            onMouseEnter={() => onCellHover(index)}
            onMouseLeave={() => onCellHover(null)}
            isWinningCell={isWinningCell}
            disabled={disabled || board[index] !== null}
            isLastMove={lastMoveIndex === index}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="
      snap-center shrink-0 
      w-[85vw] max-w-[320px] md:w-auto md:max-w-none
      flex flex-col items-center gap-4 p-4 
      bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm 
      transform transition-transform duration-500 md:hover:scale-[1.02]
      shadow-xl md:shadow-none
    ">
      <div className="flex items-center justify-between w-full px-2">
        <h3 className="text-slate-400 text-xs sm:text-sm font-semibold tracking-wider uppercase">{labels[layerIndex]}</h3>
        {/* Mobile visual indicator for layer depth */}
        <span className="md:hidden text-xs font-mono text-slate-600">Y{layerIndex + 1}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/80 rounded-lg shadow-inner border border-slate-800">
        {renderCells()}
      </div>
      
      {/* Visual Depth Indicators - Updating to represent depth slices */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
            <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === layerIndex ? 'bg-indigo-500 w-6' : 'bg-slate-700 w-2'}`} 
            />
        ))}
      </div>
    </div>
  );
};
