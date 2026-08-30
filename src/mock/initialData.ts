import type { Student, FacultyRequest, FacultyObservation, TimelineEvent, DepartmentMetric, FeatureContribution, InterventionRecord, UserProfile } from '../types';

export const INITIAL_MOCK_USERS: UserProfile[] = [
  // 2 Student Logins
  {
    id: 'user-std-1',
    name: 'Aarohi Verma',
    email: 'aarohi@campus.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: 'Student (CSE 3rd Year)',
    department: 'Computer Science & Engineering',
    studentId: 'CS2023-042'
  },
  {
    id: 'user-std-2',
    name: 'Rohan Mehta',
    email: 'rohan@campus.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    title: 'Student (ME 2nd Year)',
    department: 'Mechanical Engineering',
    studentId: 'ME2024-118'
  },

  // 2 Counselor Logins
  {
    id: 'user-cns-1',
    name: 'Dr. Ananya Sharma',
    email: 'ananya@campus.edu',
    role: 'counselor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    title: 'Chief Campus Counselor & Clinical Lead',
    department: 'Counseling & Mental Health Services'
  },
  {
    id: 'user-cns-2',
    name: 'Dr. Vikram Adhikari',
    email: 'vikram@campus.edu',
    role: 'counselor',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    title: 'Senior Wellbeing & Resilience Specialist',
    department: 'Student Care Center'
  },

  // 2 Admin Logins
  {
    id: 'user-adm-1',
    name: 'Dean Mehta',
    email: 'dean.mehta@campus.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    title: 'Dean of Student Wellbeing & Affairs',
    department: 'University Administration'
  },
  {
    id: 'user-adm-2',
    name: 'Dr. Priya Singh',
    email: 'priya.singh@campus.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    title: 'Campus Director of Institutional Analytics',
    department: 'Governance & Operations'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Aarohi Verma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    department: 'Computer Science & Engineering',
    year: '3rd Year (B.Tech)',
    studentId: 'CS2023-042',
    priorityScore: 8.4,
    priorityLevel: 'urgent',
    moodTrend: 'declining',
    stressScore: 8,
    sleepHours: 4.5,
    academicEngagement: 'reduced',
    attendanceRate: 71,
    lastActivity: '12 mins ago',
    counselorAssigned: 'Dr. Ananya Sharma',
    primarySignals: ['Attendance decline (-19%)', 'Sleep duration < 5h', 'Academic engagement drop', 'Negative check-in sentiment'],
    summaryNote: 'Consecutive low mood check-ins over 14 days with marked decline in lab attendance and late assignment submissions.'
  },
  {
    id: 'std-2',
    name: 'Rohan Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    department: 'Mechanical Engineering',
    year: '2nd Year (B.Tech)',
    studentId: 'ME2024-118',
    priorityScore: 6.8,
    priorityLevel: 'moderate',
    moodTrend: 'declining',
    stressScore: 7,
    sleepHours: 5.5,
    academicEngagement: 'reduced',
    attendanceRate: 79,
    lastActivity: '2 hours ago',
    counselorAssigned: 'Dr. Ananya Sharma',
    primarySignals: ['Midterm exam stress', 'Classroom participation drop', 'Moderate sleep deficit'],
    summaryNote: 'Showing signs of elevated academic stress leading up to semester assessments.'
  },
  {
    id: 'std-3',
    name: 'Priya Sundaram',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    department: 'Business Management',
    year: '1st Year (MBA)',
    studentId: 'MBA2025-009',
    priorityScore: 3.2,
    priorityLevel: 'stable',
    moodTrend: 'improving',
    stressScore: 4,
    sleepHours: 7.2,
    academicEngagement: 'high',
    attendanceRate: 94,
    lastActivity: 'Yesterday',
    counselorAssigned: 'Dr. Rajesh Gupta',
    primarySignals: ['Consistent check-ins', 'High peer engagement', 'Healthy sleep routine'],
    summaryNote: 'Well-adjusted with active participation in campus activities.'
  },
  {
    id: 'std-4',
    name: 'Kabir Das',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    department: 'Electronics & Communication',
    year: '4th Year (B.Tech)',
    studentId: 'EC2022-089',
    priorityScore: 7.6,
    priorityLevel: 'urgent',
    moodTrend: 'declining',
    stressScore: 9,
    sleepHours: 4.0,
    academicEngagement: 'low',
    attendanceRate: 64,
    lastActivity: '3 hours ago',
    counselorAssigned: 'Dr. Ananya Sharma',
    primarySignals: ['Placement season anxiety', 'Severe sleep restriction', 'Project deadline backlog'],
    summaryNote: 'High placement stress combined with project submission pressures.'
  },
  {
    id: 'std-5',
    name: 'Sneha Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    department: 'Biotechnology',
    year: '3rd Year (B.Sc)',
    studentId: 'BT2023-014',
    priorityScore: 5.4,
    priorityLevel: 'moderate',
    moodTrend: 'stable',
    stressScore: 6,
    sleepHours: 6.0,
    academicEngagement: 'normal',
    attendanceRate: 85,
    lastActivity: '5 hours ago',
    counselorAssigned: 'Dr. Rajesh Gupta',
    primarySignals: ['Periodic mood dips', 'Exam timeline anxiety'],
    summaryNote: 'Managing workload well but requested wellness relaxation resources.'
  },
  {
    id: 'std-6',
    name: 'Vikramaditya Nair',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    department: 'Civil Engineering',
    year: '2nd Year (B.Tech)',
    studentId: 'CE2024-055',
    priorityScore: 2.1,
    priorityLevel: 'stable',
    moodTrend: 'improving',
    stressScore: 3,
    sleepHours: 7.8,
    academicEngagement: 'high',
    attendanceRate: 96,
    lastActivity: '1 day ago',
    counselorAssigned: 'Dr. Rajesh Gupta',
    primarySignals: ['Positive mood trajectory', 'Excellent attendance'],
    summaryNote: 'Responding very well after peer mentoring support session.'
  }
];

