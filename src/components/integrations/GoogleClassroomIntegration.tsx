import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Download, Upload, CheckCircle, AlertCircle, 
  ExternalLink, Calendar, Users, BookOpen, FileText 
} from 'lucide-react';

interface ClassroomCourse {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  created_at: string;
  updated_at: string;
  enrollment_code: string;
  status: string;
  classroom_link: string;
  source: string;
  synced_by: string;
  synced_at: string;
}

interface ClassroomAssignment {
  id: string;
  title: string;
  description: string;
  course_id: string;
  created_at: string;
  updated_at: string;
  due_date: string | null;
  max_points: number;
  work_type: string;
  status: string;
  source: string;
  synced_by: string;
  synced_at: string;
}

interface ClassroomAnalytics {
  course_id: string;
  timeframe: string;
  activity: {
    total_posts: number;
    student_posts: number;
    teacher_posts: number;
    announcements: number;
    assignments_created: number;
    submissions_received: number;
  };
  engagement: {
    active_students: number;
    total_students: number;
    engagement_rate: number;
    avg_posts_per_student: number;
    avg_assignment_completion_time: number;
  };
  assignment_completion: {
    total_assignments: number;
    avg_completion_rate: number;
    on_time_submissions: number;
    late_submissions: number;
    missing_submissions: number;
  };
  timestamp: string;
}

const GoogleClassroomIntegration: React.FC = () => {
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [assignments, setAssignments] = useState<ClassroomAssignment[]>([]);
  const [analytics, setAnalytics] = useState<ClassroomAnalytics | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message);
      setError(null);
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(message);
      setSuccess(null);
      setTimeout(() => setError(null), 5000);
    }
  };

  const syncCourses = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/v1/realtime-analytics/integrations/google-classroom/sync-courses?user_id=admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setCourses(result.courses);
        showMessage(`Successfully synced ${result.courses_synced} courses from Google Classroom`, 'success');
      } else {
        throw new Error(result.error || 'Failed to sync courses');
      }
    } catch (err) {
      console.error('Error syncing courses:', err);
      showMessage('Failed to sync courses from Google Classroom', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const syncAssignments = async (courseId: string) => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/realtime-analytics/integrations/google-classroom/sync-assignments/${courseId}?user_id=admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setAssignments(result.assignments);
        showMessage(`Successfully synced ${result.assignments_synced} assignments`, 'success');
      } else {
        throw new Error(result.error || 'Failed to sync assignments');
      }
    } catch (err) {
      console.error('Error syncing assignments:', err);
      showMessage('Failed to sync assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getAnalytics = async (courseId: string) => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/realtime-analytics/integrations/google-classroom/analytics/${courseId}?timeframe=7d`);
      const result = await response.json();
      
      if (result.course_id) {
        setAnalytics(result);
        showMessage('Analytics data loaded successfully', 'success');
      } else {
        throw new Error(result.error || 'Failed to get analytics');
      }
    } catch (err) {
      console.error('Error getting analytics:', err);
      showMessage('Failed to load analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async (courseId: string) => {
    if (!courseId || !analytics) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/realtime-analytics/integrations/google-classroom/export-analytics/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analytics),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        showMessage(`Successfully exported analytics to Google Classroom`, 'success');
      } else {
        throw new Error(result.error || 'Failed to export analytics');
      }
    } catch (err) {
      console.error('Error exporting analytics:', err);
      showMessage('Failed to export analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    if (courseId) {
      syncAssignments(courseId);
      getAnalytics(courseId);
    }
  };

  useEffect(() => {
    // Load initial data
    syncCourses();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Google Classroom Integration</h1>
            <p className="text-gray-600 mt-1">Sync courses, assignments, and analytics with Google Classroom</p>
          </div>
          <button
            onClick={syncCourses}
            disabled={syncing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Courses'}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Course Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Synced Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedCourse === course.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleCourseSelect(course.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Synced: {new Date(course.synced_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <a
                  href={course.classroom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <>
          {/* Analytics Overview */}
          {analytics && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Course Analytics</h2>
                <button
                  onClick={() => exportAnalytics(selectedCourse)}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Export to Classroom
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Activity Metrics */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Posts</span>
                      <span className="font-medium">{analytics.activity.total_posts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Student Posts</span>
                      <span className="font-medium">{analytics.activity.student_posts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Assignments</span>
                      <span className="font-medium">{analytics.activity.assignments_created}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Submissions</span>
                      <span className="font-medium">{analytics.activity.submissions_received}</span>
                    </div>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Engagement</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Students</span>
                      <span className="font-medium">{analytics.engagement.active_students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Students</span>
                      <span className="font-medium">{analytics.engagement.total_students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Engagement Rate</span>
                      <span className="font-medium">{analytics.engagement.engagement_rate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Posts/Student</span>
                      <span className="font-medium">{analytics.engagement.avg_posts_per_student.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Completion Metrics */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Assignment Completion</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="font-medium">{analytics.assignment_completion.avg_completion_rate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">On Time</span>
                      <span className="font-medium text-green-600">{analytics.assignment_completion.on_time_submissions.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Late</span>
                      <span className="font-medium text-yellow-600">{analytics.assignment_completion.late_submissions.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Missing</span>
                      <span className="font-medium text-red-600">{analytics.assignment_completion.missing_submissions.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assignments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Assignments</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Loading assignments...</span>
              </div>
            ) : assignments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No assignments found for this course</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{assignment.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {assignment.work_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assignment.max_points}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            assignment.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleClassroomIntegration;