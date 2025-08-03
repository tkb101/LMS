import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import AdminDashboard from './dashboards/AdminDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import CoursesPage from './pages/CoursesPage';
import UsersPage from './pages/UsersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminStudentAnalyticsPage from './pages/AdminStudentAnalyticsPage';
import LearningPathsPage from './pages/LearningPathsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderContent = () => {
    // Handle dashboard routing
    if (currentPage === 'dashboard' || currentPage === 'analytics') {
      if (currentPage === 'analytics' || (currentPage === 'dashboard' && user?.role === 'admin')) {
        return user?.role === 'admin' ? <AdminDashboard /> : <AnalyticsPage />;
      }
      switch (user?.role) {
        case 'admin':
          return <AdminDashboard />;
        case 'teacher':
          return <TeacherDashboard />;
        case 'student':
          return <StudentDashboard />;
        default:
          return <div className="p-8">Unknown user role</div>;
      }
    }

    // Handle other pages
    switch (currentPage) {
      case 'courses':
        return <CoursesPage />;
      case 'users':
        return <UsersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'student-analytics':
        return <AdminStudentAnalyticsPage />;
      case 'learning-paths':
      case 'learning-path':
        return <LearningPathsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return renderContent();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Layout;