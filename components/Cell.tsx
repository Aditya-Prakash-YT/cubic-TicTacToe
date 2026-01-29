import React from 'react';
import { CellValue, Theme } from '../types';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  isWinningCell: boolean;
  disabled: boolean;
  isLastMove?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  theme: Theme;
}

export const Cell: React.FC<CellProps> = ({ 
  value, 
  onClick, 
  isWinningCell, 
  disabled, 
  isLastMove,
  onMouseEnter,
  onMouseLeave,
  theme
}) => {
  // Styles for the cell based on state
  const baseClasses = "w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-bold rounded-md transition-all duration-300 border-2 shadow-[0_0_10px_rgba(0,0,0,0.2)]";
  
  let colorClasses = "bg-slate-800 border-slate-700 hover:bg-slate-700 cursor-pointer";
  
  const xColor = theme.colors.X;
  const oColor = theme.colors.O;

  if (value === 'X') {
    colorClasses = `bg-slate-800 border-${xColor}-500 text-${xColor}-400 shadow-[0_0_15px] shadow-${xColor}-500/50 cursor-not-allowed`;
  } else if (value === 'O') {
    colorClasses = `bg-slate-800 border-${oColor}-500 text-${oColor}-400 shadow-[0_0_15px] shadow-${oColor}-500/50 cursor-not-allowed`;
  }

  if (isWinningCell) {
    // Override for winner
    if (value === 'X') {
        colorClasses = `bg-${xColor}-900/50 border-${xColor}-400 text-${xColor}-100 scale-110 shadow-[0_0_20px] shadow-${xColor}-400 z-10 cursor-default`;
    } else {
        colorClasses = `bg-${oColor}-900/50 border-${oColor}-400 text-${oColor}-100 scale-110 shadow-[0_0_20px] shadow-${oColor}-400 z-10 cursor-default`;
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