export const INITIAL_FEATURE_CONTRIBUTIONS: Record<string, FeatureContribution[]> = {
  'std-1': [
    { factor: 'Attendance Change', percentage: 38, description: 'Decline from 90% to 71% in CS301 & CS303 over 3 weeks', impact: 'high' },
    { factor: 'Mood Signal Trend', percentage: 28, description: '10 consecutive check-ins rated "Low" or "Difficult"', impact: 'high' },
    { factor: 'Sleep Deficit', percentage: 20, description: 'Average nightly sleep dropped to 4.5 hours', impact: 'medium' },
    { factor: 'Academic Disengagement', percentage: 14, description: '2 unsubmitted lab reports and reduced LMS logins', impact: 'medium' }
  ],
  'std-2': [
    { factor: 'Academic Stress Signal', percentage: 45, description: 'High stress reports prior to Midterm exams', impact: 'high' },
    { factor: 'Classroom Engagement', percentage: 30, description: 'Faculty reported sudden silence in discussions', impact: 'medium' },
    { factor: 'Sleep Reduction', percentage: 25, description: 'Sleep duration dropped by 1.8 hours this week', impact: 'medium' }
  ]
};

export const INITIAL_FACULTY_REQUESTS: FacultyRequest[] = [
  {
    id: 'req-101',
    studentId: 'std-1',
    studentName: 'Aarohi Verma',
    department: 'Computer Science & Engineering',
    course: 'CS301: Algorithms & Data Structures',
    facultyName: 'Prof. Ramesh Verma',
    facultyId: 'fac-1',
    counselorName: 'Dr. Ananya Sharma',
    requestedDate: '2026-08-26',
    status: 'pending',
    dueDate: '2026-08-29',
    guidanceNote: 'Please observe classroom participation, group lab interaction, and overall attentiveness during lectures.'
  },
  {
    id: 'req-102',
    studentId: 'std-2',
    studentName: 'Rohan Mehta',
    department: 'Mechanical Engineering',
    course: 'ME204: Thermodynamics',
    facultyName: 'Prof. Ramesh Verma',
    facultyId: 'fac-1',
    counselorName: 'Dr. Ananya Sharma',
    requestedDate: '2026-08-25',
    status: 'completed',
    dueDate: '2026-08-28',
    guidanceNote: 'Verify if recent quiz performance aligns with usual participation levels.'
  }
];

