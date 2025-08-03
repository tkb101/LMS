import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Download, Filter, Calendar,
  Users, BookOpen, Clock, Target, FileText, Mail, Share2
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface EngagementData {
  date: string;
  activeUsers: number;
  completions: number;
  newEnrollments: number;
  averageSessionTime: number;
  dropoffRate: number;
}

interface CourseAnalytics {
  course_id: string;
  course_title: string;
  total_enrollments: number;
  active_students: number;
  completion_rate: number;
  average_score: number;
  engagement_score: number;
  time_to_complete: number;
}

interface ReportConfig {
  title: string;
  description: string;
  dateRange: {
    start: string;
    end: string;
  };
  metrics: string[];
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  schedule?: 'daily' | 'weekly' | 'monthly';
}

const AnalyticsReporting: React.FC = () => {
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['engagement', 'completion', 'performance']);
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-01-31' });
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: 'Learning Analytics Report',
    description: 'Comprehensive analysis of learning engagement and performance',
    dateRange: { start: '2024-01-01', end: '2024-01-31' },
    metrics: ['engagement', 'completion', 'performance'],
    format: 'pdf',
    recipients: []
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const availableMetrics = [
    { id: 'engagement', label: 'User Engagement', icon: Users },
    { id: 'completion', label: 'Course Completion', icon: Target },
    { id: 'performance', label: 'Learning Performance', icon: TrendingUp },
    { id: 'time', label: 'Time Analytics', icon: Clock },
    { id: 'content', label: 'Content Effectiveness', icon: BookOpen }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Generate mock engagement data
      const engagementMockData = [];
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        engagementMockData.push({
          date: date.toISOString().split('T')[0],
          activeUsers: Math.floor(Math.random() * 200) + 100,
          completions: Math.floor(Math.random() * 50) + 10,
          newEnrollments: Math.floor(Math.random() * 30) + 5,
          averageSessionTime: Math.floor(Math.random() * 60) + 30,
          dropoffRate: Math.floor(Math.random() * 20) + 5
        });
      }
      setEngagementData(engagementMockData);

      // Mock course analytics data
      setCourseAnalytics([
        {
          course_id: 'course_1',
          course_title: 'React Development Fundamentals',
          total_enrollments: 245,
          active_students: 189,
          completion_rate: 78.5,
          average_score: 87.2,
          engagement_score: 8.4,
          time_to_complete: 42
        },
        {
          course_id: 'course_2',
          course_title: 'Python for Data Science',
          total_enrollments: 198,
          active_students: 156,
          completion_rate: 65.3,
          average_score: 82.1,
          engagement_score: 7.8,
          time_to_complete: 56
        },
        {
          course_id: 'course_3',
          course_title: 'Machine Learning Basics',
          total_enrollments: 167,
          active_students: 134,
          completion_rate: 71.2,
          average_score: 85.7,
          engagement_score: 8.1,
          time_to_complete: 48
        },
        {
          course_id: 'course_4',
          course_title: 'Web Development Bootcamp',
          total_enrollments: 312,
          active_students: 278,
          completion_rate: 82.1,
          average_score: 89.3,
          engagement_score: 9.2,
          time_to_complete: 38
        }
      ]);

    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const generateReport = async (format: 'pdf' | 'excel' | 'csv') => {
    setGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call the backend API
      const reportData = {
        title: reportConfig.title,
        dateRange: reportConfig.dateRange,
        metrics: selectedMetrics,
        engagementData,
        courseAnalytics,
        generatedAt: new Date().toISOString()
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${format}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setGenerating(false);
    }
  };

  const scheduleReport = async () => {
    try {
      // In a real implementation, this would set up automated report generation
      console.log('Scheduling report:', reportConfig);
      alert('Report scheduled successfully!');
    } catch (err) {
      console.error('Error scheduling report:', err);
    }
  };

  const shareReport = async () => {
    try {
      // In a real implementation, this would share the report via email or other means
      console.log('Sharing report with:', reportConfig.recipients);
      alert('Report shared successfully!');
    } catch (err) {
      console.error('Error sharing report:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading analytics data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              Analytics & Reporting
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive insights and customizable reports</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => generateReport('pdf')}
              disabled={generating}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {generating ? 'Generating...' : 'Export PDF'}
            </button>
            <button
              onClick={() => generateReport('excel')}
              disabled={generating}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="space-y-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Metrics Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metrics to Include</label>
            <div className="space-y-2">
              {availableMetrics.map((metric) => (
                <label key={metric.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMetrics(prev => [...prev, metric.id]);
                      } else {
                        setSelectedMetrics(prev => prev.filter(m => m !== metric.id));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{metric.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Report Configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Settings</label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Report Title"
                value={reportConfig.title}
                onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={reportConfig.format}
                onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value as 'pdf' | 'excel' | 'csv' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="pdf">PDF Report</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV Data</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {engagementData.reduce((sum, day) => sum + day.activeUsers, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {(courseAnalytics.reduce((sum, course) => sum + course.completion_rate, 0) / courseAnalytics.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-gray-900">
                {(courseAnalytics.reduce((sum, course) => sum + course.average_score, 0) / courseAnalytics.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(engagementData.reduce((sum, day) => sum + day.averageSessionTime, 0) / engagementData.length)}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Active Users"
              />
              <Line 
                type="monotone" 
                dataKey="newEnrollments" 
                stroke="#10B981" 
                strokeWidth={2}
                name="New Enrollments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="course_title" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completion_rate" fill="#3B82F6" name="Completion Rate %" />
              <Bar dataKey="average_score" fill="#10B981" name="Average Score %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Course Analytics Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Course Analytics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Time to Complete
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courseAnalytics.map((course) => (
                <tr key={course.course_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.course_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.total_enrollments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.active_students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${course.completion_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{course.completion_rate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.average_score.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full mr-1 ${
                              i < course.engagement_score ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-900">{course.engagement_score}/10</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.time_to_complete} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Scheduling */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Reporting</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Frequency</label>
            <select
              value={reportConfig.schedule || ''}
              onChange={(e) => setReportConfig(prev => ({ ...prev, schedule: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">One-time report</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Recipients</label>
            <input
              type="email"
              placeholder="Enter email addresses (comma separated)"
              onChange={(e) => setReportConfig(prev => ({ 
                ...prev, 
                recipients: e.target.value.split(',').map(email => email.trim()) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={scheduleReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </button>
            <button
              onClick={shareReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReporting;