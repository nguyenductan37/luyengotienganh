import React, { useState } from 'react';
import { Sparkles, FileInput, Loader2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { Lesson, WordItem } from '../types';

interface AiLessonCreatorProps {
  onLessonCreated: (customLesson: Lesson) => void;
}

export default function AiLessonCreator({ onLessonCreated }: AiLessonCreatorProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'paste'>('ai');
  const [aiPrompt, setAiPrompt] = useState('Chủ đề Công nghệ Vũ Trụ (Space Science)');
  const [pastedTitle, setPastedTitle] = useState('Đoạn văn tự chọn');
  const [pastedText, setPastedText] = useState(
    'Touch typing is a style of typing where you do not look at the keys. It relies entirely on muscle memory.'
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch AI Generated Lessons via Express proxy endpoint
  const handleAiGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Không thể khởi tạo bài viết từ AI. Vui lòng kiểm tra API Key hoặc thử lại sau.');
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error('Nội dung trả về không tồn tại đúng định dạng bài học.');
      }

      // Re-map generated items to a proper Lesson object
      const newLesson: Lesson = {
        id: `ai_${Math.random().toString(36).substring(2, 9)}`,
        name: `AI: ${aiPrompt.trim()}`,
        category: 'custom',
        level: 'advanced',
        description: `Bài học tuỳ chỉnh tạo tự động bởi AI về chủ đề ${aiPrompt}.`,
        items: data.items,
        displayText: data.displayText || data.items.map((it: WordItem) => it.word).join(' '),
      };

      onLessonCreated(newLesson);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi hệ thống bất ngờ.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Parse manually pasted paragraphs split by words
  const handlePastedSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    // Split words nicely
    const cleanText = pastedText.trim().replace(/\s\s+/g, ' ');
    const rawWords = cleanText.split(/[\s]+/);
    
    // Group them into individual elements
    const parsedItems: WordItem[] = rawWords.map((wordStr, index) => {
      // strip punctuation from translation labels to search
      const wordKey = wordStr.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").toLowerCase();
      return {
        id: `paste_${index}_${Math.random().toString(36).substring(2, 5)}`,
        word: wordStr,
        meaning: `Từ số ${index + 1} của đoạn văn`,
        ipa: '/paste/'
      };
    });

    const pastedLesson: Lesson = {
      id: `pasted_${Math.random().toString(36).substring(2, 9)}`,
      name: pastedTitle.trim() || 'Văn bản tự soạn',
      category: 'custom',
      level: 'intermediate',
      description: 'Luyện gõ bằng văn bản học viên tự dán vào hệ thống.',
      items: parsedItems,
      displayText: cleanText,
    };

    onLessonCreated(pastedLesson);
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6" id="ai-lesson-creator-panel">
      {/* Tab select headers */}
      <div className="flex gap-2 border-b border-slate-800 pb-4 mb-5">
        <button
          onClick={() => { setActiveTab('ai'); setErrorMessage(''); }}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150
            ${activeTab === 'ai' 
              ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-500/10' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }
          `}
        >
          <Sparkles className="w-4 h-4" />
          Tự Động Tạo Bằng AI
        </button>

        <button
          onClick={() => { setActiveTab('paste'); setErrorMessage(''); }}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150
            ${activeTab === 'paste' 
              ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-500/10' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }
          `}
        >
          <FileInput className="w-4 h-4" />
          Tự Dán Văn Bản Tập Gõ
        </button>
      </div>

      {/* Tab 1: AI Prompt Input */}
      {activeTab === 'ai' && (
        <form onSubmit={handleAiGeneration} className="flex flex-col gap-4 text-left">
          <p className="text-xs text-slate-400 leading-relaxed">
            Nhập bất kỳ chủ đề tiếng Anh nào bạn đang muốn học (ví dụ: <i>"Giao tiếp khi phỏng vấn xin việc"</i>, <i>"Chủ đề ẩm thực"</i>, <i>"Từ vựng IELTS môi trường"</i>, <i>"Thành ngữ về tình yêu"</i>). Trí tuệ nhân tạo Gemini sẽ ngay lập tức thiết kế một loạt từ vựng có sẵn phiên âm, nghĩa tiếng Việt, câu ví dụ để giúp bạn vừa gõ 10 ngón vừa ghi nhớ kiến thức!
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Nhập chủ đề tiếng Anh học tập..."
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-yellow-400/80 transition"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !aiPrompt.trim()}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang biên tập...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Biên soạn bài học (AI)
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center mt-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Chủ đề gợi ý:</span>
            {['IELTS Environment', 'Web Development', 'Business Negotiation', 'E-Commerce Vocabulary'].map((suggestedPrompt) => (
              <button
                key={suggestedPrompt}
                type="button"
                onClick={() => setAiPrompt(suggestedPrompt)}
                className="px-2 py-0.5 rounded bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-[11px] font-medium border border-slate-800/60"
              >
                {suggestedPrompt}
              </button>
            ))}
          </div>
        </form>
      )}

      {/* Tab 2: Custom Text Area Pasting */}
      {activeTab === 'paste' && (
        <form onSubmit={handlePastedSubmission} className="flex flex-col gap-4 text-left">
          <p className="text-xs text-slate-400 leading-relaxed">
            Bạn có thể dán một đoạn văn tiếng Anh bất kỳ từ một cuốn sách, email hoặc bài viết tin tức vào đây. Đoạn văn sẽ được tự động phân tách thành các phím gõ hệt như các bài tập chuẩn của hệ thống để thỏa sức tập dượt tốc độ.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-400">Tiêu đề bài viết:</label>
              <input
                type="text"
                value={pastedTitle}
                onChange={(e) => setPastedTitle(e.target.value)}
                placeholder="Ví dụ: Đoạn văn luyện ngón tay..."
                className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-yellow-400/80 transition"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-400">Nội dung đoạn văn tiếng Anh:</label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Nhập nội dung bài tập gõ mong muốn vào đây..."
                rows={4}
                className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-yellow-400/80 transition font-mono leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!pastedText.trim()}
              className="mt-1 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 self-start"
            >
              <FileInput className="w-4 h-4" />
              Nạp dữ liệu gõ phím
            </button>
          </div>
        </form>
      )}

      {/* Error Displays */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-left text-rose-400 text-xs text-normal leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