export const INITIAL_FACULTY_OBSERVATIONS: FacultyObservation[] = [
  {
    id: 'obs-201',
    requestId: 'req-102',
    studentId: 'std-2',
    facultyName: 'Prof. Ramesh Verma',
    course: 'ME204: Thermodynamics',
    changeDetected: 'slight',
    participation: 'reduced',
    academicEngagement: 'reduced',
    peerInteraction: 'normal',
    contextualNotes: 'Rohan missed two tutorial discussions and appeared distracted during the last session. Usually answers questions actively.',
    submittedAt: '2026-08-27 11:30 AM'
  }
];

export const INITIAL_TIMELINE_EVENTS: Record<string, TimelineEvent[]> = {
  'std-1': [
    {
      id: 'evt-1',
      studentId: 'std-1',
      timestamp: 'Aug 14, 2026',
      type: 'check_in',
      title: 'Student Wellbeing Check-in',
      description: 'Logged mood as "Okay", stress level 5/10. Sleep reported as 6.5 hours.',
      author: 'Aarohi Verma'
    },
    {
      id: 'evt-2',
      studentId: 'std-1',
      timestamp: 'Aug 21, 2026',
      type: 'system_detection',
      title: 'Attendance Decline Detected',
      description: 'CampusPulse registered 3 consecutive unexcused absences in Data Structures Lab.',
      author: 'CampusPulse Signal Layer'
    },
    {
      id: 'evt-3',
      studentId: 'std-1',
      timestamp: 'Aug 24, 2026',
      type: 'system_detection',
      title: 'Elevated Support Need Flagged',
      description: 'Support Priority score increased to 8.4 based on mood trend and attendance signals.',
      author: 'CampusPulse Signal Layer'
    },
    {
      id: 'evt-4',
      studentId: 'std-1',
      timestamp: 'Aug 25, 2026',
      type: 'counselor_action',
      title: 'Counselor Initial Review',
      description: 'Dr. Ananya Sharma reviewed the flagged signals and decided to initiate contextual observation.',
      author: 'Dr. Ananya Sharma'
    },
    {
      id: 'evt-5',
      studentId: 'std-1',
      timestamp: 'Aug 26, 2026',
      type: 'faculty_request',
      title: 'Faculty Context Requested',
      description: 'Context request sent to Prof. Ramesh Verma (CS301) for observable classroom behavior.',
      author: 'Dr. Ananya Sharma'
    }
  ]
};

export const INITIAL_INTERVENTIONS: Record<string, InterventionRecord[]> = {
  'std-2': [
    {
      id: 'int-1',
      studentId: 'std-2',
      type: 'academic_support',
      date: '2026-08-27',
      notes: 'Scheduled academic peer tutoring session for Thermodynamics and provided exam stress reduction techniques.',
      followUpDate: '2026-09-03',
      outcome: 'improving',
      scheduledBy: 'Dr. Ananya Sharma'
    }
  ]
};

export const DEPARTMENT_METRICS: DepartmentMetric[] = [
  { department: 'Computer Science & Eng', studentCount: 420, stableCount: 315, moderateCount: 75, urgentCount: 30, averageStress: 6.8, attendanceTrend: -3.4 },
  { department: 'Mechanical Engineering', studentCount: 310, stableCount: 248, moderateCount: 48, urgentCount: 14, averageStress: 5.9, attendanceTrend: -1.2 },
  { department: 'Electronics & Comm', studentCount: 380, stableCount: 280, moderateCount: 72, urgentCount: 28, averageStress: 7.1, attendanceTrend: -4.8 },
  { department: 'Business Management', studentCount: 250, stableCount: 215, moderateCount: 27, urgentCount: 8, averageStress: 4.8, attendanceTrend: +0.6 },
  { department: 'Biotechnology', studentCount: 190, stableCount: 158, moderateCount: 24, urgentCount: 8, averageStress: 5.2, attendanceTrend: +1.1 },
  { department: 'Civil Engineering', studentCount: 220, stableCount: 194, moderateCount: 21, urgentCount: 5, averageStress: 4.5, attendanceTrend: +0.4 }
];
