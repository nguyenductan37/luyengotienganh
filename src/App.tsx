import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  BookOpen, 
  Sparkles, 
  History, 
  ListRestart, 
  CheckCircle,
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Lesson, LessonCategory, LessonLevel, PracticeSessionResult } from './types';
import { ALL_PREINSTALLED_LESSONS } from './lessonsData';
import VirtualKeyboard from './components/VirtualKeyboard';
import TypingArea from './components/TypingArea';
import StatsDashboard from './components/StatsDashboard';
import AiLessonCreator from './components/AiLessonCreator';

export default function App() {
  const [lessons, setLessons] = useState<Lesson[]>(ALL_PREINSTALLED_LESSONS);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(ALL_PREINSTALLED_LESSONS[0]);
  const [history, setHistory] = useState<PracticeSessionResult[]>([]);
  
  // Navigation & filter options
  const [activeTab, setActiveTab] = useState<'practice' | 'history'>('practice');
  const [filterCategory, setFilterCategory] = useState<LessonCategory | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<LessonLevel | 'all'>('all');

  // Key sync bridge for Virtual Keyboard
  const [activeChar, setActiveChar] = useState('');
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});

  // Session complete modal tracking
  const [lastSessionResult, setLastSessionResult] = useState<{
    wpm: number;
    accuracy: number;
    errors: number;
    timeSpent: number;
    feedbackText: string;
    lessonName: string;
  } | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('typing_practice_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (err) {
        console.error('Không thể khôi phục dữ liệu thống kê cũ:', err);
      }
    }
  }, []);

  // Sync keyboard handlers to reset keypress states when focus fluctuates
  useEffect(() => {
    const handleWindowBlur = () => {
      setPressedKeys({});
    };
    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, []);

  // Update pressed keys list from our TypingArea callbacks
  const handleKeyPressed = (key: string, isDown: boolean) => {
    setPressedKeys(prev => ({
      ...prev,
      [key]: isDown
    }));
    // Auto-clear success banner when user starts typing the next lesson
    if (isDown && lastSessionResult) {
      setLastSessionResult(null);
    }
  };

  // Filter lessons based on active layout controls
  const filteredLessons = lessons.filter(lesson => {
    const catMatch = filterCategory === 'all' || lesson.category === filterCategory;
    const levelMatch = filterLevel === 'all' || lesson.level === filterLevel;
    return catMatch && levelMatch;
  });

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setLastSessionResult(null); // clear old modal overlays
  };

  // Callback triggers when typing lesson is successfully finalized
  const handlePracticeComplete = (wpm: number, accuracy: number, errors: number, timeSpent: number) => {
    // Generate feedback text based on performance
    let feedback = '';
    if (wpm <= 22) {
      feedback = 'Tập trung phối hợp các ngón chính xác trước rồi tăng tốc sau nhé! Luyện hàng phím cơ bản sẽ cải thiện phản xạ đáng kể.';
    } else if (wpm <= 40) {
      feedback = 'Khá tốt! Bạn đang chuyển động ngón tay đều đặn. Hãy tiếp tục luyện tập để quen cơ tay và tốc độ gõ.';
    } else if (wpm <= 65) {
      feedback = 'Xuất sắc! Bạn đã đạt tốc độ gõ của một người đi làm chuyên nghiệp. Gõ trôi chảy, nhịp nhàng!';
    } else {
      feedback = 'Thần sầu! Tốc độ siêu đẳng sánh ngang các lập trình viên kỳ cựu. Bạn vừa gõ chuyên nghiệp vừa ghi nhớ từ vựng tiếng Anh xuất sắc!';
    }

    // Prepare outcome records
    const newSession: PracticeSessionResult = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      lessonId: selectedLesson.id,
      lessonName: selectedLesson.name,
      category: selectedLesson.category,
      wpm,
      accuracy,
      errors,
      timeSpent,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...history, newSession];
    setHistory(updatedHistory);
    localStorage.setItem('typing_practice_history', JSON.stringify(updatedHistory));

    // Find the next lesson in the filtered list to switch automatically
    const currentList = filteredLessons.length > 0 ? filteredLessons : lessons;
    const currentIndex = currentList.findIndex(l => l.id === selectedLesson.id);
    let nextLesson = selectedLesson;
    let nextLessonName = '';
    
    if (currentIndex !== -1 && currentIndex < currentList.length - 1) {
      nextLesson = currentList[currentIndex + 1];
      nextLessonName = nextLesson.name;
    } else if (currentList.length > 0) {
      nextLesson = currentList[0]; // loop back
      nextLessonName = nextLesson.name + ' (Vòng lại)';
    }

    setLastSessionResult({
      wpm,
      accuracy,
      errors,
      timeSpent,
      feedbackText: feedback,
      lessonName: selectedLesson.name
    });

    // Auto-select the next lesson instantly so the user can just key in next sentence immediately!
    setSelectedLesson(nextLesson);
  };

  // Add dynamically compiled AI or Pasted custom lesson
  const handleCustomLessonCreated = (newLesson: Lesson) => {
    setLessons(prev => [newLesson, ...prev]);
    setSelectedLesson(newLesson);
    setLastSessionResult(null);
    setActiveTab('practice');
  };

  const clearHistory = () => {
    if (confirm('Bạn có chắc chắn muốn xoá toàn bộ lịch sử luyện gõ phím không? Dữ liệu này không thể khôi phục.')) {
      setHistory([]);
      localStorage.removeItem('typing_practice_history');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans">
      {/* 1. Header Banner */}
      <header className="border-b border-slate-900 bg-slate-950/80 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400 text-slate-950 rounded-xl shadow-lg shadow-yellow-500/10">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Practice 10-Finger Typing & English
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Luyện gõ 10 ngón & Học song ngữ Anh-Việt tích hợp</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('practice')}
              className={`
                flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${activeTab === 'practice' 
                  ? 'bg-yellow-400 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Luyện Gõ
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`
                flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${activeTab === 'history' 
                  ? 'bg-yellow-400 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <History className="w-3.5 h-3.5" />
              Lịch Sử & Thống Kê
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main App Canvas */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col gap-6">
        {activeTab === 'practice' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT Column: Lessons catalog (span 4/12 on large screens) */}
            <div className="lg:col-span-4 flex flex-col gap-5 bg-slate-950 border border-slate-900 rounded-2xl p-5 text-left h-full max-h-[85vh] overflow-y-auto">
              <div className="border-b border-slate-900 pb-3">
                <h2 className="font-bold text-slate-100 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <ListRestart className="w-4 h-4 text-yellow-400" />
                  Danh Sách Bài Học
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">Chọn cấp độ phù hợp để bắt đầu hành trình cải thiện</p>
              </div>

              {/* Cat & Level Filters */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Phân loại theo hàng:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as LessonCategory | 'all')}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-yellow-400/60"
                  >
                    <option value="all">Tất cả bài chuẩn hóa</option>
                    <option value="home_row">Hàng phím cơ sở (Basic)</option>
                    <option value="all_rows">Hàng phím liên kết</option>
                    <option value="tech">Chuyên ngành CNTT (Tech)</option>
                    <option value="business">Kinh doanh & Tài chính</option>
                    <option value="medical">Y tế & Sinh học</option>
                    <option value="sentences">Câu văn giao tiếp dài</option>
                    <option value="custom">Bài tự biên soạn / AI</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Trình độ:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['all', 'basic', 'intermediate', 'advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFilterLevel(lvl as LessonLevel | 'all')}
                        className={`
                          py-1 rounded text-[10px] font-bold capitalize select-none cursor-pointer transition
                          ${filterLevel === lvl 
                            ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' 
                            : 'bg-slate-900 text-slate-400 border border-slate-800/60 hover:text-slate-200'
                          }
                        `}
                      >
                        {lvl === 'all' ? 'Tất cả' : lvl === 'basic' ? 'Cơ bản' : lvl === 'intermediate' ? 'Kha khá' : 'Khó'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lesson Cards List */}
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[420px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {filteredLessons.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 italic">
                    Không tìm thấy bài học nào phù hợp bộ lọc. Hãy bấm chọn "Tất cả" để kích hoạt lại!
                  </div>
                ) : (
                  filteredLessons.map((lesson) => {
                    const isSelected = selectedLesson.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`
                          w-full p-3 rounded-xl border text-left transition-all duration-150 relative overflow-hidden group
                          ${isSelected 
                            ? 'bg-slate-900 border-yellow-400/60 shadow-lg shadow-yellow-500/5 ring-1 ring-yellow-400/20' 
                            : 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                          }
                        `}
                      >
                        {/* Highlight indicators */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                        )}

                        <div className="flex justify-between items-start gap-2 mb-1 pl-1">
                          <span className="font-bold text-slate-200 text-xs truncate max-w-[190px]">
                            {lesson.name}
                          </span>
                          <span className={`
                            px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase shrink-0 border
                            ${lesson.level === 'basic' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : lesson.level === 'intermediate'
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }
                          `}>
                            {lesson.level === 'basic' ? 'Basic' : lesson.level === 'intermediate' ? 'Inter' : 'Adv'}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 line-clamp-2 pl-1 leading-relaxed">
                          {lesson.description}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT Column: Active practice playground area */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Celebrate Success Block Popup banner placement */}
              {lastSessionResult && (
                <div className="w-full bg-slate-950 border border-emerald-500/30 p-5 rounded-2xl text-left shadow-lg shadow-emerald-500/5 relative overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                  {/* Decorative corner indicator */}
                  <div className="absolute right-0 top-0 p-8 opacity-5 font-mono text-7xl font-bold text-emerald-500 pointer-events-none">
                    100%
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full shrink-0">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-1.5">
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                        Bài gõ hoàn tất: <span className="text-yellow-400 italic">"{lastSessionResult.lessonName}"</span>
                      </h3>
                      
                      {/* Metric rows */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-xl max-w-xl my-1 border border-slate-800/40">
                        <div>
                          <div className="text-xs text-slate-500">Tốc độ</div>
                          <div className="text-lg font-mono font-bold text-yellow-400">
                            {lastSessionResult.wpm} <span className="text-[10px] font-sans text-slate-400">WPM</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Độ chính xác</div>
                          <div className="text-lg font-mono font-bold text-emerald-400">
                            {lastSessionResult.accuracy}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Lỗi phím</div>
                          <div className="text-lg font-mono font-bold text-rose-500">
                            {lastSessionResult.errors}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Thời gian</div>
                          <div className="text-lg font-mono font-bold text-sky-400">
                            {lastSessionResult.timeSpent}s
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-sans pr-16">
                        {lastSessionResult.feedbackText}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                        <span className="text-yellow-400 font-bold flex items-center gap-1 bg-yellow-400/10 px-2.5 py-1 rounded-lg border border-yellow-400/20">
                          🎯 Đã tự động chuyển sang bài tiếp theo!
                        </span>
                        <button
                          onClick={() => setLastSessionResult(null)}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition"
                        >
                          Đóng thống kê
                        </button>
                        <span className="text-slate-500 italic hidden sm:inline">(Hoặc gõ bất kỳ phím nào để bắt đầu tự động)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Lesson details */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 text-left flex flex-col gap-3">
                <div className="flex justify-between items-center gap-3 border-b border-slate-900 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-yellow-400" />
                      {selectedLesson.name}
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      {selectedLesson.description}
                    </p>
                  </div>

                  <span className="shrink-0 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                    Mức độ: {selectedLesson.level}
                  </span>
                </div>

                {/* Core typing training container layout */}
                <TypingArea
                  lesson={selectedLesson}
                  onComplete={handlePracticeComplete}
                  onActiveCharChange={setActiveChar}
                  onKeyPressed={handleKeyPressed}
                />
              </div>

              {/* Hands posturing keyboard guidelines */}
              <VirtualKeyboard
                activeChar={activeChar}
                pressedKeys={pressedKeys}
              />

              {/* AI generator engine and Paster tab section */}
              <AiLessonCreator
                onLessonCreated={handleCustomLessonCreated}
              />
            </div>
          </div>
        ) : (
          /* History and statistics progress reports view */
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 text-left">
            <StatsDashboard
              history={history}
              onClearHistory={clearHistory}
            />
          </div>
        )}
      </main>

      {/* 3. Footer credits */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 10-Finger Touch Typing English Tutor. Đồng bộ hóa luyện ngõ bàn phím cơ và từ vựng.</p>
          <div className="flex gap-4">
            <span className="text-[11px] text-slate-600">Học song ngữ hiệu quả gấp 2 lần</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
