import React, { useState } from 'react';
import { Student, GroupId } from '../types';
import { StudentCard } from './StudentCard';
import { Search, UserPlus, Filter, Lightbulb, Users } from 'lucide-react';
import { playClick } from '../utils/audio';

interface ClassroomTabProps {
  students: Student[];
  onOpenScoreModal: (student: Student) => void;
  onQuickAddPoints: (student: Student, points: number) => void;
  onOpenEditModal: (student: Student) => void;
  onOpenAddModal: () => void;
  soundEnabled: boolean;
}

export const ClassroomTab: React.FC<ClassroomTabProps> = ({
  students,
  onOpenScoreModal,
  onQuickAddPoints,
  onOpenEditModal,
  onOpenAddModal,
  soundEnabled
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStudents = students.filter(st => {
    const matchGroup = selectedGroup === 'all' || st.group === selectedGroup;
    const matchSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        st.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGroup && matchSearch;
  });

  const getGroupCount = (groupId: string) => {
    if (groupId === 'all') return students.length;
    return students.filter(s => s.group === groupId).length;
  };

  return (
    <div className="space-y-6">
      
      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Group Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tổ:</span>
          </span>

          {(['all', '1', '2', '3', '4'] as const).map((grp) => {
            const isActive = selectedGroup === grp;
            const label = grp === 'all' ? 'Tất cả' : `Tổ ${grp}`;
            const count = getGroupCount(grp);

            return (
              <button
                key={grp}
                onClick={() => {
                  playClick(soundEnabled);
                  setSelectedGroup(grp);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[11px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Add button */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm học sinh..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <button
            onClick={() => {
              playClick(soundEnabled);
              onOpenAddModal();
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm HS</span>
          </button>
        </div>

      </div>

      {/* QUICK INSTRUCTION GUIDE BANNER */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3.5 text-xs sm:text-sm text-blue-950 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span>
            <b>Hướng dẫn sử dụng:</b> Bấm trực tiếp vào thẻ học sinh để mở bảng cộng/trừ điểm chi tiết, hoặc bấm nút <b>"+2đ"</b> nhanh ở góc phải để ghi nhận phát biểu bài trong 1 giây!
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-xs shrink-0">
          <Users className="w-3.5 h-3.5" />
          <span>Hiển thị: {filteredStudents.length}/{students.length} học sinh</span>
        </div>
      </div>

      {/* STUDENTS GRID */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-2">
          <p className="text-base font-bold">Không tìm thấy học sinh nào phù hợp với bộ lọc.</p>
          <button
            onClick={() => {
              setSelectedGroup('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition cursor-pointer"
          >
            Xóa bộ lọc tìm kiếm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStudents.map((st) => (
            <StudentCard
              key={st.id}
              student={st}
              onOpenScoreModal={onOpenScoreModal}
              onQuickAddPoints={onQuickAddPoints}
              onOpenEditModal={onOpenEditModal}
              soundEnabled={soundEnabled}
            />
          ))}
        </div>
      )}

    </div>
  );
};
