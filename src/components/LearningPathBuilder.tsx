import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Filter, BookOpen, Clock, Users, Target, ChevronDown, ChevronUp, Save, Eye } from 'lucide-react';
import { Course, LearningPath, User } from '../types';
import { mockCourses } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface LearningPathBuilderProps {
  existingPath?: LearningPath;
  onSave: (path: Partial<LearningPath>) => void;
  onCancel: () => void;
}

const LearningPathBuilder: React.FC<LearningPathBuilderProps> = ({
  existingPath,
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const [pathData, setPathData] = useState<Partial<LearningPath>>({
    title: existingPath?.title || '',
    description: existingPath?.description || '',
    difficulty: existingPath?.difficulty || 'beginner',
    category: existingPath?.category || '',
    courses: existingPath?.courses || [],
    skills: existingPath?.skills || [],
    prerequisites: existingPath?.prerequisites || [],
    learningObjectives: existingPath?.learningObjectives || [],
    isTemplate: existingPath?.isTemplate || false,
    isPublic: existingPath?.isPublic || false,
    estimatedTime: existingPath?.estimatedTime || 0
  });

  const [availableCourses, setAvailableCourses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');

  // Filter available courses
  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || course.category === filterCategory;
    const matchesDifficulty = !filterDifficulty || course.difficulty === filterDifficulty;
    const notAlreadyAdded = !pathData.courses?.some(c => c.id === course.id);
    
    return matchesSearch && matchesCategory && matchesDifficulty && notAlreadyAdded;
  });

  // Calculate total estimated time
  useEffect(() => {
    const totalTime = pathData.courses?.reduce((sum, course) => sum + course.duration, 0) || 0;
    setPathData(prev => ({ ...prev, estimatedTime: totalTime }));
  }, [pathData.courses]);

  const addCourse = (course: Course) => {
    setPathData(prev => ({
      ...prev,
      courses: [...(prev.courses || []), course]
    }));
  };

  const removeCourse = (courseId: string) => {
    setPathData(prev => ({
      ...prev,
      courses: prev.courses?.filter(c => c.id !== courseId) || []
    }));
  };

  const moveCourse = (courseId: string, direction: 'up' | 'down') => {
    const courses = [...(pathData.courses || [])];
    const index = courses.findIndex(c => c.id === courseId);
    
    if (direction === 'up' && index > 0) {
      [courses[index], courses[index - 1]] = [courses[index - 1], courses[index]];
    } else if (direction === 'down' && index < courses.length - 1) {
      [courses[index], courses[index + 1]] = [courses[index + 1], courses[index]];
    }
    
    setPathData(prev => ({ ...prev, courses }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setPathData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setPathData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== skill) || []
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setPathData(prev => ({
        ...prev,
        prerequisites: [...(prev.prerequisites || []), newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (prerequisite: string) => {
    setPathData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites?.filter(p => p !== prerequisite) || []
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setPathData(prev => ({
        ...prev,
        learningObjectives: [...(prev.learningObjectives || []), newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (objective: string) => {
    setPathData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives?.filter(o => o !== objective) || []
    }));
  };

  const handleSave = () => {
    if (!pathData.title || !pathData.description || !pathData.courses?.length) {
      alert('Please fill in all required fields and add at least one course.');
      return;
    }

    const pathToSave = {
      ...pathData,
      createdBy: user?.id || '',
      createdAt: existingPath?.createdAt || new Date(),
      updatedAt: new Date(),
      progress: existingPath?.progress || 0,
      enrolledStudents: existingPath?.enrolledStudents || 0,
      completionRate: existingPath?.completionRate || 0
    };

    onSave(pathToSave);
  };

  const categories = Array.from(new Set(mockCourses.map(c => c.category)));

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {existingPath ? 'Edit Learning Path' : 'Create Learning Path'}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Path
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Path Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Path Title *
                </label>
                <input
                  type="text"
                  value={pathData.title}
                  onChange={(e) => setPathData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter learning path title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={pathData.description}
                  onChange={(e) => setPathData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe what students will learn in this path"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={pathData.difficulty}
                    onChange={(e) => setPathData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={pathData.category}
                    onChange={(e) => setPathData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Time
                  </label>
                  <div className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{pathData.estimatedTime} hours</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={pathData.isTemplate}
                    onChange={(e) => setPathData(prev => ({ ...prev, isTemplate: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Make this a template</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={pathData.isPublic}
                    onChange={(e) => setPathData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Make this public</span>
                </label>
              </div>
            </div>
          </div>

          {/* Course Selection */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Courses ({pathData.courses?.length || 0})</h3>
              <button
                onClick={() => setShowCourseSelector(!showCourseSelector)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Course
              </button>
            </div>

            {/* Course Selector */}
            {showCourseSelector && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search courses..."
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
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredCourses.map(course => (
                    <div key={course.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">{course.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {course.duration}h
                          </span>
                          <span className="capitalize">{course.difficulty}</span>
                          <span>{course.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => addCourse(course)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                  {filteredCourses.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No courses found matching your criteria.</p>
                  )}
                </div>
              </div>
            )}

            {/* Selected Courses */}
            <div className="space-y-3">
              {pathData.courses?.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveCourse(course.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveCourse(course.id, 'down')}
                        disabled={index === (pathData.courses?.length || 0) - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}h
                        </span>
                        <span className="capitalize">{course.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!pathData.courses || pathData.courses.length === 0) && (
                <p className="text-center text-gray-500 py-8">No courses added yet. Click "Add Course" to get started.</p>
              )}
            </div>
          </div>
        </div>

        {/* Path Metadata */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Skills</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {pathData.skills?.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Prerequisites</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  placeholder="Add a prerequisite"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
                />
                <button
                  onClick={addPrerequisite}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {pathData.prerequisites?.map(prerequisite => (
                  <div
                    key={prerequisite}
                    className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                  >
                    <span className="text-sm">{prerequisite}</span>
                    <button
                      onClick={() => removePrerequisite(prerequisite)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Learning Objectives</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Add an objective"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                />
                <button
                  onClick={addObjective}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {pathData.learningObjectives?.map(objective => (
                  <div
                    key={objective}
                    className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                  >
                    <span className="text-sm">{objective}</span>
                    <button
                      onClick={() => removeObjective(objective)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Path Summary */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Path Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Total Courses:</span>
                <span className="font-medium text-blue-900">{pathData.courses?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Estimated Time:</span>
                <span className="font-medium text-blue-900">{pathData.estimatedTime} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Skills Covered:</span>
                <span className="font-medium text-blue-900">{pathData.skills?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Prerequisites:</span>
                <span className="font-medium text-blue-900">{pathData.prerequisites?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathBuilder;