import { Student, PointLog, AttendanceRecord, ClassSettings, RANK_TIERS, RankTier } from '../types';

export const DEFAULT_SETTINGS: ClassSettings = {
  className: 'LỚP 6D8',
  schoolName: 'THCS VÕ THỊ SÁU',
  teacherName: 'Cô Ngô Thị Phương',
  academicYear: '2025 - 2026',
  soundEnabled: true
};

export const INITIAL_STUDENTS: Student[] = [
  // Tổ 1
  { id: 'hs-01', name: 'Nguyễn Minh Quân', gender: 'male', group: '1', role: 'Lớp trưởng', points: 32, avatarIndex: 1 },
  { id: 'hs-02', name: 'Trần Thị Ngọc Mai', gender: 'female', group: '1', role: 'Lớp phó học tập', points: 28, avatarIndex: 2 },
  { id: 'hs-03', name: 'Lê Hoàng Long', gender: 'male', group: '1', role: 'Tổ trưởng Tổ 1', points: 26, avatarIndex: 3 },
  { id: 'hs-04', name: 'Phạm Thuỳ Linh', gender: 'female', group: '1', role: 'Thành viên', points: 22, avatarIndex: 4 },
  { id: 'hs-05', name: 'Đỗ Đức Anh', gender: 'male', group: '1', role: 'Thành viên', points: 18, avatarIndex: 5 },

  // Tổ 2
  { id: 'hs-06', name: 'Hoàng Bảo Châu', gender: 'female', group: '2', role: 'Lớp phó lao động', points: 30, avatarIndex: 6 },
  { id: 'hs-07', name: 'Vũ Quốc Huy', gender: 'male', group: '2', role: 'Tổ trưởng Tổ 2', points: 27, avatarIndex: 7 },
  { id: 'hs-08', name: 'Bùi Kim Ngân', gender: 'female', group: '2', role: 'Thành viên', points: 24, avatarIndex: 8 },
  { id: 'hs-09', name: 'Phan Minh Khang', gender: 'male', group: '2', role: 'Thành viên', points: 19, avatarIndex: 9 },
  { id: 'hs-10', name: 'Đặng Phương Thảo', gender: 'female', group: '2', role: 'Thành viên', points: 21, avatarIndex: 10 },

  // Tổ 3
  { id: 'hs-11', name: 'Ngô Gia Hưng', gender: 'male', group: '3', role: 'Lớp phó văn thể', points: 31, avatarIndex: 11 },
  { id: 'hs-12', name: 'Dương Khánh Linh', gender: 'female', group: '3', role: 'Tổ trưởng Tổ 3', points: 25, avatarIndex: 12 },
  { id: 'hs-13', name: 'Trịnh Tuấn Kiệt', gender: 'male', group: '3', role: 'Thành viên', points: 20, avatarIndex: 13 },
  { id: 'hs-14', name: 'Lương Mỹ Duyên', gender: 'female', group: '3', role: 'Thành viên', points: 16, avatarIndex: 14 },
  { id: 'hs-15', name: 'Tạ Hoàng Nam', gender: 'male', group: '3', role: 'Thành viên', points: 14, avatarIndex: 15 },

  // Tổ 4
  { id: 'hs-16', name: 'Võ Minh Châu', gender: 'female', group: '4', role: 'Tổ trưởng Tổ 4', points: 27, avatarIndex: 16 },
  { id: 'hs-17', name: 'Lý Thành Đạt', gender: 'male', group: '4', role: 'Thành viên', points: 23, avatarIndex: 17 },
  { id: 'hs-18', name: 'Đoàn Ánh Dương', gender: 'female', group: '4', role: 'Thành viên', points: 25, avatarIndex: 18 },
  { id: 'hs-19', name: 'Chu Đình Trọng', gender: 'male', group: '4', role: 'Thành viên', points: 17, avatarIndex: 19 },
  { id: 'hs-20', name: 'Hồ Như Quỳnh', gender: 'female', group: '4', role: 'Thành viên', points: 12, avatarIndex: 20 }
];

