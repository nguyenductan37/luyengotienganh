import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, AlertTriangle, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { Lesson, WordItem } from '../types';

interface TypingAreaProps {
  lesson: Lesson;
  onComplete: (wpm: number, accuracy: number, errors: number, timeSpent: number) => void;
  onActiveCharChange: (char: string) => void;
  onKeyPressed: (key: string, isDown: boolean) => void;
}

export default function TypingArea({
  lesson,
  onComplete,
  onActiveCharChange,
  onKeyPressed
}: TypingAreaProps) {
  // Input tracking
  const [typedText, setTypedText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0); // in seconds
  const [errorsCount, setErrorsCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // References
  const textContainerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Re-initialize when the lesson changes
  useEffect(() => {
    resetTyping();
  }, [lesson]);

  // Handle live active character notifications to parent for keyboard visualization
  useEffect(() => {
    if (isFinished) {
      onActiveCharChange('');
    } else {
      const activeChar = lesson.displayText[typedText.length] || '';
      onActiveCharChange(activeChar);
    }
  }, [typedText, lesson, isFinished]);

  // Build key states for virtual keyboard tracking
  const handlePhysicalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === 'Tab') {
      e.preventDefault();
      resetTyping();
      return;
    }
    onKeyPressed(key, true);
    playKeyboardSound();

    // Prevent scrolling or cursor movements inside the game box for arrow keys only
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
      e.preventDefault();
    }
  };

  const handlePhysicalKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyPressed(e.key, false);
  };

  // Synthesize rich mechanical clicky switcher audio
  const playKeyboardSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Make a high-pass clicky snap
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // AudioContext fails gracefully
    }
  };

  // Handle typing inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const value = e.target.value;
    const previousLength = typedText.length;
    const currentLength = value.length;

    // We process characters typed sequentially
    if (currentLength > previousLength) {
      // Character added
      const charIndex = previousLength;
      const expectedChar = lesson.displayText[charIndex];
      const actualChar = value[charIndex];

      setTotalKeystrokes(prev => prev + 1);

      if (actualChar === expectedChar) {
        setCorrectKeystrokes(prev => prev + 1);
      } else {
        setErrorsCount(prev => prev + 1);
      }

      // Start the timer on the very first character pressed
      if (!isStarted) {
        setIsStarted(true);
        startTimer();
      }
    }

    setTypedText(value);

    // Check if the lesson is fully completed
    if (value.length >= lesson.displayText.length) {
      finishLesson(value);
    }
  };

  // Start the background tracking stats timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
  };

  // Stop the timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const finishLesson = (finalTypedText: string) => {
    stopTimer();
    setIsFinished(true);

    // Calculate final metrics
    const finalTime = Math.max(1, timeSpent);
    // WPM = (correct Keystrokes / 5) / (minutes)
    const finalWpm = Math.round((correctKeystrokes / 5) / (finalTime / 60));
    const finalAccuracy = totalKeystrokes > 0 
      ? Math.round((correctKeystrokes / totalKeystrokes) * 100)
      : 100;

    onComplete(finalWpm, finalAccuracy, errorsCount, finalTime);
  };

  const resetTyping = () => {
    stopTimer();
    setTypedText('');
    setIsStarted(false);
    setIsFinished(false);
    setTimeSpent(0);
    setErrorsCount(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    
    // Auto-focus input box
    setTimeout(() => {
      focusHiddenInput();
    }, 100);
  };

  const focusHiddenInput = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  // Compute live current stats
  const liveWpm = timeSpent > 0 
    ? Math.round((correctKeystrokes / 5) / (timeSpent / 60)) 
    : 0;

  const liveAccuracy = totalKeystrokes > 0 
    ? Math.round((correctKeystrokes / totalKeystrokes) * 100) 
    : 100;

  // Active word detection to display dictionary definitions
  const getActiveWordInfo = (): { word: WordItem; index: number } | null => {
    if (!lesson.items || lesson.items.length === 0) return null;

    // Construct words tracking
    let charCounter = 0;
    for (let i = 0; i < lesson.items.length; i++) {
      const itemWord = lesson.items[i].word;
      const wordLength = itemWord.length;
      
      // Checking if the cursor falls within this word
      if (typedText.length >= charCounter && typedText.length <= charCounter + wordLength) {
        return { word: lesson.items[i], index: i };
      }
      // plus the trailing space
      charCounter += wordLength + 1;
    }

    // fallback to last hovered/typed item
    return { word: lesson.items[lesson.items.length - 1], index: lesson.items.length - 1 };
  };

  const activeWordData = getActiveWordInfo();

  return (
    <div className="w-full flex flex-col gap-6" id="typing-area-container">
      {/* Live Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col justify-center items-center">
          <div className="text-2xl font-mono font-bold text-yellow-400">{liveWpm}</div>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">WPM (Tốc độ)</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col justify-center items-center">
          <div className="text-2xl font-mono font-bold text-emerald-400">{liveAccuracy}%</div>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Độ chính xác</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col justify-center items-center">
          <div className="text-2xl font-mono font-bold text-rose-500">{errorsCount}</div>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Lỗi phím</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col justify-center items-center">
          <div className="text-2xl font-mono font-bold text-sky-400">
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Thời gian</div>
        </div>
      </div>

      {/* Typing Playground Core */}
      <div 
        onClick={focusHiddenInput}
        className={`
          relative w-full p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 cursor-text min-h-[160px] flex items-center justify-center
          ${isInputFocused 
            ? 'bg-slate-950 border-yellow-500/60 shadow-xl shadow-yellow-500/5' 
            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
          }
        `}
      >
        {/* Absolute prompt if not focused */}
        {!isInputFocused && !isFinished && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-2xl gap-2 z-10 p-4 transition-all pointer-events-none">
            <div className="animate-bounce p-2 bg-yellow-400 text-slate-950 rounded-full">
              <Play className="w-5 h-5 fill-slate-950" />
            </div>
            <p className="text-slate-200 text-sm font-semibold tracking-wide">Nhấn vào đây để bắt đầu gõ tập</p>
            <p className="text-slate-500 text-xs">Hãy tập trung nhìn vào màn hình và gõ theo các chữ dưới đây</p>
          </div>
        )}

        {/* Dynamic Caret and Letters rendering */}
        <div 
          ref={textContainerRef}
          className="w-full text-lg sm:text-2xl font-mono tracking-wide leading-relaxed break-all relative select-none max-w-3xl text-left"
        >
          {/* Constructing word items with individual characters highlighted */}
          {lesson.displayText.split('').map((char, index) => {
            const hasBeenTyped = index < typedText.length;
            const isCurrent = index === typedText.length;
            const wasCorrect = hasBeenTyped && typedText[index] === char;

            let charClass = 'text-slate-600 transition-colors duration-100'; // Untype color
            if (hasBeenTyped) {
              charClass = wasCorrect 
                ? 'text-slate-200 font-medium' 
                : 'text-rose-500 border-b border-rose-500 bg-rose-500/10 font-bold';
            }

            return (
              <span key={index} className="relative inline">
                {/* Visual Caret cursor */}
                {isCurrent && isInputFocused && !isFinished && (
                  <span className="absolute left-0 bottom-0 top-0 w-[2px] bg-yellow-400 animate-[pulse_0.8s_infinite] h-full" style={{ bottom: '-3px' }} />
                )}
                <span className={charClass}>
                  {char === ' ' ? ' ' : char}
                </span>
              </span>
            );
          })}
        </div>

        {/* Hidden Input field capturing keystrokes */}
        <input
          ref={hiddenInputRef}
          type="text"
          value={typedText}
          onChange={handleInputChange}
          onKeyDown={handlePhysicalKeyDown}
          onKeyUp={handlePhysicalKeyUp}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          className="absolute opacity-0 pointer-events-none h-0 w-0"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          disabled={isFinished}
        />
      </div>

      {/* Synchronized English Dictionary & Pronunciation Hub */}
      {activeWordData && (
        <div className="w-full bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                Từ đang gõ
              </span>
              <span className="text-xl font-bold text-slate-100 italic">
                "{activeWordData.word.word}"
              </span>
              {activeWordData.word.partOfSpeech && (
                <span className="text-xs text-slate-400 italic px-1.5 py-0.2 rounded bg-slate-800">
                  {activeWordData.word.partOfSpeech}
                </span>
              )}
            </div>

            {activeWordData.word.ipa && (
              <div className="text-sm font-mono text-cyan-400 flex items-center gap-1">
                Phát âm: <span className="font-bold">{activeWordData.word.ipa}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm text-slate-300">
              <span className="text-slate-500 font-semibold">Nghĩa Tiếng Việt:</span>{' '}
              <span className="text-yellow-300 font-medium">{activeWordData.word.meaning}</span>
            </div>

            {activeWordData.word.example && (
              <div className="text-xs mt-1 border-l-2 border-emerald-500/50 pl-3 py-1 flex flex-col gap-1 bg-emerald-500/5 rounded-r-lg">
                <div className="text-slate-300 italic">
                  <span className="text-emerald-400 font-medium not-italic">Ví dụ: </span> 
                  "{activeWordData.word.example}"
                </div>
                {activeWordData.word.exampleMeaning && (
                  <div className="text-slate-400">
                    ➔ {activeWordData.word.exampleMeaning}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Tools Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Reset button instructions */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetTyping}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 text-sm font-semibold transition"
          >
            <RotateCcw className="w-4 h-4 text-yellow-400" />
            Làm lại (Tab)
          </button>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Phím tắt nhanh: Nhấn <b>Tab</b> để khôi phục nhanh bài gõ</span>
        </div>

        {/* Audio click Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`
            flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold select-none transition-all duration-150
            ${soundEnabled 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }
          `}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              Âm gõ phím: Bật
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-500" />
              Âm gõ phím: Tắt
            </>
          )}
        </button>
      </div>
    </div>
  );
}
