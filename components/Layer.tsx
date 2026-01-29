import React from 'react';
import { BoardState } from '../types';
import { Cell } from './Cell';
import { getIndex } from '../utils/gameLogic';

interface LayerProps {
  layerIndex: number;
  board: BoardState;
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  disabled: boolean;
  lastMoveIndex: number | null;
}

export const Layer: React.FC<LayerProps> = ({ 
  layerIndex, 
  board, 
  onCellClick, 
  winningLine, 
  disabled,
  lastMoveIndex
}) => {
  // Layer Labels
  const labels = ["Bottom Layer (Z=1)", "Middle Layer (Z=2)", "Top Layer (Z=3)"];

  // Generate cells for this layer (3x3)
  const renderCells = () => {
    const cells = [];
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const index = getIndex(x, y, layerIndex);
        const isWinningCell = winningLine ? winningLine.includes(index) : false;
        
        cells.push(
          <Cell
            key={index}
            value={board[index]}
            onClick={() => onCellClick(index)}
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
        <span className="md:hidden text-xs font-mono text-slate-600">L{layerIndex + 1}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/80 rounded-lg shadow-inner border border-slate-800">
        {renderCells()}
      </div>
      
      {/* Visual Depth Indicators */}
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