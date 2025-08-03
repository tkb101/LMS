import React from 'react';
import { Users, BookOpen, TrendingUp, Award, UserCheck, Clock, Star, User } from 'lucide-react';
import { mockAnalytics, mockCourses } from '../../data/mockData';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Students',
      value: mockAnalytics.totalStudents.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Courses',
      value: mockAnalytics.totalCourses.toString(),
      icon: BookOpen,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Completion Rate',
      value: `${mockAnalytics.completionRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Average Score',
      value: `${mockAnalytics.averageScore}/100`,
      icon: Award,
      color: 'bg-orange-500',
      change: '+3%'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform performance and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trends</h3>
          <div className="space-y-4">
            {mockAnalytics.engagementTrends.slice(-7).map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{new Date(trend.date).toLocaleDateString()}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{trend.activeUsers}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{trend.completions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Courses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Courses</h3>
          <div className="space-y-4">
            {mockAnalytics.popularCourses.map((course, index) => (
              <div key={course.id} className="flex items-center space-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{course.title}</h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{course.enrolledStudents}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-600">{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{course.duration}h</span>
                    </div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New course created', details: 'Advanced React Patterns by Prof. Rodriguez', time: '2 hours ago', type: 'course' },
            { action: 'Student enrolled', details: 'Emma Thompson joined Machine Learning course', time: '4 hours ago', type: 'enrollment' },
            { action: 'Learning path completed', details: 'Data Science Mastery path finished by John Doe', time: '6 hours ago', type: 'completion' },
            { action: 'New teacher joined', details: 'Dr. Lisa Kim added to Computer Science department', time: '1 day ago', type: 'user' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'course' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'enrollment' ? 'bg-green-100 text-green-600' :
                activity.type === 'completion' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {activity.type === 'course' && <BookOpen className="w-4 h-4" />}
                {activity.type === 'enrollment' && <Users className="w-4 h-4" />}
                {activity.type === 'completion' && <Award className="w-4 h-4" />}
                {activity.type === 'user' && <User className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;