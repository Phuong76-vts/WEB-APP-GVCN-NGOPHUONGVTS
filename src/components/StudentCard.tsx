import React from 'react';
import { Student } from '../types';
import { getRankTier } from '../utils/storage';
import { Plus, MoreVertical } from 'lucide-react';
import { playClick } from '../utils/audio';

interface StudentCardProps {
  student: Student;
  onOpenScoreModal: (student: Student) => void;
  onQuickAddPoints: (student: Student, points: number) => void;
  onOpenEditModal: (student: Student) => void;
  soundEnabled: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onOpenScoreModal,
  onQuickAddPoints,
  onOpenEditModal,
  soundEnabled
}) => {
  const tier = getRankTier(student.points);
  const avatarEmoji = student.gender === 'female' ? '👧' : '👦';

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-200/80 transition transform hover:-translate-y-0.5 relative group flex flex-col justify-between">
      
      {/* QUICK +2 BUTTON IN TOP RIGHT */}
      <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickAddPoints(student, 2);
          }}
          title="Cộng nhanh +2 điểm phát biểu bài"
          className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>2đ</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playClick(soundEnabled);
            onOpenEditModal(student);
          }}
          title="Chỉnh sửa thông tin học sinh"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* MAIN CLICKABLE AREA */}
      <div 
        className="cursor-pointer"
        onClick={() => onOpenScoreModal(student)}
      >
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-3xl shrink-0 shadow-inner group-hover:scale-105 transition">
            {avatarEmoji}
          </div>

          <div className="min-w-0 flex-1 pr-12">
            <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-indigo-600 transition">
              {student.name}
            </h3>
            <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {student.role}
            </div>
            <span className="inline-block px-2 py-0.5 mt-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/50">
              Tổ {student.group}
            </span>
          </div>
        </div>

        {/* BOTTOM METRICS */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${tier.badgeBg} ${tier.badgeText} flex items-center gap-1`}>
            <span>{tier.icon}</span>
            <span>{tier.name}</span>
          </span>

          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-400 font-medium">Điểm:</span>
            <span className={`font-black text-base ${student.points >= 25 ? 'text-amber-600' : 'text-indigo-600'}`}>
              {student.points}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
