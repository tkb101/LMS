import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter,
  ComposedChart, Legend
} from 'recharts';
import { 
  Users, GraduationCap, Clock, TrendingUp, TrendingDown, AlertTriangle, 
  Target, Brain, Download, Filter, Calendar, Eye, BookOpen, Award,
  UserCheck, UserX, Activity, BarChart3, PieChart as PieChartIcon,
  Globe, MapPin, Smartphone, Monitor, Tablet
} from 'lucide-react';
import { mockUsers, mockAnalytics, mockProgress } from '../../data/mockData';

const AdminStudentAnalyticsPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  // Enhanced student data with analytics
  const studentAnalytics = {
    totalStudents: 1247,
    activeStudents: 892,
    newStudents: 156,
    graduatedStudents: 234,
    retentionRate: 78.5,
    averageCompletionTime: 4.2,
    satisfactionScore: 4.6,
    
    // Demographics data
    ageDistribution: [
      { range: '18-22', count: 312, percentage: 25 },
      { range: '23-27', count: 398, percentage: 32 },
      { range: '28-32', count: 287, percentage: 23 },
      { range: '33-37', count: 156, percentage: 12.5 },
      { range: '38+', count: 94, percentage: 7.5 }
    ],
    
    // Geographic distribution
    geographicData: [
      { region: 'North America', students: 456, percentage: 36.6 },
      { region: 'Europe', students: 298, percentage: 23.9 },
      { region: 'Asia', students: 267, percentage: 21.4 },
      { region: 'South America', students: 134, percentage: 10.7 },
      { region: 'Africa', students: 67, percentage: 5.4 },
      { region: 'Oceania', students: 25, percentage: 2.0 }
    ],
    
    // Device usage
    deviceUsage: [
      { device: 'Desktop', users: 567, percentage: 45.5 },
      { device: 'Mobile', users: 423, percentage: 33.9 },
      { device: 'Tablet', users: 257, percentage: 20.6 }
    ],
    
    // Learning patterns
    learningPatterns: [
      { pattern: 'Morning Learner', count: 387, percentage: 31 },
      { pattern: 'Evening Learner', count: 456, percentage: 36.6 },
      { pattern: 'Weekend Warrior', count: 234, percentage: 18.8 },
      { pattern: 'Consistent Daily', count: 170, percentage: 13.6 }
    ],
    
    // Performance distribution
    performanceDistribution: [
      { grade: 'A (90-100%)', count: 234, percentage: 18.8 },
      { grade: 'B (80-89%)', count: 398, percentage: 31.9 },
      { grade: 'C (70-79%)', count: 312, percentage: 25.0 },
      { grade: 'D (60-69%)', count: 187, percentage: 15.0 },
      { grade: 'F (<60%)', count: 116, percentage: 9.3 }
    ],
    
    // Engagement levels
    engagementLevels: [
      { level: 'Highly Engaged', count: 298, percentage: 23.9, color: '#10B981' },
      { level: 'Moderately Engaged', count: 567, percentage: 45.5, color: '#3B82F6' },
      { level: 'Low Engagement', count: 267, percentage: 21.4, color: '#F59E0B' },
      { level: 'At Risk', count: 115, percentage: 9.2, color: '#EF4444' }
    ],
    
    // Course completion trends
    completionTrends: [
      { month: 'Jan', completed: 45, dropped: 12, active: 234 },
      { month: 'Feb', completed: 52, dropped: 8, active: 267 },
      { month: 'Mar', completed: 61, dropped: 15, active: 298 },
      { month: 'Apr', completed: 58, dropped: 10, active: 312 },
      { month: 'May', completed: 67, dropped: 7, active: 345 },
      { month: 'Jun', completed: 74, dropped: 9, active: 378 }
    ],
    
    // Study time distribution
    studyTimeDistribution: [
      { hours: '0-2h', students: 156, percentage: 12.5 },
      { hours: '2-5h', students: 398, percentage: 31.9 },
      { hours: '5-10h', students: 456, percentage: 36.6 },
      { hours: '10-15h', students: 187, percentage: 15.0 },
      { hours: '15+h', students: 50, percentage: 4.0 }
    ],
    
    // Skills assessment radar
    skillsAssessment: [
      { skill: 'Technical Skills', current: 78, target: 85 },
      { skill: 'Problem Solving', current: 82, target: 90 },
      { skill: 'Communication', current: 75, target: 80 },
      { skill: 'Collaboration', current: 88, target: 90 },
      { skill: 'Critical Thinking', current: 79, target: 85 },
      { skill: 'Creativity', current: 73, target: 80 }
    ],
    
    // Learning velocity
    learningVelocity: [
      { week: 'Week 1', fast: 45, medium: 123, slow: 67 },
      { week: 'Week 2', fast: 52, medium: 134, slow: 59 },
      { week: 'Week 3', fast: 48, medium: 145, slow: 62 },
      { week: 'Week 4', fast: 61, medium: 156, slow: 54 },
      { week: 'Week 5', fast: 58, medium: 167, slow: 48 },
      { week: 'Week 6', fast: 67, medium: 178, slow: 43 }
    ]
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`Exporting student analytics report as ${format.toUpperCase()}...`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into student performance, engagement, and learning patterns</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
          </select>
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Students</option>
            <option value="2024">2024 Cohort</option>
            <option value="2023">2023 Cohort</option>
            <option value="active">Active Only</option>
            <option value="at-risk">At Risk</option>
          </select>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border-l border-gray-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => exportReport('csv')}
              className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border-l border-gray-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{studentAnalytics.totalStudents.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-600 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{studentAnalytics.activeStudents.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8.3%</span>
            <span className="text-gray-600 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Students</p>
              <p className="text-2xl font-bold text-gray-900">{studentAnalytics.newStudents}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <UserX className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+15.7%</span>
            <span className="text-gray-600 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Graduated</p>
              <p className="text-2xl font-bold text-gray-900">{studentAnalytics.graduatedStudents}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <GraduationCap className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+22.1%</span>
            <span className="text-gray-600 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retention Rate</p>
              <p className="text-2xl font-bold text-gray-900">{studentAnalytics.retentionRate}%</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+3.2%</span>
            <span className="text-gray-600 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion</p>
              <p className="text-2xl font-bold text-gray-900">{studentAnalytics.averageCompletionTime}mo</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <Clock className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600">-0.3mo</span>
            <span className="text-gray-600 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{studentAnalytics.satisfactionScore}/5</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+0.2</span>
            <span className="text-gray-600 ml-1">vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Age Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            Age Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentAnalytics.ageDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, percentage }) => `${range}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {studentAnalytics.ageDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-600" />
            Geographic Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentAnalytics.geographicData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="region" type="category" width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="students" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Usage */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-purple-600" />
            Device Usage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentAnalytics.deviceUsage}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="users"
              >
                {studentAnalytics.deviceUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance and Engagement Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Performance Distribution
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={studentAnalytics.performanceDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Levels */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-pink-600" />
            Engagement Levels
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={studentAnalytics.engagementLevels}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ level, percentage }) => `${level}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {studentAnalytics.engagementLevels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Learning Patterns and Study Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Learning Patterns */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Patterns</h3>
          <div className="space-y-4">
            {studentAnalytics.learningPatterns.map((pattern, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm font-medium text-gray-900">{pattern.pattern}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${pattern.percentage}%`,
                        backgroundColor: COLORS[index]
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{pattern.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Time Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Study Time Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={studentAnalytics.studyTimeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hours" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="students" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Skills Assessment Radar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Skills Assessment Overview
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={studentAnalytics.skillsAssessment}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Current Level" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              <Radar name="Target Level" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
              <Legend />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Learning Velocity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Velocity Trends</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={studentAnalytics.learningVelocity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="fast" stackId="a" fill="#10B981" name="Fast Learners" />
              <Bar dataKey="medium" stackId="a" fill="#3B82F6" name="Medium Pace" />
              <Bar dataKey="slow" stackId="a" fill="#F59E0B" name="Slow Learners" />
              <Line type="monotone" dataKey="fast" stroke="#059669" strokeWidth={2} name="Fast Trend" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Completion Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Completion Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={studentAnalytics.completionTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="completed" fill="#10B981" name="Completed" />
            <Bar dataKey="dropped" fill="#EF4444" name="Dropped" />
            <Line type="monotone" dataKey="active" stroke="#3B82F6" strokeWidth={3} name="Active Students" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Student Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Student Performance Details</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                Export List
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.filter(user => user.role === 'student').slice(0, 10).map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.floor(Math.random() * 5) + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">{Math.floor(Math.random() * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(Math.random() * 40 + 60).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      Math.random() > 0.7 ? 'bg-green-100 text-green-800' :
                      Math.random() > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      Math.random() > 0.8 ? 'bg-red-100 text-red-800' :
                      Math.random() > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {Math.random() > 0.8 ? 'At Risk' : Math.random() > 0.6 ? 'Warning' : 'Good'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <BookOpen className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentAnalyticsPage;