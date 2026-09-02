export type UserRole = 'student' | 'counselor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  department?: string;
  studentId?: string;
}

export type SupportPriorityLevel = 'stable' | 'moderate' | 'urgent';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  department: string;
  year: string;
  studentId: string;
  priorityScore: number; // 0.0 - 10.0
  priorityLevel: SupportPriorityLevel;
  moodTrend: 'improving' | 'stable' | 'declining';
  stressScore: number; // 1-10
  sleepHours: number; // avg hours
  academicEngagement: 'high' | 'normal' | 'reduced' | 'low';
  attendanceRate: number; // percentage e.g. 82
  lastActivity: string;
  counselorAssigned: string;
  primarySignals: string[];
  summaryNote: string;
}

export interface FeatureContribution {
  factor: string;
  percentage: number;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface CheckinData {
  id: string;
  studentId: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'low' | 'difficult';
  stress: number; // 1-10
  sleepHours: number;
  motivation: number; // 1-10
  reflection?: string;
  timestamp: string;
}

export interface FacultyRequest {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  course: string;
  facultyName: string;
  facultyId: string;
  counselorName: string;
  requestedDate: string;
  status: 'pending' | 'completed';
  dueDate: string;
  guidanceNote: string;
}

export interface FacultyObservation {
  id: string;
  requestId: string;
  studentId: string;
  facultyName: string;
  course: string;
  changeDetected: 'none' | 'slight' | 'significant' | 'unsure';
  participation: 'normal' | 'reduced' | 'significantly_reduced' | 'unsure';
  academicEngagement: 'normal' | 'reduced' | 'frequently_disengaged' | 'unsure';
  peerInteraction: 'normal' | 'reduced' | 'noticeably_isolated' | 'unsure';
  contextualNotes: string;
  submittedAt: string;
}

export type EventType =
  | 'system_detection'
  | 'check_in'
  | 'faculty_request'
  | 'faculty_observation'
  | 'counselor_action'
  | 'intervention'
  | 'follow_up';

export interface TimelineEvent {
  id: string;
  studentId: string;
  timestamp: string;
  type: EventType;
  title: string;
  description: string;
  author: string;
  metadata?: Record<string, any>;
}

export interface InterventionRecord {
  id: string;
  studentId: string;
  type: 'counseling' | 'academic_support' | 'faculty_conversation' | 'referral' | 'follow_up' | 'other';
  date: string;
  notes: string;
  followUpDate: string;
  outcome: 'improving' | 'stable' | 'needs_followup' | 'referred' | 'no_response';
  scheduledBy: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mannmitra';
  text: string;
  timestamp: string;
  suggestions?: string[];
  // Fields populated from the real MannMitra API response
  tier?: 'GREEN' | 'YELLOW' | 'RED';
  emotion?: string;
  ragUsed?: boolean;
  isCrisis?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface DepartmentMetric {
  department: string;
  studentCount: number;
  stableCount: number;
  moderateCount: number;
  urgentCount: number;
  averageStress: number;
  attendanceTrend: number; // e.g. -4.2%
}
