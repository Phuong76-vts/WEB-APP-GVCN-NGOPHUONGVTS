import React, { useState, useEffect } from 'react';
import { Student, ClassSettings, PointLog, AttendanceRecord, AttendanceStatus } from './types';
import { 
  loadStoredStudents, 
  saveStoredStudents, 
  loadStoredSettings, 
  saveStoredSettings, 
  loadStoredLogs, 
  saveStoredLogs, 
  loadStoredAttendance, 
  saveStoredAttendance,
  INITIAL_STUDENTS,
  DEFAULT_SETTINGS
} from './utils/storage';
import { downloadStandaloneHtml } from './utils/htmlExporter';
import { playTingTing, playGentleReminder, playClick } from './utils/audio';

import { Header } from './components/Header';
import { ClassroomTab } from './components/ClassroomTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { AttendanceTab } from './components/AttendanceTab';
import { UtilitiesTab } from './components/UtilitiesTab';
import { ScoreModal } from './components/ScoreModal';
import { SettingsModal } from './components/SettingsModal';
import { StudentDetailModal } from './components/StudentDetailModal';

export default function App() {
  // --- CORE APPLICATION STATES ---
  const [students, setStudents] = useState<Student[]>(() => loadStoredStudents());
  const [settings, setSettings] = useState<ClassSettings>(() => loadStoredSettings());
  const [pointLogs, setPointLogs] = useState<PointLog[]>(() => loadStoredLogs());
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>(() => loadStoredAttendance());

  const [activeTab, setActiveTab] = useState<'classroom' | 'leaderboard' | 'attendance' | 'utilities'>('classroom');

  // --- MODAL STATES ---
  const [scoreModalStudent, setScoreModalStudent] = useState<Student | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [detailModalStudent, setDetailModalStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // --- LOCALSTORAGE PERSISTENCE EFFECTS ---
  useEffect(() => {
    saveStoredStudents(students);
  }, [students]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStoredLogs(pointLogs);
  }, [pointLogs]);

  useEffect(() => {
    saveStoredAttendance(attendance);
  }, [attendance]);

  // --- SOUND TOGGLE ---
  const handleToggleSound = () => {
    const nextState = !settings.soundEnabled;
    const nextSettings = { ...settings, soundEnabled: nextState };
    setSettings(nextSettings);
  };

  // --- SCORING & LOGIC ---
  const handleAddScore = (studentId: string, points: number, reason: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (points > 0) {
      playTingTing(settings.soundEnabled);
    } else {
      playGentleReminder(settings.soundEnabled);
    }

    // Update student
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, points: s.points + points };
      }
      return s;
    }));

    // Add log
    const newLog: PointLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentId: student.id,
      studentName: student.name,
      group: student.group,
      points,
      reason,
      timestamp: Date.now()
    };
    setPointLogs(prev => [newLog, ...prev]);
  };

  const handleQuickAddPoints = (student: Student, points: number) => {
    handleAddScore(student.id, points, 'Phát biểu bài xây dựng tiết học');
  };

  // --- ATTENDANCE ACTIONS ---
  const handleUpdateAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        studentId,
        status,
        updatedAt: Date.now()
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceRecord> = {};
    students.forEach(s => {
      updated[s.id] = {
        studentId: s.id,
        status: 'present',
        updatedAt: Date.now()
      };
    });
    setAttendance(updated);
  };

  // --- STUDENT CRUD ---
  const handleSaveStudentDetail = (data: Partial<Student>) => {
    if (data.id) {
      // Edit existing
      setStudents(prev => prev.map(s => s.id === data.id ? { ...s, ...data } as Student : s));
    } else {
      // Create new
      const newStudent: Student = {
        id: `hs-${Date.now()}`,
        name: data.name || 'Học sinh mới',
        gender: data.gender || 'male',
        group: data.group || '1',
        role: data.role || 'Thành viên',
        points: data.points || 10,
        avatarIndex: students.length + 1
      };
      setStudents(prev => [...prev, newStudent]);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  // --- RESET & BULK IMPORT ---
  const handleResetWeeklyPoints = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại điểm thi đua của tất cả học sinh về 0 để khởi động tuần mới?')) {
      playClick(settings.soundEnabled);
      setStudents(prev => prev.map(s => ({ ...s, points: 0 })));
      alert('Đã đặt lại toàn bộ điểm thi đua về 0 điểm thành công!');
    }
  };

  const handleResetToDefaultSample = () => {
    if (confirm('Khôi phục danh sách mẫu chuẩn 20 học sinh lớp 6D8? Mọi dữ liệu sửa đổi sẽ được đặt lại.')) {
      playClick(settings.soundEnabled);
      setStudents(INITIAL_STUDENTS);
      setSettings(DEFAULT_SETTINGS);
      setAttendance({});
      alert('Đã khôi phục dữ liệu mẫu lớp 6D8 thành công!');
    }
  };

  const handleBulkImport = (names: string[]) => {
    const newStudents: Student[] = names.map((name, idx) => {
      const groupNum = ((idx % 4) + 1).toString() as '1' | '2' | '3' | '4';
      return {
        id: `hs-${Date.now()}-${idx + 1}`,
        name,
        gender: idx % 2 === 0 ? 'male' : 'female',
        group: groupNum,
        role: 'Thành viên',
        points: 10,
        avatarIndex: idx + 1
      };
    });
    setStudents(newStudents);
  };

  const handleRestoreData = (data: { students: Student[]; settings?: ClassSettings; pointLogs?: PointLog[]; attendance?: Record<string, AttendanceRecord> }) => {
    if (data.students) setStudents(data.students);
    if (data.settings) setSettings(data.settings);
    if (data.pointLogs) setPointLogs(data.pointLogs);
    if (data.attendance) setAttendance(data.attendance);
  };

  const handleExportStandaloneHtml = () => {
    downloadStandaloneHtml(students, settings);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-['Be_Vietnam_Pro',sans-serif]">
      
      {/* 1. TOP HEADER */}
      <Header
        settings={settings}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalStudents={students.length}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportStandaloneHtml={handleExportStandaloneHtml}
      />

      {/* 2. MAIN ACTIVE TAB VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        
        {activeTab === 'classroom' && (
          <ClassroomTab
            students={students}
            onOpenScoreModal={(st) => setScoreModalStudent(st)}
            onQuickAddPoints={handleQuickAddPoints}
            onOpenEditModal={(st) => {
              setDetailModalStudent(st);
              setIsDetailModalOpen(true);
            }}
            onOpenAddModal={() => {
              setDetailModalStudent(null);
              setIsDetailModalOpen(true);
            }}
            soundEnabled={settings.soundEnabled}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTab
            students={students}
            settings={settings}
            onOpenScoreModal={(st) => setScoreModalStudent(st)}
            soundEnabled={settings.soundEnabled}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTab
            students={students}
            attendance={attendance}
            onUpdateAttendance={handleUpdateAttendance}
            onMarkAllPresent={handleMarkAllPresent}
            settings={settings}
            soundEnabled={settings.soundEnabled}
          />
        )}

        {activeTab === 'utilities' && (
          <UtilitiesTab
            students={students}
            attendance={attendance}
            pointLogs={pointLogs}
            onAddScore={handleAddScore}
            onClearLogs={() => setPointLogs([])}
            soundEnabled={settings.soundEnabled}
          />
        )}

      </main>

      {/* 3. APPLICATION FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-xs text-slate-500 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <b>Hệ Thống Quản Lý Lớp Học & Thi Đua Số</b> • {settings.className} - {settings.schoolName}
          </div>
          <div>
            GVCN: <b>{settings.teacherName}</b> • Tự động lưu LocalStorage 100% Offline
          </div>
        </div>
      </footer>

      {/* 4. MODALS */}
      <ScoreModal
        student={scoreModalStudent}
        onClose={() => setScoreModalStudent(null)}
        onAddScore={handleAddScore}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetWeeklyPoints={handleResetWeeklyPoints}
        onResetToDefaultSample={handleResetToDefaultSample}
        onBulkImport={handleBulkImport}
        students={students}
        pointLogs={pointLogs}
        attendance={attendance}
        onRestoreData={handleRestoreData}
        onExportStandaloneHtml={handleExportStandaloneHtml}
        soundEnabled={settings.soundEnabled}
      />

      <StudentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailModalStudent(null);
        }}
        student={detailModalStudent}
        onSave={handleSaveStudentDetail}
        onDelete={handleDeleteStudent}
        soundEnabled={settings.soundEnabled}
      />

    </div>
  );
}
