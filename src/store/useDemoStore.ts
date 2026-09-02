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
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('campus_pulse_chat_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.warn('Saved chat sessions parse error', e); }
    }
    return [{
      id: 'session-default',
      title: 'Initial Welcoming Chat',
      createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: 'msg-1',
          sender: 'mannmitra',
          text: `Namaste! I'm MannMitra, your campus companion. How are you feeling today? Remember, this is a safe, private space to express whatever is on your mind.`,
          timestamp: '10:00 AM',
          suggestions: ["I'm feeling overwhelmed with exams", "I can't focus on studies", "I've been sleeping poorly", "Just want to talk"]
        }
      ]
    }];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return localStorage.getItem('campus_pulse_active_session') || 'session-default';
  });

  const userStorageKey = currentUser ? `campus_pulse_chat_sessions_${currentUser.id}` : 'campus_pulse_chat_sessions_guest';

  // Load user-specific chat sessions whenever logged-in user changes
  useEffect(() => {
    const saved = localStorage.getItem(userStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.warn('Error loading user chat sessions:', e);
      }
    }
    const defaultSess: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'Initial Welcoming Chat',
      createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: 'msg-1',
          sender: 'mannmitra',
          text: `Namaste ${currentUser?.name ? currentUser.name.split(' ')[0] : 'Friend'}! I'm MannMitra, your campus companion. How are you feeling today? Remember, this is a safe, private space to express whatever is on your mind.`,
          timestamp: '10:00 AM',
          suggestions: ["I'm feeling overwhelmed with exams", "I can't focus on studies", "I've been sleeping poorly", "Just want to talk"]
        }
      ]
    };
    setChatSessions([defaultSess]);
    setActiveSessionId(defaultSess.id);
  }, [currentUser?.id]);

  useEffect(() => {
    localStorage.setItem(userStorageKey, JSON.stringify(chatSessions));
  }, [chatSessions, userStorageKey]);

  useEffect(() => {
    localStorage.setItem('campus_pulse_active_session', activeSessionId);
  }, [activeSessionId]);

  const activeSession = chatSessions.find(s => s.id === activeSessionId) || chatSessions[0] || {
    id: 'session-default',
    title: 'Initial Welcoming Chat',
    createdAt: '',
    updatedAt: '',
    messages: []
  };

  const chatMessages = activeSession.messages;
  const [chatLoading, setChatLoading] = useState(false);
  const chatHistoryRef = useRef<{ role: string; content: string }[]>([]);

  const createNewSession = () => {
    const newId = `session-${Date.now()}`;
    const initialMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'mannmitra',
      text: `Namaste! I'm MannMitra, your campus companion. How can I help you right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ["I need help with stress relief", "Can we do a breathing exercise?", "I can't sleep", "Exam preparation tips"]
    };
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [initialMsg]
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    showToast('Started new chat session', 'success');
  };

  const selectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  const deleteSession = (sessionId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setChatSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (filtered.length === 0) {
        const fallbackId = `session-${Date.now()}`;
        const newSess: ChatSession = {
          id: fallbackId,
          title: 'New Conversation',
          createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messages: [{
            id: `msg-${Date.now()}`,
            sender: 'mannmitra',
            text: `Namaste! I'm MannMitra, your campus companion. How are you feeling today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: ["I'm feeling overwhelmed", "Sleeping poorly", "Just want to talk"]
          }]
        };
        setActiveSessionId(fallbackId);
        return [newSess];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
    showToast('Chat session deleted', 'info');
  };

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

    // Direct Supabase Cloud DB authentication if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (data) {
          if (data.password !== password) {
            return { success: false, error: 'Incorrect password. Please verify your password and try again.' };
          }
          if (data.role !== selectedRole) {
            return {
              success: false,
              error: `This email is registered for the ${data.role.toUpperCase()} portal. Please select "${data.role.toUpperCase()}" to sign in.`
            };
          }
          const userProfile: UserProfile = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: data.avatar,
            title: data.title,
            department: data.department,
            studentId: data.student_id
          };
          loginUser(userProfile);
          return { success: true, user: userProfile };
        }
      } catch (err) {
        console.warn('Supabase direct auth query error, falling back:', err);
      }
    }

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

    // Direct Supabase Cloud DB registration if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const newUserId = `usr-${targetRole}-${Date.now()}`;
        const newProfile: UserProfile = {
          id: newUserId,
          name: fullName,
          email: cleanEmail,
          role: targetRole,
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
          title: targetRole === 'counselor' ? 'Clinical Psychologist' : targetRole === 'admin' ? 'Campus Administrator' : 'Student',
          department: targetRole === 'student' ? 'General Academics' : 'Student Welfare',
          studentId: targetRole === 'student' ? `STU-${Math.floor(1000 + Math.random() * 9000)}` : undefined
        };

        const { error } = await supabase.from('users').insert([{
          id: newProfile.id,
          email: cleanEmail,
          password: password,
          name: fullName,
          role: targetRole,
          title: newProfile.title,
          department: newProfile.department,
          student_id: newProfile.studentId,
          avatar: newProfile.avatar
        }]);

        if (!error) {
          if (targetRole === 'student') {
            const newStudentObj: Student = {
              id: newProfile.id,
              name: fullName,
              avatar: newProfile.avatar,
              department: newProfile.department || 'Computer Science & Engineering',
              year: '1st Year',
              studentId: newProfile.studentId || `STU-${Date.now()}`,
              hasCheckinData: false,
              priorityScore: 0,
              priorityLevel: 'stable',
              moodTrend: 'No Logs Yet',
              lastActivity: 'Just registered',
              counselorAssigned: 'Dr. Ananya Sharma',
              primarySignals: ['Active Student Session', 'Registered Account'],
              summaryNote: 'New registered student profile active.'
            };
            setStudents(prev => [newStudentObj, ...prev.filter(s => s.id !== newProfile.id)]);

            supabase.from('students').insert([{
              id: newProfile.id,
              student_id: newProfile.studentId,
              name: fullName,
              department: 'Computer Science & Engineering',
              year: '1st Year',
              priority_score: 1.8,
              priority_level: 'stable',
              mood_trend: 'stable',
              stress_score: 3,
              sleep_hours: 7.5,
              counselor_assigned: 'Dr. Ananya Sharma',
              last_activity: 'Just now',
              summary_note: 'New registered student profile active.'
            }]).then(({ error: err2 }) => {
              if (err2) console.warn('Supabase student insert notice:', err2);
            });
          }

          loginUser(newProfile);
          setUserDb(prev => [...prev, { ...newProfile, password }]);
          return { success: true, user: newProfile };
        }
      } catch (err) {
        console.warn('Supabase registration error, falling back:', err);
      }
    }

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

    if (targetRole === 'student') {
      const newStudentObj: Student = {
        id: newAccount.id,
        name: generatedName,
        avatar: newAccount.avatar,
        department: newAccount.department || 'Computer Science & Engineering',
        year: '1st Year',
        studentId: generatedStudentId,
        priorityScore: 1.8,
        priorityLevel: 'stable',
        moodTrend: 'stable',
        stressScore: 3,
        sleepHours: 7.5,
        academicEngagement: 'normal',
        attendanceRate: 95,
        lastActivity: 'Just now',
        counselorAssigned: 'Dr. Ananya Sharma',
        primarySignals: ['Active Student Session', 'Registered Account'],
        summaryNote: 'New registered student profile active.'
      };
      setStudents(prev => [newStudentObj, ...prev.filter(s => s.id !== newAccount.id)]);
    }

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

    // Also write to Supabase directly if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const calcPriority = Number((Math.min(10, (data.stress * 0.7) + ((8 - Math.min(8, data.sleepHours)) * 0.5))).toFixed(1));
        await supabase.from('checkins').insert([{
          student_id: studentId,
          student_name: studentName,
          mood: data.mood,
          stress: data.stress,
          sleep: data.sleepHours,
          notes: data.reflection || ''
        }]);

        await supabase.from('students').update({
          stress_score: data.stress,
          sleep_hours: data.sleepHours,
          priority_score: calcPriority,
          priority_level: calcPriority >= 7.5 ? 'urgent' : calcPriority >= 5.0 ? 'moderate' : 'stable',
          mood_trend: data.stress >= 7 ? 'declining' : data.stress <= 4 ? 'improving' : 'stable',
          last_activity: 'Just now'
        }).or(`id.eq.${studentId},student_id.eq.${studentId}`);
      } catch (err) {
        console.warn('Supabase checkin insert notice:', err);
      }
    }

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

  const appendMessageToSession = (msg: ChatMessage) => {
    setChatSessions(prevSessions => {
      return prevSessions.map(sess => {
        if (sess.id === activeSessionId) {
          const updatedMessages = [...sess.messages, msg];
          let updatedTitle = sess.title;
          if (sess.title === 'New Conversation' || sess.title === 'Initial Welcoming Chat') {
            if (msg.sender === 'user') {
              updatedTitle = msg.text.length > 30 ? `${msg.text.slice(0, 30)}...` : msg.text;
            }
          }
          return {
            ...sess,
            title: updatedTitle,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messages: updatedMessages
          };
        }
        return sess;
      });
    });
  };

  const addChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    appendMessageToSession(userMsg);
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
          session_id: activeSessionId,
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

      appendMessageToSession(replyMsg);
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

      appendMessageToSession({
        id: `msg-reply-${Date.now()}`,
        sender: 'mannmitra',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions
      });
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
        body: JSON.stringify({
          student_id: data.studentId,
          type: data.type,
          notes: data.notes,
          scheduled_by: data.scheduledBy,
          status: 'Scheduled'
        })
      });
    } catch (e) {
      console.warn('Backend Interventions API offline:', e);
    }
  };

  const updateFacultyRequestStatus = async (requestId: string, newStatus: 'pending' | 'completed') => {
    setFacultyRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: newStatus } : r))
    );

    try {
      await fetch(`${MANNMITRA_API}/api/faculty/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
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
    chatSessions,
    activeSessionId,
    createNewSession,
    selectSession,
    deleteSession,
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
