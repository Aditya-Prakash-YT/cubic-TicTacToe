import React from 'react';
import { BoardState } from '../types';
import { getCoords } from '../utils/gameLogic';

interface Cube3DProps {
  board: BoardState;
  winningLine: number[] | null;
  mousePos: { x: number; y: number };
}

export const Cube3D: React.FC<Cube3DProps> = ({ board, winningLine, mousePos }) => {
  // Spacing between cells in pixels for the 3D projection
  const SPACING = 60;
  
  // Base rotation plus mouse influence
  const rotateX = -15 + (mousePos.y * -20);
  const rotateY = 45 + (mousePos.x * 20);

  return (
    <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] xl:w-[400px] xl:h-[400px] flex items-center justify-center perspective-[1200px] touch-none">
      <div 
        className="relative w-0 h-0 transform-style-3d transition-transform duration-200 ease-out scale-[0.6] sm:scale-[0.8] xl:scale-100"
        style={{
          transform: `scale(var(--tw-scale-x)) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Render all 27 cells */}
        {board.map((cell, index) => {
          const { x, y, z } = getCoords(index);
          const isWinning = winningLine?.includes(index);

          const tx = (x - 1) * SPACING;
          // Invert Z visually so layer 0 is at bottom
          const ty = (1 - z) * SPACING; 
          const tz = (y - 1) * SPACING;

          return (
            <div
              key={index}
              className={`absolute flex items-center justify-center transform-style-3d backface-visible transition-all duration-500
                ${cell ? 'opacity-100' : 'opacity-20'}
                ${isWinning ? 'scale-125 z-50' : 'scale-100'}
              `}
              style={{
                width: '40px',
                height: '40px',
                transform: `translateX(${tx}px) translateY(${ty}px) translateZ(${tz}px)`,
                marginLeft: '-20px',
                marginTop: '-20px',
              }}
            >
              {cell ? (
                <div className={`
                   w-10 h-10 flex items-center justify-center text-2xl font-black border-2 rounded-lg shadow-[0_0_15px_currentColor] backdrop-blur-sm
                   ${cell === 'X' 
                      ? 'text-cyan-400 border-cyan-500 bg-cyan-900/30' 
                      : 'text-rose-400 border-rose-500 bg-rose-900/30'}
                   ${isWinning ? 'animate-pulse shadow-[0_0_30px_currentColor] border-white' : ''}
                `}>
                  {cell}
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-500/50" />
              )}
            </div>
          );
        })}

        {/* 3D Wireframe Cage */}
        <div 
            className="absolute border border-slate-700/30 pointer-events-none"
            style={{
                width: `${SPACING * 3}px`,
                height: `${SPACING * 3}px`,
                transform: `translateX(-50%) translateY(-50%) rotateY(0deg)`,
            }}
        />
      </div>

      <style>{`
        .perspective-[1200px] { perspective: 1200px; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
};