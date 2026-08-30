import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDemoStore } from './store/useDemoStore';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Toast } from './components/common/Toast';
import { ThreeBackgroundCanvas } from './components/three/ThreeBackgroundCanvas';

// Modals
import { RecordInterventionModal } from './components/counselor/RecordInterventionModal';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { StudentHome } from './pages/student/StudentHome';
import { MannMitraPage } from './pages/student/MannMitraPage';
import { StudentCheckinPage } from './pages/student/StudentCheckinPage';
import { StudentTrendsPage } from './pages/student/StudentTrendsPage';
import { WellnessZonePage } from './pages/student/WellnessZonePage';
import { StudentSupportPage } from './pages/student/StudentSupportPage';

import { CounselorDashboard } from './pages/counselor/CounselorDashboard';
import { PriorityCasePage } from './pages/counselor/PriorityCasePage';
import { InterventionsPage } from './pages/counselor/InterventionsPage';
import { FollowupsPage } from './pages/counselor/FollowupsPage';
import { CounselorAnalyticsPage } from './pages/counselor/CounselorAnalyticsPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminForecastPage } from './pages/admin/AdminForecastPage';

import { DEPARTMENT_METRICS, INITIAL_FEATURE_CONTRIBUTIONS } from './mock/initialData';
import type { Student, UserRole, UserProfile } from './types';

