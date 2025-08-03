import React, { useState } from 'react';
import { Plus, Search, Filter, BookOpen, Clock, Users, Target, Edit, Trash2, Eye, Copy, TrendingUp } from 'lucide-react';
import { LearningPath, User } from '../../types';
import { mockLearningPaths } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import LearningPathBuilder from '../LearningPathBuilder';

const LearningPathsPage: React.FC = () => {
  const { user } = useAuth();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(mockLearningPaths);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter learning paths
  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || path.category === filterCategory;
    const matchesDifficulty = !filterDifficulty || path.difficulty === filterDifficulty;
    
    // Show only paths the user can see
    const canView = path.isPublic || 
                   path.createdBy === user?.id || 
                   path.studentId === user?.id ||
                   user?.role === 'admin';
    
    return matchesSearch && matchesCategory && matchesDifficulty && canView;
  });

  const categories = Array.from(new Set(learningPaths.map(p => p.category)));

  const handleSavePath = (pathData: Partial<LearningPath>) => {
    if (editingPath) {
      // Update existing path
      setLearningPaths(prev => prev.map(p => 
        p.id === editingPath.id ? { ...p, ...pathData } : p
      ));
    } else {
      // Create new path
      const newPath: LearningPath = {
        id: `path-${Date.now()}`,
        ...pathData,
        createdBy: user?.id || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: 0,
        enrolledStudents: 0,
        completionRate: 0
      } as LearningPath;
      
      setLearningPaths(prev => [...prev, newPath]);
    }
    
    setShowBuilder(false);
    setEditingPath(null);
  };

  const handleEditPath = (path: LearningPath) => {
    setEditingPath(path);
    setShowBuilder(true);
  };

  const handleDeletePath = (pathId: string) => {
    if (window.confirm('Are you sure you want to delete this learning path?')) {
      setLearningPaths(prev => prev.filter(p => p.id !== pathId));
    }
  };

  const handleDuplicatePath = (path: LearningPath) => {
    const duplicatedPath: LearningPath = {
      ...path,
      id: `path-${Date.now()}`,
      title: `${path.title} (Copy)`,
      createdBy: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      enrolledStudents: 0,
      studentId: undefined // Remove specific student assignment
    };
    
    setLearningPaths(prev => [...prev, duplicatedPath]);
  };

  const canEdit = (path: LearningPath) => {
    return user?.role === 'admin' || path.createdBy === user?.id;
  };

  const canDelete = (path: LearningPath) => {
    return user?.role === 'admin' || path.createdBy === user?.id;
  };

  if (showBuilder) {
    return (
      <LearningPathBuilder
        existingPath={editingPath || undefined}
        onSave={handleSavePath}
        onCancel={() => {
          setShowBuilder(false);
          setEditingPath(null);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
          <p className="text-gray-600 mt-1">Create and manage personalized learning journeys</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button
            onClick={() => setShowBuilder(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Path
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search learning paths..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map(path => (
            <div key={path.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{path.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{path.description}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {path.isTemplate && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Template
                      </span>
                    )}
                    {path.isPublic && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Public
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {path.courses.length} courses
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.estimatedTime}h
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {path.enrolledStudents} enrolled
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {path.completionRate}% completion
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      path.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      path.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {path.difficulty}
                    </span>
                    <span className="text-gray-500">{path.category}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {path.skills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {path.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{path.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar (for student's own paths) */}
                {path.studentId === user?.id && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    {canEdit(path) && (
                      <button
                        onClick={() => handleEditPath(path)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDuplicatePath(path)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {canDelete(path) && (
                      <button
                        onClick={() => handleDeletePath(path.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    {path.studentId === user?.id ? 'Continue' : 'Enroll'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPaths.map(path => (
                  <tr key={path.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">{path.title}</h3>
                          {path.isTemplate && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              Template
                            </span>
                          )}
                          {path.isPublic && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Public
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{path.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            path.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            path.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {path.difficulty}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {path.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {path.courses.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {path.estimatedTime}h
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {path.enrolledStudents}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {path.completionRate}%
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-gray-600 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit(path) && (
                          <button
                            onClick={() => handleEditPath(path)}
                            className="p-1 text-gray-600 hover:text-green-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDuplicatePath(path)}
                          className="p-1 text-gray-600 hover:text-purple-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {canDelete(path) && (
                          <button
                            onClick={() => handleDeletePath(path.id)}
                            className="p-1 text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredPaths.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No learning paths found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory || filterDifficulty
              ? 'Try adjusting your search criteria'
              : 'Create your first learning path to get started'
            }
          </p>
          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <button
              onClick={() => setShowBuilder(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Learning Path
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningPathsPage;