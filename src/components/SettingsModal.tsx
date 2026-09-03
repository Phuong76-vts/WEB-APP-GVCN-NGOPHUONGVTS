import React, { useState } from 'react';
import { ClassSettings, Student, PointLog, AttendanceRecord } from '../types';
import { 
  X, 
  Settings, 
  RotateCcw, 
  RefreshCw, 
  Download, 
  Upload, 
  Users, 
  Check, 
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClassSettings;
  onUpdateSettings: (newSettings: ClassSettings) => void;
  onResetWeeklyPoints: () => void;
  onResetToDefaultSample: () => void;
  onBulkImport: (names: string[]) => void;
  students: Student[];
  pointLogs: PointLog[];
  attendance: Record<string, AttendanceRecord>;
  onRestoreData: (data: { students: Student[]; settings?: ClassSettings; pointLogs?: PointLog[]; attendance?: Record<string, AttendanceRecord> }) => void;
  onExportStandaloneHtml: () => void;
  soundEnabled: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetWeeklyPoints,
  onResetToDefaultSample,
  onBulkImport,
  students,
  pointLogs,
  attendance,
  onRestoreData,
  onExportStandaloneHtml,
  soundEnabled
}) => {
  const [formData, setFormData] = useState<ClassSettings>(settings);
  const [bulkText, setBulkText] = useState('');

  if (!isOpen) return null;

  const handleSaveClassInfo = (e: React.FormEvent) => {
    e.preventDefault();
    playClick(soundEnabled);
    onUpdateSettings(formData);
    alert('Đã lưu thông tin lớp học thành công!');
  };

  const handleBackupJson = () => {
    playClick(soundEnabled);
    const data = {
      version: '1.0',
      settings: formData,
      students,
      pointLogs,
      attendance,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Lop6D8_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestoreJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.students)) {
          onRestoreData(parsed);
          alert('Khôi phục dữ liệu từ file JSON thành công!');
          onClose();
        } else {
          alert('File JSON không đúng cấu trúc hệ thống!');
        }
      } catch (err) {
        alert('Lỗi đọc file JSON!');
      }
    };
    reader.readAsText(file);
  };

  const handleRunBulkImport = () => {
    const lines = bulkText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) {
      alert('Vui lòng dán danh sách tên học sinh (mỗi dòng 1 tên)!');
      return;
    }

    if (confirm(`Bạn có chắc chắn muốn thay thế toàn bộ danh sách lớp bằng ${lines.length} học sinh mới này không?`)) {
      onBulkImport(lines);
      setBulkText('');
      onClose();
      alert(`Đã nạp thành công ${lines.length} học sinh mới vào 4 Tổ!`);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">CÀI ĐẶT & QUẢN LÝ DỮ LIỆU</h3>
              <p className="text-xs text-slate-400">Tùy biến thông tin, sao lưu và đồng bộ lớp học</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scroll flex-1 text-sm text-slate-700">
          
          {/* SECTION 1: THÔNG TIN LỚP HỌC */}
          <form onSubmit={handleSaveClassInfo} className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              1. Thông tin Lớp học & Giáo viên
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên Lớp</label>
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  placeholder="LỚP 6D8"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên Trường</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  placeholder="THCS VÕ THỊ SÁU"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Giáo viên chủ nhiệm (GVCN)</label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  placeholder="Cô Ngô Thị Phương"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Thông Tin Lớp Học</span>
            </button>
          </form>

          <hr className="border-slate-100" />

          {/* SECTION 2: QUẢN LÝ THI ĐUA & RESET */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              2. Quản lý Thi Đua & Điểm Số
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  playClick(soundEnabled);
                  onResetWeeklyPoints();
                }}
                className="p-3 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Đặt Lại Điểm Về 0 (Đầu Tuần)</span>
              </button>

              <button
                onClick={() => {
                  playClick(soundEnabled);
                  onResetToDefaultSample();
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>Nạp Lại Mẫu 20 HS Lớp 6D8</span>
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 3: SAO LƯU & KHÔI PHỤC JSON */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              3. Sao Lưu & Khôi Phục Dữ Liệu
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleBackupJson}
                className="p-3 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Sao Lưu Ra File JSON</span>
              </button>

              <label className="p-3 rounded-2xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Khôi Phục Từ File JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreJsonFile}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={() => {
                playClick(soundEnabled);
                onExportStandaloneHtml();
              }}
              className="w-full p-3 rounded-2xl border border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-900 text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <FileCode className="w-4 h-4 text-emerald-600" />
              <span>Tải Xuống 1 File HTML Duy Nhất (Chạy Độc Lập Mọi Máy Tính)</span>
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 4: NHẬP DANH SÁCH HÀNG LOẠT */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              4. Nhập Danh Sách Học Sinh Hàng Loạt
            </h4>
            <p className="text-xs text-slate-500">
              Dán danh sách học sinh từ Excel hoặc Word (mỗi dòng một học sinh). Hệ thống sẽ tự động phân bổ đều vào 4 Tổ:
            </p>

            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={4}
              placeholder="Nguyễn Văn A&#10;Trần Thị B&#10;Lê Hoàng C&#10;Phạm Thuỳ D..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-mono bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={handleRunBulkImport}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Nạp Danh Sách Học Sinh Này Vào Lớp</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