interface ProtectedRouteProps {
  allowedRole: UserRole;
  currentUser: UserProfile | null;
  userRole: UserRole;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRole,
  currentUser,
  userRole,
  children
}) => {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const store = useDemoStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState<Student | null>(null);

  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  // Resolve active student dynamically for logged in student user
  const activeStudent: Student = store.students.find(
    s => s.name.toLowerCase() === store.currentUser?.name.toLowerCase() ||
         s.id === store.currentUser?.studentId ||
         s.studentId === store.currentUser?.studentId
  ) || {
    id: store.currentUser?.studentId || `CS2026-ACTIVE`,
    name: store.currentUser?.name || 'Aarohi Verma',
    avatar: store.currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
    department: store.currentUser?.department || 'Computer Science & Engineering',
    year: '1st Year',
    studentId: store.currentUser?.studentId || 'CS2026-901',
    priorityScore: 2.1,
    priorityLevel: 'stable',
    moodTrend: 'improving',
    stressScore: 3,
    sleepHours: 7.8,
    academicEngagement: 'normal',
    attendanceRate: 95,
    lastActivity: 'Just now',
    counselorAssigned: 'Dr. Ananya Sharma',
    primarySignals: ['Active Student Session', 'Consistent Check-ins'],
    summaryNote: 'Active student user session.'
  };

  // Absolute History Lock & Browser Back/Forward Interceptor
  useEffect(() => {
    // Lock current state in history
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();

      if (!store.currentUser) {
        navigate('/login', { replace: true });
        window.history.pushState(null, '', '/login');
        return;
      }

      const path = window.location.pathname;
      const currentRole = store.role;
      const allowedPrefix = `/${currentRole}`;

      if (path === '/login' || path === '/' || !path.startsWith(allowedPrefix)) {
        navigate(allowedPrefix, { replace: true });
        window.history.pushState(null, '', allowedPrefix);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [store.currentUser, store.role, location.pathname, navigate]);

  // Route level strict access enforcement
  useEffect(() => {
    if (!store.currentUser && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    } else if (store.currentUser && (location.pathname === '/login' || location.pathname === '/')) {
      navigate(`/${store.role}`, { replace: true });
    } else if (store.currentUser && !location.pathname.startsWith(`/${store.role}`)) {
      navigate(`/${store.role}`, { replace: true });
    }
  }, [location.pathname, store.currentUser, store.role, navigate]);

  const handleRoleChange = (newRole: UserRole) => {
    store.setRole(newRole);
    navigate(`/${newRole}`, { replace: true });
  };

  const handleRecordIntervention = (studentId: string) => {
    const std = store.students.find(s => s.id === studentId);
    if (std) setSelectedStudentForIntervention(std);
  };

  const handleLogout = () => {
    store.logoutUser();
    store.showToast('Signed Out', 'You have been signed out safely.', 'info');
    navigate('/login', { replace: true });
    window.history.pushState(null, '', '/login');
  };

  if (isLoginPage || !store.currentUser) {
    return (
      <div className={`min-h-screen ${store.theme} ${store.theme === 'light' ? 'bg-[#f2f7f5] text-slate-900' : 'bg-[#060e17] text-slate-100'} transition-colors duration-300`}>
        <LoginPage
          onSignIn={store.authenticateUser}
          onSignUp={store.registerNewUser}
          theme={store.theme}
          onToggleTheme={store.toggleTheme}
        />
        <Toast toast={store.toast} onClose={store.closeToast} />
      </div>
    );
  }

  return (
    <div className={`h-screen ${store.theme} ${store.theme === 'light' ? 'bg-[#f2f7f5] text-slate-900' : 'bg-[#060e17] text-slate-100'} flex flex-col font-sans selection:bg-emerald-600 selection:text-white transition-colors duration-300 relative overflow-hidden`}>
      {/* Universal Soft Ambient Background Animation */}
      <ThreeBackgroundCanvas theme={store.theme} />

      <Navbar
        currentRole={store.role}
        onRoleChange={handleRoleChange}
        theme={store.theme}
        onToggleTheme={store.toggleTheme}
        currentUser={store.currentUser}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex w-full px-4 lg:px-8 py-4 gap-6 relative z-10 min-h-0 overflow-hidden">
        <Sidebar role={store.role} />

        <main id="main-scroll-container" className="flex-1 p-4 lg:p-8 min-w-0 overflow-y-auto h-full scroll-smooth">
          <Routes>
            <Route path="/" element={<Navigate to={`/${store.role}`} replace />} />
            <Route path="/login" element={<Navigate to={`/${store.role}`} replace />} />

            {/* Student Protected Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRole="student" currentUser={store.currentUser} userRole={store.role}>
                  <StudentHome student={activeStudent} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/mannmitra"
              element={
                <ProtectedRoute allowedRole="student" currentUser={store.currentUser} userRole={store.role}>
                  <MannMitraPage messages={store.chatMessages} onSendMessage={store.addChatMessage} chatLoading={store.chatLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/checkin"
              element={
                <ProtectedRoute allowedRole="student" currentUser={store.currentUser} userRole={store.role}>
                  <StudentCheckinPage onSubmitCheckin={store.submitCheckin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/trends"
              element={
                <ProtectedRoute allowedRole="student" currentUser={store.currentUser} userRole={store.role}>
                  <StudentTrendsPage student={activeStudent} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/wellness"
              element={
                <ProtectedRoute allowedRole="student" currentUser={store.currentUser} userRole={store.role}>
                  <WellnessZonePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/support"
              element={
                <ProtectedRoute allowedRole="student" currentUser={store.currentUser} userRole={store.role}>
                  <StudentSupportPage />
                </ProtectedRoute>
              }
            />

            {/* Counselor Protected Routes */}
            <Route
              path="/counselor"
              element={
                <ProtectedRoute allowedRole="counselor" currentUser={store.currentUser} userRole={store.role}>
                  <CounselorDashboard
                    students={store.students}
                    onRecordIntervention={handleRecordIntervention}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor/cases"
              element={
                <ProtectedRoute allowedRole="counselor" currentUser={store.currentUser} userRole={store.role}>
                  <CounselorDashboard
                    students={store.students}
                    onRecordIntervention={handleRecordIntervention}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor/cases/:id"
              element={
                <ProtectedRoute allowedRole="counselor" currentUser={store.currentUser} userRole={store.role}>
                  <PriorityCasePage
                    students={store.students}
                    timelineEvents={store.timelineEvents}
                    featureContributions={INITIAL_FEATURE_CONTRIBUTIONS}
                    facultyObservations={store.facultyObservations}
                    onRecordIntervention={handleRecordIntervention}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor/interventions"
              element={
                <ProtectedRoute allowedRole="counselor" currentUser={store.currentUser} userRole={store.role}>
                  <InterventionsPage interventions={store.interventions} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor/followups"
              element={
                <ProtectedRoute allowedRole="counselor" currentUser={store.currentUser} userRole={store.role}>
                  <FollowupsPage students={store.students} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor/analytics"
              element={
                <ProtectedRoute allowedRole="counselor" currentUser={store.currentUser} userRole={store.role}>
                  <CounselorAnalyticsPage departmentMetrics={DEPARTMENT_METRICS} />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin" currentUser={store.currentUser} userRole={store.role}>
                  <AdminDashboard departmentMetrics={DEPARTMENT_METRICS} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRole="admin" currentUser={store.currentUser} userRole={store.role}>
                  <AdminDashboard departmentMetrics={DEPARTMENT_METRICS} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/forecast"
              element={
                <ProtectedRoute allowedRole="admin" currentUser={store.currentUser} userRole={store.role}>
                  <AdminForecastPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to={`/${store.role}`} replace />} />
          </Routes>
        </main>
      </div>

      <MobileNav role={store.role} />

      <Toast toast={store.toast} onClose={store.closeToast} />

      {selectedStudentForIntervention && (
        <RecordInterventionModal
          student={selectedStudentForIntervention}
          onClose={() => setSelectedStudentForIntervention(null)}
          onSubmitIntervention={store.recordIntervention}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
