export type Gender = 'male' | 'female';

export type GroupId = '1' | '2' | '3' | '4';

export type AttendanceStatus = 'present' | 'late' | 'excused' | 'unexcused';

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  group: GroupId;
  role: string; // Lớp trưởng, Lớp phó học tập, Tổ trưởng, Học sinh...
  points: number;
  avatarIndex?: number;
}

export interface PointLog {
  id: string;
  studentId: string;
  studentName: string;
  group: GroupId;
  points: number; // +2, +5, -2, etc.
  reason: string;
  timestamp: number;
}

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
  updatedAt: number;
}

export interface ClassSettings {
  className: string;
  schoolName: string;
  teacherName: string;
  academicYear: string;
  soundEnabled: boolean;
}

export interface RankTier {
  id: string;
  name: string;
  icon: string;
  minPoints: number;
  maxPoints?: number;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    id: 'sprout',
    name: 'Mầm Non',
    icon: '🌱',
    minPoints: -999,
    maxPoints: 14,
    color: 'emerald',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-700',
    description: 'Khởi đầu tích lũy điểm số'
  },
  {
    id: 'warrior',
    name: 'Chiến Binh',
    icon: '⚡',
    minPoints: 15,
    maxPoints: 24,
    color: 'blue',
    badgeBg: 'bg-blue-100 border-blue-300',
    badgeText: 'text-blue-700',
    description: 'Hăng hái thi đua'
  },
  {
    id: 'elite',
    name: 'Tinh Anh',
    icon: '🌟',
    minPoints: 25,
    maxPoints: 29,
    color: 'amber',
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-700',
    description: 'Xuất sắc tiêu biểu'
  },
  {
    id: 'legend',
    name: 'Huyền Thoại',
    icon: '⭐',
    minPoints: 30,
    color: 'purple',
    badgeBg: 'bg-purple-100 border-purple-300 shadow-sm',
    badgeText: 'text-purple-700 font-bold',
    description: 'Gương mẫu đỉnh cao'
  }
];

export interface ScorePreset {
  title: string;
  points: number;
  icon: string;
  type: 'reward' | 'penalty';
  color: string;
}

export const REWARD_PRESETS: ScorePreset[] = [
  { title: 'Phát biểu bài', points: 2, icon: 'fa-hand', type: 'reward', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  { title: 'Sáng tạo / Toán hay', points: 5, icon: 'fa-lightbulb', type: 'reward', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { title: 'Hợp tác nhóm', points: 3, icon: 'fa-users', type: 'reward', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
  { title: 'Bài tập đầy đủ', points: 2, icon: 'fa-book-open', type: 'reward', color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' },
  { title: 'Điểm 9 - 10', points: 5, icon: 'fa-award', type: 'reward', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
  { title: 'Dự án STEM', points: 10, icon: 'fa-rocket', type: 'reward', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' }
];

export const PENALTY_PRESETS: ScorePreset[] = [
  { title: 'Mất trật tự', points: -2, icon: 'fa-comment-slash', type: 'penalty', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
  { title: 'Đi muộn / Sai trang phục', points: -2, icon: 'fa-user-clock', type: 'penalty', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { title: 'Chưa làm bài tập', points: -3, icon: 'fa-file-circle-xmark', type: 'penalty', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' },
  { title: 'Làm việc riêng', points: -5, icon: 'fa-eye-slash', type: 'penalty', color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' }
];
