import React from 'react';
import { Award, Zap, Target, Clock, Trash2, Calendar, FileText } from 'lucide-react';
import { PracticeSessionResult } from '../types';

interface StatsDashboardProps {
  history: PracticeSessionResult[];
  onClearHistory: () => void;
}

export default function StatsDashboard({ history, onClearHistory }: StatsDashboardProps) {
  // Compute aggregated stats
  const totalSessions = history.length;
  
  const peakWpm = totalSessions > 0 
    ? Math.max(...history.map(s => s.wpm)) 
    : 0;

  const averageAccuracy = totalSessions > 0 
    ? Math.round(history.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions) 
    : 0;

  const averageWpm = totalSessions > 0 
    ? Math.round(history.reduce((sum, s) => sum + s.wpm, 0) / totalSessions) 
    : 0;

  const totalSecondsPracticed = history.reduce((sum, s) => sum + s.timeSpent, 0);
  const totalMinutesText = totalSecondsPracticed > 60 
    ? `${Math.floor(totalSecondsPracticed / 60)} phút ${totalSecondsPracticed % 60} giây`
    : `${totalSecondsPracticed} giây`;

  // Draw elegant SVG graph path
  const chartHeight = 120;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  const renderProgressChart = () => {
    if (totalSessions < 2) {
      return (
        <div className="flex flex-col items-center justify-center h-[140px] text-xs text-slate-500 bg-slate-900/30 border border-slate-900 rounded-xl">
          <Zap className="w-5 h-5 text-slate-600 mb-1" />
          <span>Luyện tập từ 2 buổi trở lên để hiển thị biểu đồ tiến trình dạng sóng.</span>
        </div>
      );
    }

    // Limit to latest 10 sessions to keep chart clean
    const recentSessions = history.slice(-10);
    const maxWpm = Math.max(...recentSessions.map(s => s.wpm), 40); // cap floor at 40
    const points: { x: number; y: number; wpm: number; idx: number }[] = [];

    const graphUsableWidth = chartWidth - paddingX * 2;
    const graphUsableHeight = chartHeight - paddingY * 2;

    recentSessions.forEach((session, i) => {
      const x = paddingX + (i / (recentSessions.length - 1)) * graphUsableWidth;
      // invert Y coordinate for SVG
      const y = (chartHeight - paddingY) - (session.wpm / maxWpm) * graphUsableHeight;
      points.push({ x, y, wpm: session.wpm, idx: i + 1 });
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaData = `${pathData} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

    return (
      <div className="w-full bg-slate-950 p-4 border border-slate-900 rounded-xl relative overflow-x-auto">
        <h4 className="text-xs font-semibold text-slate-400 mb-3 text-left">Tiến Trình Tốc Độ Gõ (10 buổi gần nhất)</h4>
        <div className="min-w-[480px]">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
            {/* Grid Lines */}
            <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#1e293b" strokeDasharray="3" />
            <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#1e293b" strokeDasharray="3" />
            <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#334155" />

            {/* Area Fill Gradient */}
            <path d={areaData} fill="url(#statsGradient)" opacity="0.15" />

            {/* Glowing Line */}
            <path d={pathData} fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data Points */}
            {points.map((p, i) => (
              <g key={i} className="group cursor-pointer">
                <circle cx={p.x} cy={p.y} r="4" fill="#030712" stroke="#eab308" strokeWidth="2" />
                <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#eab308" className="text-[10px] font-mono font-bold">
                  {p.wpm}
                </text>
                <text x={p.x} y={chartHeight - 4} textAnchor="middle" fill="#475569" className="text-[8px] font-mono">
                  #P{p.idx}
                </text>
              </g>
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="statsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6" id="stats-dashboard-container">
      {/* Key Score Panels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-yellow-500/10 text-yellow-400">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kỷ lục WPM</div>
            <div className="text-xl font-mono font-bold text-slate-200">{peakWpm} <span className="text-xs text-slate-400 font-sans">wpm</span></div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Độ chính xác TB</div>
            <div className="text-xl font-mono font-bold text-slate-200">{averageAccuracy}%</div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Số bài luyện tập</div>
            <div className="text-xl font-mono font-bold text-slate-200">{totalSessions} <span className="text-xs text-slate-400 font-sans">bài</span></div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng thời gian gõ</div>
            <div className="text-sm font-sans font-medium text-slate-300 truncate max-w-[120px]">{totalMinutesText}</div>
          </div>
        </div>
      </div>

      {/* Stats Progression Chart Visual */}
      {renderProgressChart()}

      {/* History table and clearing tools */}
      <div className="border border-slate-800 bg-slate-900/20 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold text-sm text-slate-200">Lịch Sử Tập Gõ Gần Đây</h3>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xoá lịch sử
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 italic">
            Chưa có buổi luyện nào được lưu. Hãy hoàn thành một bài luyện gõ tiếng Anh để theo dõi thống kê!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300 min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-2">Ngày thực hành</th>
                  <th className="py-2.5 px-2">Xếp hạng Bài Học</th>
                  <th className="py-2.5 px-2">Danh mục</th>
                  <th className="py-2.5 px-2 text-center">Tốc độgõ (WPM)</th>
                  <th className="py-2.5 px-2 text-center">Độ chính xác</th>
                  <th className="py-2.5 px-2 text-center">Thời lượng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {[...history].reverse().slice(0, 15).map((session) => {
                  const localDate = new Date(session.timestamp).toLocaleDateString('vi-VN', {
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  // Tag coloring by category
                  const categoryLabels: Record<string, string> = {
                    home_row: 'Hàng phím cơ sở',
                    all_rows: 'Hàng phím nâng cao',
                    tech: 'Chuyên ngành IT',
                    business: 'Kinh doanh',
                    medical: 'Y tế / Sinh học',
                    sentences: 'Giao tiếp hằng ngày',
                    custom: 'AI hoặc Từ chọn'
                  };

                  return (
                    <tr key={session.id} className="hover:bg-slate-900/30">
                      <td className="py-2.5 px-2 font-mono text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {localDate}
                      </td>
                      <td className="py-2.5 px-2 font-medium text-slate-200">
                        {session.lessonName}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-800">
                          {categoryLabels[session.category] || session.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-yellow-400">
                        {session.wpm}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-emerald-400">
                        {session.accuracy}%
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-500">
                        {session.timeSpent}s
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
