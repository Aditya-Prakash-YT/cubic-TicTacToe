import React, { useState, useEffect, useRef } from 'react';
import { GameState, Player, Theme } from './types';
import { checkWinner, checkDraw } from './utils/gameLogic';
import { Layer } from './components/Layer';
import { Cube3D } from './components/Cube3D';
import { RefreshCcw, Trophy, Box, Hand, Swords, Palette } from 'lucide-react';
import { playSound } from './utils/sound';

const THEMES: Theme[] = [
  { name: 'Neon City', colors: { X: 'cyan', O: 'rose' } },
  { name: 'Matrix', colors: { X: 'green', O: 'purple' } },
  { name: 'Sunset', colors: { X: 'amber', O: 'violet' } },
  { name: 'Ocean', colors: { X: 'sky', O: 'emerald' } },
];

const INITIAL_STATE: GameState = {
  board: Array(27).fill(null),
  currentPlayer: 'X',
  winner: null,
  winningLine: null,
};

function App() {
  const [game, setGame] = useState<GameState>(INITIAL_STATE);
  const [scores, setScores] = useState<{ X: number; O: number }>({ X: 0, O: 0 });
  const [lastMoveIndex, setLastMoveIndex] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const handleCellClick = (index: number) => {
    // Prevent move if cell is already occupied or game is over
    if (game.board[index] !== null || game.winner) return;

    const newBoard = [...game.board];
    newBoard[index] = game.currentPlayer;
    
    // Play move sound
    playSound(game.currentPlayer === 'X' ? 'move-x' : 'move-o');

    const { winner, line } = checkWinner(newBoard);
    const isDraw = !winner && checkDraw(newBoard);

    if (winner) {
        setScores(prev => ({ ...prev, [winner as Player]: prev[winner as Player] + 1 }));
        setTimeout(() => playSound('win'), 200);
    } else if (isDraw) {
        setTimeout(() => playSound('draw'), 200);
    }

    setLastMoveIndex(index);
    setGame({
      board: newBoard,
      currentPlayer: game.currentPlayer === 'X' ? 'O' : 'X',
      winner: winner || (isDraw ? 'Draw' : null),
      winningLine: line,
    });
  };

  const handleCellHover = (index: number | null) => {
      if (index !== hoveredCell) {
          if (index !== null && !game.board[index] && !game.winner) {
             playSound('hover');
          }
          setHoveredCell(index);
      }
  };

  const resetGame = () => {
    playSound('reset');
    setGame(INITIAL_STATE);
    setLastMoveIndex(null);
  };

  // 3D Perspective Animation State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only track mouse on desktop to avoid conflicting with touch scrolling
      if (window.matchMedia("(pointer: fine)").matches) {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        setMousePos({ x, y });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simple touch handler for rotating the cube on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    
    // Calculate delta and update position gently
    const x = (touch.clientX / window.innerWidth) * 2 - 1;
    const y = (touch.clientY / window.innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const xColor = currentTheme.colors.X;
  const oColor = currentTheme.colors.O;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-white overflow-x-hidden font-sans">
      
      {/* Header */}
      <header className="relative w-full text-center space-y-1 z-10 pt-8 pb-4 px-4 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 drop-shadow-2xl">
          CUBIC TIC-TAC-TOE
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed tracking-wide">
          ROW, COLUMN, STACK, OR 3D DIAGONAL.
        </p>

        {/* Theme Toggle Button */}
        <button 
          onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
          className="absolute right-4 top-8 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-500 transition-colors"
          aria-label="Customize Theme"
        >
           <Palette className="w-5 h-5 text-slate-300" />
        </button>

        {/* Theme Menu */}
        {isThemeMenuOpen && (
          <div className="absolute top-20 right-4 z-50 bg-slate-900/95 border border-slate-700 p-4 rounded-xl shadow-2xl flex flex-col gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
             <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 text-center">Select Theme</span>
             {THEMES.map((theme) => (
               <button
                 key={theme.name}
                 onClick={() => { setCurrentTheme(theme); setIsThemeMenuOpen(false); }}
                 className={`flex items-center gap-3 p-2 rounded-lg transition-all ${currentTheme.name === theme.name ? 'bg-slate-800 ring-1 ring-slate-500' : 'hover:bg-slate-800/50'}`}
               >
                 <div className="flex gap-1">
                    <div className={`w-4 h-4 rounded-full bg-${theme.colors.X}-400 shadow-[0_0_8px] shadow-${theme.colors.X}-500/50`}></div>
                    <div className={`w-4 h-4 rounded-full bg-${theme.colors.O}-400 shadow-[0_0_8px] shadow-${theme.colors.O}-500/50`}></div>
                 </div>
                 <span className="text-sm font-medium text-slate-300">{theme.name}</span>
               </button>
             ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-[1500px] flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 xl:gap-16 flex-1 pb-12 px-4 md:px-8 mt-4">
        
        {/* Left Panel: 3D Visualization & Players */}
        <div className="flex flex-col items-center gap-6 order-1 xl:w-[420px] shrink-0 xl:sticky xl:top-8">
           
           {/* Cube Container */}
           <div 
             className="relative flex flex-col items-center justify-center p-4 bg-slate-900/30 rounded-3xl border border-white/5 shadow-2xl w-full aspect-square"
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
           >
             <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-500/70 uppercase tracking-[0.3em] pointer-events-none">
               Holographic View
             </div>
             
             <Cube3D 
               board={game.board} 
               winningLine={game.winningLine} 
               mousePos={mousePos}
               hoveredIndex={hoveredCell}
               theme={currentTheme}
             />
             
             <div className="absolute bottom-4 left-0 right-0 text-center text-slate-500/50 text-[10px] sm:text-xs flex items-center justify-center gap-2 pointer-events-none">
               <Hand className="w-3 h-3 sm:hidden animate-pulse" /> 
               <Box className="w-3 h-3 hidden sm:block" />
               <span className="sm:hidden">Drag to Rotate</span>
               <span className="hidden sm:inline">Live 3D State Representation</span>
             </div>
           </div>

           {/* Game Status Bar (Players) */}
           <div className="w-full flex items-center justify-center gap-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
              <div className={`flex flex-1 flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${game.currentPlayer === 'X' && !game.winner ? `bg-${xColor}-950/40 border border-${xColor}-500/30 shadow-[0_0_20px] shadow-${xColor}-500/15 scale-105` : 'opacity-50 grayscale scale-95'}`}>
                 <span className={`text-4xl font-black text-${xColor}-400 drop-shadow-[0_0_10px_currentColor]`}>X</span>
                 <span className={`text-[10px] uppercase tracking-[0.2em] font-bold text-${xColor}-200/70`}>Player 1</span>
                 <div className={`text-xs font-mono text-${xColor}-400 bg-${xColor}-950/50 px-3 py-1 rounded-full border border-${xColor}-500/30 mt-1 shadow-[0_0_10px] shadow-${xColor}-500/20`}>
                    WINS: {scores.X}
                 </div>
              </div>
              
              <div className="h-12 w-[1px] bg-slate-700/50"></div>

              <div className={`flex flex-1 flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${game.currentPlayer === 'O' && !game.winner ? `bg-${oColor}-950/40 border border-${oColor}-500/30 shadow-[0_0_20px] shadow-${oColor}-500/15 scale-105` : 'opacity-50 grayscale scale-95'}`}>
                 <span className={`text-4xl font-black text-${oColor}-400 drop-shadow-[0_0_10px_currentColor]`}>O</span>
                 <span className={`text-[10px] uppercase tracking-[0.2em] font-bold text-${oColor}-200/70`}>Player 2</span>
                 <div className={`text-xs font-mono text-${oColor}-400 bg-${oColor}-950/50 px-3 py-1 rounded-full border border-${oColor}-500/30 mt-1 shadow-[0_0_10px] shadow-${oColor}-500/20`}>
                    WINS: {scores.O}
                 </div>
              </div>
           </div>
        </div>

        {/* Right Panel: Controls & Layers */}
        <div className="flex-1 flex flex-col items-center order-2 w-full min-w-0">
          
          {/* Interactive Layers - Container Box */}
          <div className="w-full relative group bg-slate-900/30 rounded-[2rem] p-4 sm:p-8 border border-slate-800/60 shadow-2xl backdrop-blur-sm">
             <div className="absolute top-4 left-6 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] hidden md:block">
               Tactical Layer Interface (Y-Axis Slices)
             </div>

             {/* Mobile Scroll Hint - Left Fade */}
             <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900/90 to-transparent z-10 pointer-events-none md:hidden rounded-l-[2rem]"></div>
             {/* Mobile Scroll Hint - Right Fade */}
             <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900/90 to-transparent z-10 pointer-events-none md:hidden rounded-r-[2rem]"></div>

            <div 
                className="
                    flex flex-row overflow-x-auto snap-x snap-mandatory 
                    gap-4 px-4 pb-4 pt-4 w-full
                    md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 md:pt-8
                    scrollbar-hide place-items-center
                "
                style={{
                    transform: typeof window !== 'undefined' && window.innerWidth >= 768 
                        ? `rotateX(${mousePos.y * -0.5}deg) rotateY(${mousePos.x * 0.5}deg)` 
                        : 'none',
                    perspective: '1000px'
                }}
            >
                {/* 
                  Layers 0, 1, 2 correspond to Y coordinates (Depth). 
                  Y=0 (Back), Y=1 (Middle), Y=2 (Front)
                */}
                {[0, 1, 2].map((layerIdx) => (
                <Layer
                    key={layerIdx}
                    layerIndex={layerIdx}
                    board={game.board}
                    onCellClick={handleCellClick}
                    onCellHover={handleCellHover}
                    winningLine={game.winningLine}
                    disabled={!!game.winner}
                    lastMoveIndex={lastMoveIndex}
                    theme={currentTheme}
                />
                ))}
            </div>
            
             <div className="md:hidden flex justify-center gap-1 mt-4 text-[10px] text-slate-500 uppercase tracking-widest">
                <span>Swipe to navigate layers</span>
            </div>
          </div>

          {/* Winner Overlay / Footer Controls */}
          <div className="w-full flex flex-col items-center justify-center mt-8 min-h-[100px]">
            {game.winner ? (
              <div className="w-full max-w-md flex flex-col items-center animate-in slide-in-from-bottom-5 fade-in duration-500 bg-slate-900 p-6 rounded-3xl border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3 text-2xl sm:text-4xl font-black mb-6">
                   {game.winner === 'Draw' ? (
                     <span className="text-slate-300">It's a Draw!</span>
                   ) : (
                     <>
                       <Trophy className={`w-8 h-8 ${game.winner === 'X' ? `text-${xColor}-400` : `text-${oColor}-400`}`} />
                       <span className={game.winner === 'X' ? `text-${xColor}-400` : `text-${oColor}-400`}>
                         PLAYER {game.winner} WINS!
                       </span>
                     </>
                   )}
                </div>
                <button
                  onClick={resetGame}
                  className="w-full group flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-200 text-slate-950 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                  <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
                  REMATCH
                </button>
              </div>
            ) : (
             !game.board.every(c => c === null) && (
                <button 
                    onClick={resetGame}
                    className="mt-4 text-slate-600 hover:text-slate-300 text-xs uppercase tracking-[0.2em] transition-colors flex items-center gap-2 py-2 px-4 rounded-full hover:bg-white/5"
                >
                    <RefreshCcw className="w-3 h-3" /> Reset Board
                </button>
             )
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;