export const INITIAL_LOGS: PointLog[] = [
  { id: 'log-1', studentId: 'hs-01', studentName: 'Nguyễn Minh Quân', group: '1', points: 2, reason: 'Phát biểu bài xây dựng tiết học', timestamp: Date.now() - 3600000 * 2 },
  { id: 'log-2', studentId: 'hs-06', studentName: 'Hoàng Bảo Châu', group: '2', points: 5, reason: 'Sáng tạo / Giải toán hay', timestamp: Date.now() - 3600000 * 1.5 },
  { id: 'log-3', studentId: 'hs-11', studentName: 'Ngô Gia Hưng', group: '3', points: 10, reason: 'Dự án STEM mô hình năng lượng', timestamp: Date.now() - 3600000 }
];

const STORAGE_KEYS = {
  STUDENTS: 'classroom_students_v1',
  SETTINGS: 'classroom_settings_v1',
  LOGS: 'classroom_logs_v1',
  ATTENDANCE: 'classroom_attendance_v1'
};

export function loadStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) return INITIAL_STUDENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
}

export function loadStoredSettings(): ClassSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: ClassSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadStoredLogs(): PointLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) return INITIAL_LOGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_LOGS;
  } catch {
    return INITIAL_LOGS;
  }
}

export function saveStoredLogs(logs: PointLog[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs', e);
  }
}

export function loadStoredAttendance(): Record<string, AttendanceRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function saveStoredAttendance(attendance: Record<string, AttendanceRecord>) {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  } catch (e) {
    console.error('Failed to save attendance', e);
  }
}

export function getRankTier(points: number): RankTier {
  if (points >= 30) return RANK_TIERS[3]; // Huyền Thoại
  if (points >= 25) return RANK_TIERS[2]; // Tinh Anh
  if (points >= 15) return RANK_TIERS[1]; // Chiến Binh
  return RANK_TIERS[0]; // Mầm Non
}

export function exportToCSV(students: Student[], settings: ClassSettings) {
  const sorted = [...students].sort((a, b) => b.points - a.points);
  
  let csvContent = '\uFEFF'; // UTF-8 BOM for Excel
  csvContent += `BẢNG VÀNG THI ĐUA ${settings.className} - ${settings.schoolName}\n`;
  csvContent += `Giáo viên chủ nhiệm: ${settings.teacherName} | Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}\n\n`;
  csvContent += 'Hạng,Họ và Tên,Tổ,Chức vụ,Giới tính,Tổng điểm,Danh hiệu\n';

  sorted.forEach((st, idx) => {
    const tier = getRankTier(st.points);
    const genderText = st.gender === 'male' ? 'Nam' : 'Nữ';
    csvContent += `${idx + 1},"${st.name}","Tổ ${st.group}","${st.role}","${genderText}",${st.points},"${tier.name} ${tier.icon}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Bang_Vang_Thi_Dua_${settings.className.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAttendanceToCSV(students: Student[], attendance: Record<string, AttendanceRecord>, settings: ClassSettings) {
  let csvContent = '\uFEFF';
  csvContent += `BẢNG ĐIỂM DANH ${settings.className} - ${settings.schoolName}\n`;
  csvContent += `Ngày: ${new Date().toLocaleDateString('vi-VN')} | GVCN: ${settings.teacherName}\n\n`;
  csvContent += 'STT,Họ và Tên,Tổ,Chức vụ,Trạng thái điểm danh\n';

  const statusMap: Record<string, string> = {
    present: 'Có mặt',
    late: 'Đi muộn',
    excused: 'Có phép',
    unexcused: 'Không phép'
  };

  students.forEach((st, idx) => {
    const status = attendance[st.id]?.status || 'present';
    csvContent += `${idx + 1},"${st.name}","Tổ ${st.group}","${st.role}","${statusMap[status]}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Diem_Danh_${settings.className.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
