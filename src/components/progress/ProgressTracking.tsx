import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Target, Clock, Award, CheckCircle, AlertCircle,
  Calendar, BarChart3, PieChart, Activity, BookOpen, Star
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface ProgressData {
  course_id: string;
  course_title: string;
  progress: number;
  time_spent: number;
  last_accessed: string;
  completion_date?: string;
  milestones_completed: number;
  total_milestones: number;
  current_module: string;
  grade?: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  completed: boolean;
  completed_at?: string;
  category: string;
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  target_date: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  courses_involved: string[];
  skills_targeted: string[];
}

interface StudySession {
  date: string;
  duration: number;
  courses_studied: string[];
  activities_completed: number;
  focus_score: number;
}

const ProgressTracking: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timeframes = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      
      // Fetch progress data
      const progressResponse = await fetch(`/api/v1/analytics/progress/user123?timeframe=${selectedTimeframe}`);
      const progressResult = await progressResponse.json();
      
      // Mock data for demonstration
      setProgressData([
        {
          course_id: 'course_1',
          course_title: 'React Development Fundamentals',
          progress: 75,
          time_spent: 1800, // 30 hours in minutes
          last_accessed: '2024-01-15T10:30:00Z',
          milestones_completed: 8,
          total_milestones: 12,
          current_module: 'Advanced Hooks',
          grade: 87
        },
        {
          course_id: 'course_2',
          course_title: 'Python for Data Science',
          progress: 45,
          time_spent: 960, // 16 hours in minutes
          last_accessed: '2024-01-14T14:20:00Z',
          milestones_completed: 5,
          total_milestones: 15,
          current_module: 'Pandas DataFrames',
          grade: 82
        },
        {
          course_id: 'course_3',
          course_title: 'Machine Learning Basics',
          progress: 100,
          time_spent: 2400, // 40 hours in minutes
          last_accessed: '2024-01-10T16:45:00Z',
          completion_date: '2024-01-10T16:45:00Z',
          milestones_completed: 10,
          total_milestones: 10,
          current_module: 'Course Completed',
          grade: 94
        }
      ]);

      setMilestones([
        {
          id: '1',
          title: 'Complete 5 React Projects',
          description: 'Build and deploy 5 different React applications',
          target_value: 5,
          current_value: 3,
          completed: false,
          category: 'projects'
        },
        {
          id: '2',
          title: 'Master JavaScript ES6+',
          description: 'Demonstrate proficiency in modern JavaScript features',
          target_value: 100,
          current_value: 100,
          completed: true,
          completed_at: '2024-01-05T12:00:00Z',
          category: 'skills'
        },
        {
          id: '3',
          title: 'Data Analysis Certification',
          description: 'Complete Python data analysis certification',
          target_value: 1,
          current_value: 0,
          completed: false,
          category: 'certification'
        }
      ]);

      setLearningGoals([
        {
          id: '1',
          title: 'Become Full-Stack Developer',
          description: 'Master both frontend and backend development',
          target_date: '2024-06-30',
          progress: 65,
          priority: 'high',
          courses_involved: ['React Development', 'Node.js Backend', 'Database Design'],
          skills_targeted: ['React', 'Node.js', 'MongoDB', 'REST APIs']
        },
        {
          id: '2',
          title: 'Data Science Proficiency',
          description: 'Gain expertise in data analysis and machine learning',
          target_date: '2024-08-15',
          progress: 40,
          priority: 'medium',
          courses_involved: ['Python for Data Science', 'Machine Learning', 'Statistics'],
          skills_targeted: ['Python', 'Pandas', 'Scikit-learn', 'Statistics']
        }
      ]);

      // Generate mock study session data
      const sessions = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        sessions.push({
          date: date.toISOString().split('T')[0],
          duration: Math.floor(Math.random() * 180) + 30, // 30-210 minutes
          courses_studied: ['React', 'Python'].slice(0, Math.floor(Math.random() * 2) + 1),
          activities_completed: Math.floor(Math.random() * 8) + 1,
          focus_score: Math.floor(Math.random() * 40) + 60 // 60-100
        });
      }
      setStudySessions(sessions);

    } catch (err) {
      console.error('Error fetching progress data:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, [selectedTimeframe]);

  const calculateOverallProgress = () => {
    if (progressData.length === 0) return 0;
    const totalProgress = progressData.reduce((sum, course) => sum + course.progress, 0);
    return Math.round(totalProgress / progressData.length);
  };

  const calculateTotalTimeSpent = () => {
    return progressData.reduce((sum, course) => sum + course.time_spent, 0);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMilestoneIcon = (category: string) => {
    switch (category) {
      case 'projects': return <BookOpen className="h-5 w-5" />;
      case 'skills': return <Star className="h-5 w-5" />;
      case 'certification': return <Award className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading progress data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
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
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              Progress Tracking
            </h1>
            <p className="text-gray-600 mt-1">Monitor your learning journey and achievements</p>
          </div>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeframes.map((timeframe) => (
              <option key={timeframe.value} value={timeframe.value}>
                {timeframe.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900">{calculateOverallProgress()}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Time Invested</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(calculateTotalTimeSpent())}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">{progressData.filter(c => c.progress < 100).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{progressData.filter(c => c.progress === 100).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Study Activity Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 text-blue-600 mr-2" />
          Study Activity
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={studySessions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value, name) => [
                name === 'duration' ? `${value} minutes` : value,
                name === 'duration' ? 'Study Time' : 'Activities'
              ]}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="duration" 
              stackId="1"
              stroke="#3B82F6" 
              fill="#3B82F6"
              fillOpacity={0.6}
              name="Study Time (min)"
            />
            <Area 
              type="monotone" 
              dataKey="activities_completed" 
              stackId="2"
              stroke="#10B981" 
              fill="#10B981"
              fillOpacity={0.6}
              name="Activities Completed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h2>
        <div className="space-y-4">
          {progressData.map((course) => (
            <div key={course.course_id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{course.course_title}</h3>
                  <p className="text-sm text-gray-600">Current: {course.current_module}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {course.completion_date && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <span className="text-lg font-semibold text-blue-600">{course.progress}%</span>
                  </div>
                  {course.grade && (
                    <p className="text-sm text-gray-600">Grade: {course.grade}%</p>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Time Spent:</span>
                  <span className="ml-1 font-medium">{formatTime(course.time_spent)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Milestones:</span>
                  <span className="ml-1 font-medium">{course.milestones_completed}/{course.total_milestones}</span>
                </div>
                <div>
                  <span className="text-gray-600">Last Accessed:</span>
                  <span className="ml-1 font-medium">{new Date(course.last_accessed).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Goals and Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Goals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 text-green-600 mr-2" />
            Learning Goals
          </h2>
          <div className="space-y-4">
            {learningGoals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{goal.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                    {goal.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  Target: {new Date(goal.target_date).toLocaleDateString()}
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">Skills: {goal.skills_targeted.join(', ')}</p>
                  <p className="text-xs text-gray-600">Courses: {goal.courses_involved.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 text-purple-600 mr-2" />
            Milestones
          </h2>
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {getMilestoneIcon(milestone.category)}
                    <h3 className="ml-2 font-medium text-gray-900">{milestone.title}</h3>
                  </div>
                  {milestone.completed && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{milestone.current_value}/{milestone.target_value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        milestone.completed ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${(milestone.current_value / milestone.target_value) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {milestone.completed_at && (
                  <p className="text-xs text-green-600 mt-2">
                    Completed: {new Date(milestone.completed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;