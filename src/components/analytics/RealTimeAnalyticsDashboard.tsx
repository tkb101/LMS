import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, Activity, TrendingUp, Clock, AlertTriangle, 
  BookOpen, Target, Zap, Eye, MousePointer 
} from 'lucide-react';

interface RealTimeMetrics {
  active_users: number;
  page_views: number;
  interactions: number;
  interaction_rate: number;
  avg_session_time: number;
  course_engagement: Array<{
    course_id: string;
    avg_progress: number;
    active_students: number;
  }>;
  timestamp: string;
}

interface ProgressData {
  total_learning_paths: number;
  completed_paths: number;
  in_progress_paths: number;
  completion_rate: number;
  average_progress: number;
  recent_completions: Array<{
    user_id: string;
    learning_path_id: string;
    progress: number;
    completed_at: string | null;
  }>;
  timestamp: string;
}

interface PredictiveAlert {
  type: string;
  user_id: string;
  risk_level: 'low' | 'medium' | 'high';
  risk_score?: number;
  recommendation: string;
  last_activity?: string;
  activity_count?: number;
}

interface StreamData {
  timestamp: string;
  active_users: number;
  page_views: number;
  interactions: number;
  interaction_rate: number;
  avg_session_time: number;
}

const RealTimeAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([]);
  const [streamData, setStreamData] = useState<StreamData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket connection for real-time updates
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      const websocket = new WebSocket('ws://localhost:8000/ws/analytics/admin');
      
      websocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        
        // Subscribe to analytics channels
        websocket.send(JSON.stringify({
          type: 'subscribe',
          channels: ['engagement', 'progress', 'alerts']
        }));
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      };

      setWs(websocket);
    } catch (err) {
      console.error('Failed to connect WebSocket:', err);
      setError('Failed to connect to real-time updates');
    }
  }, []);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'live_update':
        if (data.engagement) {
          setMetrics(data.engagement);
        }
        if (data.progress) {
          setProgressData(data.progress);
        }
        break;
      
      case 'user_event':
        // Update stream data with new event
        updateStreamData(data);
        break;
      
      case 'alert':
        setAlerts(prev => [data.alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
        break;
    }
  };

  const updateStreamData = (eventData: any) => {
    const now = new Date().toISOString();
    setStreamData(prev => {
      const newData = [...prev, {
        timestamp: now,
        active_users: metrics?.active_users || 0,
        page_views: metrics?.page_views || 0,
        interactions: metrics?.interactions || 0,
        interaction_rate: metrics?.interaction_rate || 0,
        avg_session_time: metrics?.avg_session_time || 0
      }];
      
      // Keep only last 20 data points
      return newData.slice(-20);
    });
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch engagement metrics
      const metricsResponse = await fetch('/api/v1/realtime-analytics/engagement-metrics?timeframe=1h');
      const metricsData = await metricsResponse.json();
      if (metricsData.status === 'success') {
        setMetrics(metricsData.metrics);
      }

      // Fetch progress data
      const progressResponse = await fetch('/api/v1/realtime-analytics/progress-tracking');
      const progressResult = await progressResponse.json();
      if (progressResult.status === 'success') {
        setProgressData(progressResult.data);
      }

      // Fetch alerts
      const alertsResponse = await fetch('/api/v1/realtime-analytics/predictive-alerts');
      const alertsResult = await alertsResponse.json();
      if (alertsResult.status === 'success') {
        setAlerts(alertsResult.alerts);
      }

    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  // Polling for stream data
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/v1/realtime-analytics/stream/engagement?timeframe=5m');
        const result = await response.json();
        if (result.status === 'success') {
          setStreamData(prev => [...prev.slice(-19), result.data]);
        }
      } catch (err) {
        console.error('Error fetching stream data:', err);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading real-time analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-900">Real-Time Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.active_users || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.page_views || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MousePointer className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Interactions</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.interactions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(metrics?.avg_session_time || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={streamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="active_users" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Active Users"
              />
              <Line 
                type="monotone" 
                dataKey="interaction_rate" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Interaction Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-lg font-semibold text-green-600">
                {progressData?.completion_rate?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressData?.completion_rate || 0}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{progressData?.total_learning_paths || 0}</p>
                <p className="text-xs text-gray-600">Total Paths</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{progressData?.completed_paths || 0}</p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{progressData?.in_progress_paths || 0}</p>
                <p className="text-xs text-gray-600">In Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Engagement and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Engagement */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Engagement</h3>
          <div className="space-y-3">
            {metrics?.course_engagement?.slice(0, 5).map((course, index) => (
              <div key={course.course_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Course {course.course_id}</p>
                  <p className="text-sm text-gray-600">{course.active_students} active students</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">{course.avg_progress.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600">avg progress</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Alerts</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No alerts at this time</p>
            ) : (
              alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.risk_level)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{alert.type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm mt-1">{alert.recommendation}</p>
                      <p className="text-xs mt-2">User: {alert.user_id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                      alert.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.risk_level.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Completions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Learning Path
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {progressData?.recent_completions?.slice(0, 5).map((completion, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {completion.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {completion.learning_path_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${completion.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{completion.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {completion.completed_at ? 
                      new Date(completion.completed_at).toLocaleString() : 
                      'In Progress'
                    }
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

export default RealTimeAnalyticsDashboard;