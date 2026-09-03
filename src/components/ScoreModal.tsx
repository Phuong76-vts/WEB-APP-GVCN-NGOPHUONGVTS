import React, { useState } from 'react';
import { Student, REWARD_PRESETS, PENALTY_PRESETS } from '../types';
import { X, PlusCircle, MinusCircle, Sparkles, AlertCircle } from 'lucide-react';

interface ScoreModalProps {
  student: Student | null;
  onClose: () => void;
  onAddScore: (studentId: string, points: number, reason: string) => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  student,
  onClose,
  onAddScore
}) => {
  const [customPoints, setCustomPoints] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');

  if (!student) return null;

  const handleApplyPreset = (points: number, title: string) => {
    onAddScore(student.id, points, title);
    onClose();
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const pts = parseInt(customPoints);
    if (isNaN(pts)) return;
    const reason = customReason.trim() || (pts > 0 ? 'Khen thưởng giáo viên' : 'Nhắc nhở nề nếp');
    onAddScore(student.id, pts, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl shadow-inner">
              {student.gender === 'female' ? '👧' : '👦'}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white font-['Nunito',sans-serif]">
                {student.name}
              </h3>
              <p className="text-xs text-indigo-100 flex items-center gap-2 mt-0.5">
                <span className="font-semibold">Tổ {student.group}</span>
                <span>•</span>
                <span>{student.role}</span>
                <span>•</span>
                <span className="font-bold text-amber-300">{student.points} điểm</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-5 overflow-y-auto custom-scroll flex-1">
          
          {/* SECTION 1: KHEN THƯỞNG */}
          <div>
            <div className="text-xs font-black uppercase text-emerald-700 tracking-wider mb-2.5 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>KHEN THƯỞNG (ĐIỂM CỘNG)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {REWARD_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset.points, preset.title)}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between text-left cursor-pointer ${preset.color}`}
                >
                  <span className="truncate pr-1 flex items-center gap-1.5">
                    <i className={`fa-solid ${preset.icon}`}></i>
                    <span>{preset.title}</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-black shrink-0">
                    +{preset.points}đ
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: NHẮC NHỞ */}
          <div>
            <div className="text-xs font-black uppercase text-rose-700 tracking-wider mb-2.5 flex items-center gap-1.5">
              <MinusCircle className="w-4 h-4 text-rose-600" />
              <span>NHẮC NHỞ (ĐIỂM TRỪ)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PENALTY_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset.points, preset.title)}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between text-left cursor-pointer ${preset.color}`}
                >
                  <span className="truncate pr-1 flex items-center gap-1.5">
                    <i className={`fa-solid ${preset.icon}`}></i>
                    <span>{preset.title}</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-black shrink-0">
                    {preset.points}đ
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: TÙY CHỈNH */}
          <form onSubmit={handleApplyCustom} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Nhập điểm và lý do tùy chỉnh tự do:</span>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={customPoints}
                onChange={(e) => setCustomPoints(e.target.value)}
                placeholder="+/- Điểm"
                className="w-24 px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nhập lý do cụ thể (vd: Giúp đỡ bạn bè)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!customPoints}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
              >
                Ghi điểm
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
