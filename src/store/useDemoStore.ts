import { useState, useEffect, useRef } from 'react';
import type {
  UserRole,
  Student,
  FacultyRequest,
  FacultyObservation,
  TimelineEvent,
  InterventionRecord,
  ChatMessage,
  CheckinData,
  UserProfile
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_FACULTY_REQUESTS,
  INITIAL_FACULTY_OBSERVATIONS,
  INITIAL_TIMELINE_EVENTS,
  INITIAL_INTERVENTIONS
} from '../mock/initialData';

export interface RegisteredUser extends UserProfile {
  password?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

export type ThemeMode = 'dark' | 'light';

const DEFAULT_ACCOUNTS: RegisteredUser[] = [
  {
    id: 'usr-student-1',
    name: 'Aarohi Verma',
    email: 'aarohi@campus.edu',
    password: 'student123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    title: 'Student',
    department: 'Computer Science & Engineering',
    studentId: 'CS2023-042'
  },
  {
    id: 'usr-counselor-1',
    name: 'Dr. Ananya Sharma',
    email: 'ananya@campus.edu',
    password: 'counselor123',
    role: 'counselor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    title: 'Senior Clinical Psychologist',
    department: 'University Student Health Center'
  },
  {
    id: 'usr-admin-1',
    name: 'Dean Mehta',
    email: 'dean.mehta@campus.edu',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    title: 'Dean of Student Welfare',
    department: 'Executive Administration'
  }
];

export function useDemoStore() {
  const MANNMITRA_API = import.meta.env.VITE_MANNMITRA_API ?? 'http://localhost:5000';

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('campus_pulse_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [role, setRole] = useState<UserRole>(() => {
    return currentUser?.role || 'student';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('campus_pulse_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [userDb, setUserDb] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('campus_pulse_user_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_ACCOUNTS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('campus_pulse_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_STUDENTS;
  });

  const [facultyRequests, setFacultyRequests] = useState<FacultyRequest[]>(INITIAL_FACULTY_REQUESTS);
  const [facultyObservations] = useState<FacultyObservation[]>(INITIAL_FACULTY_OBSERVATIONS);
  const [timelineEvents] = useState<Record<string, TimelineEvent[]>>(INITIAL_TIMELINE_EVENTS);
  const [interventions, setInterventions] = useState<Record<string, InterventionRecord[]>>(INITIAL_INTERVENTIONS);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'mannmitra',
      text: `Namaste ${currentUser?.name ? currentUser.name.split(' ')[0] : 'Friend'}! I'm MannMitra, your campus companion. How are you feeling today? Remember, this is a safe, private space to express whatever is on your mind.`,
      timestamp: '10:00 AM',
      suggestions: ["I'm feeling overwhelmed with exams", "I can't focus on studies", "I've been sleeping poorly", "Just want to talk"]
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatHistoryRef = useRef<{ role: string; content: string }[]>([]);

  // Initial Sync from Python Backend API
  useEffect(() => {
    async function syncFromBackend() {
      try {
        const res = await fetch(`${MANNMITRA_API}/api/students`);
        if (res.ok) {
          const data = await res.json();
          if (data.students && Array.isArray(data.students) && data.students.length > 0) {
            setStudents(data.students);
            localStorage.setItem('campus_pulse_students', JSON.stringify(data.students));
          }
        }
      } catch (e) {
        console.info('Backend API sync pending, using local store:', e);
      }
    }
    syncFromBackend();
  }, [MANNMITRA_API]);

  useEffect(() => {
    localStorage.setItem('campus_pulse_user_db', JSON.stringify(userDb));
  }, [userDb]);

  useEffect(() => {
    localStorage.setItem('campus_pulse_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('campus_pulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({
      id: `toast-${Date.now()}`,
      title,
      message,
      type
    });
  };

  const closeToast = () => {
    setToast(null);
  };

  const loginUser = (user: UserProfile) => {
    setCurrentUser(user);
    setRole(user.role);
    localStorage.setItem('campus_pulse_auth_user', JSON.stringify(user));
  };

  const authenticateUser = async (
    email: string,
    password: string,
    selectedRole: UserRole
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Try backend authentication first
    try {
      const res = await fetch(`${MANNMITRA_API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, role: selectedRole })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        loginUser(data.user);
        return { success: true, user: data.user };
      } else if (data.error) {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.warn('Backend Auth API unreachable, attempting local fallback:', err);
    }

    // Local account fallback
    const account = userDb.find(u => u.email.toLowerCase() === cleanEmail);
    if (!account) {
      return {
        success: false,
        error: 'No account registered with this campus email. Please check your email or click "Create Account" to register.'
      };
    }
    if (account.password && account.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify your password and try again.' };
    }
    if (account.role !== selectedRole) {
      return {
        success: false,
        error: `This email is registered for the ${account.role.toUpperCase()} portal. Please select "${account.role.toUpperCase()}" to sign in.`
      };
    }

    loginUser(account);
    return { success: true, user: account };
  };

  const registerNewUser = async (
    fullName: string,
    email: string,
    password: string,
    targetRole: UserRole
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Try backend registration
    try {
      const res = await fetch(`${MANNMITRA_API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email: cleanEmail, password, role: targetRole })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        loginUser(data.user);
        setUserDb(prev => [...prev, { ...data.user, password }]);
        return { success: true, user: data.user };
      } else if (data.error) {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.warn('Backend Register API unreachable, attempting local fallback:', err);
    }

    // Local registration fallback
    const existing = userDb.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please switch to "Sign In".' };
    }

    const generatedName = fullName.trim() || cleanEmail.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const generatedStudentId = `CS2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAccount: RegisteredUser = {
      id: `user-${Date.now()}`,
      name: generatedName,
      email: cleanEmail,
      password: password,
      role: targetRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      title: targetRole === 'student' ? 'Student' : targetRole === 'counselor' ? 'Counselor' : 'Campus Admin',
      department: 'Computer Science & Engineering',
      studentId: targetRole === 'student' ? generatedStudentId : undefined
    };

    const updatedDb = [...userDb, newAccount];
    setUserDb(updatedDb);
    loginUser(newAccount);
    return { success: true, user: newAccount };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('campus_pulse_auth_user');
  };

  const submitCheckin = async (data: Omit<CheckinData, 'id' | 'timestamp'>) => {
    const studentId = currentUser?.studentId || currentUser?.id || 'CS2023-042';
    const studentName = currentUser?.name || 'Student';

    showToast('Check-in Saved!', `Your daily mood (${data.mood}) & stress rating (${data.stress}/10) have been recorded.`, 'success');

    try {
      const res = await fetch(`${MANNMITRA_API}/api/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName,
          mood: data.mood,
          stress: data.stress,
          sleep: data.sleepHours,
          notes: data.reflection || ''
        })
      });
      if (res.ok) {
        // Re-fetch updated students list
        const stdRes = await fetch(`${MANNMITRA_API}/api/students`);
        if (stdRes.ok) {
          const stdData = await stdRes.json();
          if (stdData.students) setStudents(stdData.students);
        }
      }
    } catch (e) {
      console.warn('Backend Checkin API offline, updating local state:', e);
      // Local recalculation fallback
      setStudents(prev =>
        prev.map(s => {
          if (s.id === studentId || s.studentId === studentId || s.name.toLowerCase() === studentName.toLowerCase()) {
            const newStress = data.stress;
            const calcPriority = Number((min(10, (newStress * 0.7) + ((8 - min(8, data.sleepHours)) * 0.5))).toFixed(1));
            return {
              ...s,
              stressScore: newStress,
              sleepHours: data.sleepHours,
              priorityScore: calcPriority,
              priorityLevel: calcPriority >= 7.5 ? 'urgent' : calcPriority >= 5.0 ? 'moderate' : 'stable',
              moodTrend: newStress >= 7 ? 'declining' : newStress <= 4 ? 'improving' : 'stable',
              lastActivity: 'Just now'
            };
          }
          return s;
        })
      );
    }
  };

  function min(a: number, b: number) { return Math.min(a, b); }

  const addChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatLoading(true);

    chatHistoryRef.current = [
      ...chatHistoryRef.current,
      { role: 'user', content: text }
    ].slice(-12);

    try {
      const res = await fetch(`${MANNMITRA_API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: currentUser?.id ?? 'guest',
          history: chatHistoryRef.current.slice(0, -1)
        })
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();
      const replyText: string = data.reply ?? "I'm here with you. Tell me more about how you're feeling.";
      const tier: 'GREEN' | 'YELLOW' | 'RED' = (['GREEN', 'YELLOW', 'RED'].includes(data.tier) ? data.tier : 'GREEN') as 'GREEN' | 'YELLOW' | 'RED';
      const isCrisis: boolean = data.is_crisis ?? false;

      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: 'assistant', content: replyText }
      ].slice(-12);

      let suggestions: string[] = [];
      if (isCrisis) {
        suggestions = ['Call Tele-MANAS: 14416', 'Call KIRAN: 1800-599-0019', 'Go to nearest hospital'];
      } else if (tier === 'RED' || tier === 'YELLOW') {
        suggestions = ['Try a grounding exercise', 'Would you like to talk to a counselor?', 'Shall we try box breathing?'];
      } else {
        suggestions = ['Tell me more', 'Try a breathing exercise', 'How can I support you?'];
      }

      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'mannmitra',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions,
        tier,
        emotion: data.emotion,
        ragUsed: data.rag_used,
        isCrisis
      };

      setChatMessages(prev => [...prev, replyMsg]);
    } catch (err) {
      console.warn('MannMitra API unreachable, using offline fallback:', err);
      const lower = text.toLowerCase();
      let replyText = "Thank you for sharing that with me. It takes courage to open up. Taking small moments to breathe can make a big difference.";
      let suggestions: string[] = ["Tell me a guided relaxation technique", "How can I improve sleep?", "Connect me with a counselor"];

      if (lower.includes('exam') || lower.includes('stress') || lower.includes('study')) {
        replyText = "Exam pressure can feel heavy, but you don't have to carry it all at once. Try breaking tasks into 15-minute Pomodoro blocks with short breathing pauses.";
        suggestions = ["Try Box Breathing in Wellness Zone", "Schedule a study break", "Talk about time management"];
      } else if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia')) {
        replyText = "Rest is essential for your mind to recharge. A regular bedtime wind-down routine without screens 30 minutes before sleep can really help.";
        suggestions = ["Show sleep hygiene tips", "Try 5-4-3-2-1 Grounding", "Log sleep hours in Check-in"];
      }

      setChatMessages(prev => [...prev, {
        id: `msg-reply-${Date.now()}`,
        sender: 'mannmitra',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const recordIntervention = async (data: Omit<InterventionRecord, 'id'>) => {
    const newRecord: InterventionRecord = {
      id: `int-${Date.now()}`,
      ...data
    };

    setInterventions(prev => {
      const currentList = prev[data.studentId] || [];
      return {
        ...prev,
        [data.studentId]: [newRecord, ...currentList]
      };
    });

    setStudents(prev =>
      prev.map(s => {
        if (s.id === data.studentId) {
          return {
            ...s,
            lastActivity: 'Intervention scheduled',
            summaryNote: `Scheduled ${data.type} intervention by ${currentUser?.name || 'Counselor'}.`
          };
        }
        return s;
      })
    );

    showToast('Intervention Saved', `Scheduled ${data.type} support session.`, 'success');

    try {
      await fetch(`${MANNMITRA_API}/api/interventions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, scheduledBy: currentUser?.name || 'Counselor' })
      });
    } catch (e) {
      console.warn('Backend Intervention API offline:', e);
    }
  };

  const updateFacultyRequestStatus = async (id: string, status: FacultyRequest['status']) => {
    setFacultyRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
    showToast('Status Updated', `Faculty observation request updated to ${status}.`, 'info');

    try {
      await fetch(`${MANNMITRA_API}/api/faculty-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
    } catch (e) {
      console.warn('Backend Faculty Requests API offline:', e);
    }
  };

  return {
    currentUser,
    role,
    setRole,
    theme,
    toggleTheme,
    userDb,
    authenticateUser,
    registerNewUser,
    logoutUser,
    students,
    facultyRequests,
    facultyObservations,
    timelineEvents,
    interventions,
    chatMessages,
    chatLoading,
    toast,
    showToast,
    closeToast,
    submitCheckin,
    addChatMessage,
    recordIntervention,
    updateFacultyRequestStatus
  };
}
