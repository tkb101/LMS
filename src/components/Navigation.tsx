import React from 'react';
import { User, LogOut, BookOpen, BarChart3, Users, Settings, GraduationCap, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: BarChart3, label: 'Analytics', id: 'analytics' },
          { icon: Brain, label: 'Student Analytics', id: 'student-analytics' },
          { icon: Users, label: 'Users', id: 'users' },
          { icon: BookOpen, label: 'Courses', id: 'courses' },
          { icon: GraduationCap, label: 'Learning Paths', id: 'learning-paths' },
          { icon: Settings, label: 'Settings', id: 'settings' }
        ];
      case 'teacher':
        return [
          { icon: BookOpen, label: 'My Courses', id: 'courses' },
          { icon: GraduationCap, label: 'Learning Paths', id: 'learning-paths' },
          { icon: Users, label: 'Students', id: 'users' },
          { icon: BarChart3, label: 'Analytics', id: 'analytics' }
        ];
      case 'student':
        return [
          { icon: BookOpen, label: 'My Courses', id: 'courses' },
          { icon: GraduationCap, label: 'Learning Path', id: 'learning-path' },
          { icon: BarChart3, label: 'Progress', id: 'analytics' },
          { icon: User, label: 'Profile', id: 'profile' }
        ];
      default:
        return [];
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return 'from-red-600 to-pink-600';
      case 'teacher': return 'from-blue-600 to-indigo-600';
      case 'student': return 'from-green-600 to-emerald-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor()} rounded-xl flex items-center justify-center`}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EduPath</h1>
            <p className="text-sm text-gray-600 capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4">
        <nav className="space-y-2">
          {getNavItems().map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;