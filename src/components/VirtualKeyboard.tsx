import React from 'react';
import { FingerMap } from '../types';

interface VirtualKeyboardProps {
  activeChar: string; // The character the user is supposed to type next
  pressedKeys: Record<string, boolean>; // Currently pressed physical keys for visual press effects
}

// Map characters to specific finger coordinates and styling colors
const fingerMapping: FingerMap = {
  // Left Hand
  'q': { hand: 'left', finger: 'pinky', color: 'bg-rose-500/10 border-rose-500/40 text-rose-400', label: 'Út Trái' },
  'a': { hand: 'left', finger: 'pinky', color: 'bg-rose-500/10 border-rose-500/40 text-rose-400', label: 'Út Trái' },
  'z': { hand: 'left', finger: 'pinky', color: 'bg-rose-500/10 border-rose-500/40 text-rose-400', label: 'Út Trái' },
  
  'w': { hand: 'left', finger: 'ring', color: 'bg-amber-500/10 border-amber-500/40 text-amber-400', label: 'Áp Út Trái' },
  's': { hand: 'left', finger: 'ring', color: 'bg-amber-500/10 border-amber-500/40 text-amber-400', label: 'Áp Út Trái' },
  'x': { hand: 'left', finger: 'ring', color: 'bg-amber-500/10 border-amber-500/40 text-amber-400', label: 'Áp Út Trái' },
  
  'e': { hand: 'left', finger: 'middle', color: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400', label: 'Giữa Trái' },
  'd': { hand: 'left', finger: 'middle', color: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400', label: 'Giữa Trái' },
  'c': { hand: 'left', finger: 'middle', color: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400', label: 'Giữa Trái' },
  
  'r': { hand: 'left', finger: 'index', color: 'bg-sky-500/10 border-sky-500/40 text-sky-400', label: 'Trỏ Trái' },
  'f': { hand: 'left', finger: 'index', color: 'bg-sky-500/10 border-sky-500/40 text-sky-400', label: 'Trỏ Trái' },
  'v': { hand: 'left', finger: 'index', color: 'bg-sky-500/10 border-sky-500/40 text-sky-400', label: 'Trỏ Trái' },
  't': { hand: 'left', finger: 'index', color: 'bg-sky-500/10 border-sky-500/40 text-sky-400', label: 'Trỏ Trái' },
  'g': { hand: 'left', finger: 'index', color: 'bg-sky-500/10 border-sky-500/40 text-sky-400', label: 'Trỏ Trái' },
  'b': { hand: 'left', finger: 'index', color: 'bg-sky-500/10 border-sky-500/40 text-sky-400', label: 'Trỏ Trái' },
  
  // Space
  ' ': { hand: 'left', finger: 'thumb', color: 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400', label: 'Ngón Cái' },
  
  // Right Hand
  'y': { hand: 'right', finger: 'index', color: 'bg-teal-500/10 border-teal-500/40 text-teal-400', label: 'Trỏ Phải' },
  'h': { hand: 'right', finger: 'index', color: 'bg-teal-500/10 border-teal-500/40 text-teal-400', label: 'Trỏ Phải' },
  'n': { hand: 'right', finger: 'index', color: 'bg-teal-500/10 border-teal-500/40 text-teal-400', label: 'Trỏ Phải' },
  'u': { hand: 'right', finger: 'index', color: 'bg-teal-500/10 border-teal-500/40 text-teal-400', label: 'Trỏ Phải' },
  'j': { hand: 'right', finger: 'index', color: 'bg-teal-500/10 border-teal-500/40 text-teal-400', label: 'Trỏ Phải' },
  'm': { hand: 'right', finger: 'index', color: 'bg-teal-500/10 border-teal-500/40 text-teal-400', label: 'Trỏ Phải' },
  
  'i': { hand: 'right', finger: 'middle', color: 'bg-purple-500/10 border-purple-500/40 text-purple-400', label: 'Giữa Phải' },
  'k': { hand: 'right', finger: 'middle', color: 'bg-purple-500/10 border-purple-500/40 text-purple-400', label: 'Giữa Phải' },
  ',': { hand: 'right', finger: 'middle', color: 'bg-purple-500/10 border-purple-500/40 text-purple-400', label: 'Giữa Phải' },
  
  'o': { hand: 'right', finger: 'ring', color: 'bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-400', label: 'Áp Út Phải' },
  'l': { hand: 'right', finger: 'ring', color: 'bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-400', label: 'Áp Út Phải' },
  '.': { hand: 'right', finger: 'ring', color: 'bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-400', label: 'Áp Út Phải' },
  
  'p': { hand: 'right', finger: 'pinky', color: 'bg-orange-500/10 border-orange-500/40 text-orange-400', label: 'Út Phải' },
  ';': { hand: 'right', finger: 'pinky', color: 'bg-orange-500/10 border-orange-500/40 text-orange-400', label: 'Út Phải' },
  '/': { hand: 'right', finger: 'pinky', color: 'bg-orange-500/10 border-orange-500/40 text-orange-400', label: 'Út Phải' },
  '-': { hand: 'right', finger: 'pinky', color: 'bg-orange-500/10 border-orange-500/40 text-orange-400', label: 'Út Phải' },
  '\'': { hand: 'right', finger: 'pinky', color: 'bg-orange-500/10 border-orange-500/40 text-orange-400', label: 'Út Phải' },
};

// Keyboard keyboard layouts
const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
  ['space']
];

export default function VirtualKeyboard({ activeChar, pressedKeys }: VirtualKeyboardProps) {
  const normActiveChar = activeChar ? activeChar.toLowerCase() : '';
  const activeDetail = fingerMapping[normActiveChar];

  const getFingerClass = (key: string) => {
    const detail = fingerMapping[key];
    if (!detail) return 'border-slate-800 text-slate-400 bg-slate-900/40';
    return `${detail.color} opacity-90`;
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4 border border-slate-800 bg-slate-900/60 rounded-xl max-w-4xl mx-auto">
      {/* Finger Indicator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping"></span>
          <span className="text-sm font-medium text-slate-300">Hướng dẫn ngõ phím tiếp theo:</span>
          {normActiveChar && (
            <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase rounded bg-slate-800 text-yellow-400">
              {normActiveChar === ' ' ? 'SPACE' : activeChar}
            </span>
          )}
        </div>

        {activeDetail ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Sử dụng ngón:</span>
            <span className={`px-3 py-1 text-sm font-bold rounded-full border ${activeDetail.color} flex items-center gap-1.5`}>
              <span className="capitalize">{activeDetail.label}</span>
              <span className="text-xs opacity-75">({activeDetail.hand === 'left' ? 'Tay Trái' : 'Tay Phải'})</span>
            </span>
          </div>
        ) : normActiveChar ? (
          <div className="text-xs text-slate-500 italic">Sử dụng ngón bất kỳ được đề xuất</div>
        ) : (
          <div className="text-xs text-slate-500">Bắt đầu gõ để hiển thị gợi ý ngón tay</div>
        )}
      </div>

      {/* Actual Visual Keyboard Keys */}
      <div className="flex flex-col gap-1.5 font-mono text-sm select-none">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5 w-full">
            {row.map((key, keyIndex) => {
              const isSpace = key === 'space';
              const isEnter = key === 'enter';
              const isShift = key === 'shift';
              const isPressed = pressedKeys[key] || pressedKeys[key.toUpperCase()] || (isSpace && pressedKeys[' ']);
              const isTarget =
                (normActiveChar === key) ||
                (normActiveChar === ' ' && isSpace) ||
                (activeChar === '\n' && isEnter);

              // Styling weights
              let keyWidthStyles = 'w-[6.5%] aspect-square min-w-[32px]';
              if (isSpace) keyWidthStyles = 'w-[50%] h-12';
              if (isEnter) keyWidthStyles = 'w-[11%] min-w-[55px] aspect-square';
              if (isShift) keyWidthStyles = 'w-[10%] min-w-[50px] aspect-square';

              const keyFingerStyles = getFingerClass(key);

              return (
                <div
                  key={keyIndex}
                  className={`
                    flex flex-col items-center justify-center rounded-lg border text-normal transition-all duration-75 text-center
                    ${keyWidthStyles}
                    ${isTarget 
                      ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-950 scale-102 font-bold shadow-md shadow-yellow-500/20' 
                      : ''
                    }
                    ${isPressed 
                      ? 'bg-yellow-400/30 border-yellow-400 text-yellow-100 scale-95 shadow-inner' 
                      : isTarget 
                        ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/80 animate-pulse'
                        : keyFingerStyles
                    }
                  `}
                >
                  <span className="uppercase text-xs font-semibold">
                    {isSpace ? 'SPACE' : isEnter ? 'ENTER' : isShift ? 'SHIFT' : key}
                  </span>
                  
                  {/* Finger coordinate tag */}
                  {isTarget && activeDetail && !isSpace && !isEnter && !isShift && (
                    <span className="text-[9px] mt-0.5 opacity-80 font-sans tracking-tight">
                      {activeDetail.finger === 'pinky' ? 'Út' : 
                       activeDetail.finger === 'ring' ? 'Áp Út' :
                       activeDetail.finger === 'middle' ? 'Giữa' : 'Trỏ'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Visual hands layout guide helper */}
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto w-full text-center text-xs mt-1 border-t border-slate-800/50 pt-3">
        <div className="flex flex-col gap-1.5 items-center justify-center">
          <span className="text-slate-400 font-medium">Bàn Tay Trái (Left Hand)</span>
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px]">Út: A Q Z</span>
            <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px]">Áp út: S W X</span>
            <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">Giữa: D E C</span>
            <span className="px-2 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px]">Trỏ: F R V T G B</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 items-center justify-center">
          <span className="text-slate-400 font-medium">Bàn Tay Phải (Right Hand)</span>
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px]">Trỏ: J Y U H N M</span>
            <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px]">Giữa: K I ,</span>
            <span className="px-2 py-1 rounded bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-[10px]">Áp út: L O .</span>
            <span className="px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px]">Út: ; P /</span>
          </div>
        </div>
      </div>
    </div>
  );
}
