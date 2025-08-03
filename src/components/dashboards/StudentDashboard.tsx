import React, { useState } from 'react';
import { BookOpen, Clock, Star, Play, CheckCircle, Target, TrendingUp, Award } from 'lucide-react';
import { mockCourses, mockLearningPaths, mockProgress } from '../../data/mockData';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'path' | 'progress'>('overview');
  
  const myPath = mockLearningPaths[0];
  const myProgress = mockProgress;
  const enrolledCourses = mockCourses.slice(0, 2);

  const calculateOverallProgress = () => {
    const totalModules = myProgress.length;
    const completedModules = myProgress.filter(p => p.completed).length;
    return totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  };

  const getRecommendations = () => {
    return mockCourses.filter(course => 
      !enrolledCourses.some(enrolled => enrolled.id === course.id)
    ).slice(0, 3);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Emma!</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Courses Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hours Learned</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(myProgress.reduce((sum, p) => sum + p.timeSpent, 0) / 60)}</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(calculateOverallProgress())}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(myProgress.filter(p => p.score).reduce((sum, p) => sum + (p.score || 0), 0) / myProgress.filter(p => p.score).length)}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'courses', label: 'My Courses' },
              { id: 'path', label: 'Learning Path' },
              { id: 'progress', label: 'Progress' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 border-b-2 transition-colors font-medium ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Continue Learning */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Introduction to Machine Learning</h4>
                      <p className="text-green-100 mb-4">Next: Types of Machine Learning</p>
                      <div className="w-64 bg-green-300 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <p className="text-sm text-green-100 mt-2">40% Complete</p>
                    </div>
                    <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Continue</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getRecommendations().map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{course.duration}h</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">40%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'path' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{myPath.title}</h3>
                <p className="text-purple-100 mb-4">{myPath.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{myPath.courses.length}</div>
                    <div className="text-sm text-purple-200">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{myPath.estimatedTime}h</div>
                    <div className="text-sm text-purple-200">Est. Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{myPath.skills.length}</div>
                    <div className="text-sm text-purple-200">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{myPath.progress}%</div>
                    <div className="text-sm text-purple-200">Complete</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Path Courses</h4>
                <div className="space-y-4">
                  {myPath.courses.map((course, index) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {index === 0 ? <CheckCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                        </div>
                      </div>
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{course.title}</h5>
                        <p className="text-sm text-gray-600">{course.description}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {course.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">{course.duration} hours</span>
                        </div>
                      </div>
                      <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        index === 0 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}>
                        {index === 0 ? 'Continue' : 'Locked'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-8">
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Modules Completed</span>
                      <span className="font-semibold text-gray-900">
                        {myProgress.filter(p => p.completed).length} / {myProgress.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Score</span>
                      <span className="font-semibold text-gray-900">
                        {Math.round(myProgress.filter(p => p.score).reduce((sum, p) => sum + (p.score || 0), 0) / myProgress.filter(p => p.score).length)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Time Invested</span>
                      <span className="font-semibold text-gray-900">
                        {Math.round(myProgress.reduce((sum, p) => sum + p.timeSpent, 0) / 60)}h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">First Module Complete</p>
                        <p className="text-sm text-gray-600">Completed your first learning module</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Goal Setter</p>
                        <p className="text-sm text-gray-600">Started a personalized learning path</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Progress */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Progress</h3>
                <div className="space-y-4">
                  {myProgress.map((progress, index) => {
                    const course = mockCourses.find(c => c.id === progress.courseId);
                    const module = course?.modules.find(m => m.id === progress.moduleId);
                    
                    return (
                      <div key={progress.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          progress.completed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {progress.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{module?.title || 'Module'}</h4>
                          <p className="text-sm text-gray-600">{course?.title}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Time spent: {progress.timeSpent} min</span>
                            {progress.score && <span>Score: {progress.score}%</span>}
                            <span>Last accessed: {progress.lastAccessed.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          progress.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {progress.completed ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;