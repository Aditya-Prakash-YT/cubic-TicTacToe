import React from 'react';
import { CellValue } from '../types';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  isWinningCell: boolean;
  disabled: boolean;
  isLastMove?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const Cell: React.FC<CellProps> = ({ 
  value, 
  onClick, 
  isWinningCell, 
  disabled, 
  isLastMove,
  onMouseEnter,
  onMouseLeave
}) => {
  // Styles for the cell based on state
  const baseClasses = "w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-bold rounded-md transition-all duration-300 border-2 shadow-[0_0_10px_rgba(0,0,0,0.2)]";
  
  let colorClasses = "bg-slate-800 border-slate-700 hover:bg-slate-700 cursor-pointer";
  
  if (value === 'X') {
    colorClasses = "bg-slate-800 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] cursor-not-allowed";
  } else if (value === 'O') {
    colorClasses = "bg-slate-800 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.4)] cursor-not-allowed";
  }

  if (isWinningCell) {
    // Override for winner
    if (value === 'X') {
        colorClasses = "bg-cyan-900/50 border-cyan-400 text-cyan-100 scale-110 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-10 cursor-default";
    } else {
        colorClasses = "bg-rose-900/50 border-rose-400 text-rose-100 scale-110 shadow-[0_0_20px_rgba(251,113,133,0.8)] z-10 cursor-default";
    }
  } else if (disabled && !value) {
    colorClasses = "bg-slate-900 border-slate-800 cursor-not-allowed opacity-50";
  }

  return (
    <button
      className={`${baseClasses} ${colorClasses} relative`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      aria-label={value ? `Cell filled with ${value}` : "Empty cell"}
    >
      {value}
      {isLastMove && !isWinningCell && (
        <span className="absolute inset-0 rounded-md ring-2 ring-yellow-400/50 animate-pulse pointer-events-none" />
      )}
    </button>
  );
};