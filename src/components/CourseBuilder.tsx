import React, { useState, useEffect } from 'react';
import { 
  Plus, X, Save, Eye, Upload, FileText, Video, Image, Link, 
  Clock, Users, Star, Tag, BookOpen, ChevronDown, ChevronUp,
  Play, Pause, RotateCcw, Settings, Trash2
} from 'lucide-react';
import { Course, Module, Resource } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CourseBuilderProps {
  existingCourse?: Course;
  onSave: (course: Partial<Course>) => void;
  onCancel: () => void;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({
  existingCourse,
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: existingCourse?.title || '',
    description: existingCourse?.description || '',
    instructor: existingCourse?.instructor || user?.name || '',
    instructorId: existingCourse?.instructorId || user?.id || '',
    duration: existingCourse?.duration || 0,
    difficulty: existingCourse?.difficulty || 'beginner',
    category: existingCourse?.category || '',
    subcategory: existingCourse?.subcategory || '',
    thumbnail: existingCourse?.thumbnail || '',
    modules: existingCourse?.modules || [],
    prerequisites: existingCourse?.prerequisites || [],
    learningObjectives: existingCourse?.learningObjectives || [],
    tags: existingCourse?.tags || [],
    price: existingCourse?.price || 0,
    language: existingCourse?.language || 'English',
    certificate: existingCourse?.certificate || false,
    estimatedEffort: existingCourse?.estimatedEffort || '',
    isPublished: existingCourse?.isPublished || false
  });

  const [newModule, setNewModule] = useState<Partial<Module>>({
    title: '',
    description: '',
    content: '',
    type: 'video',
    duration: 0,
    resources: [],
    isRequired: true
  });

  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');

  // Calculate total duration when modules change
  useEffect(() => {
    const totalDuration = courseData.modules?.reduce((sum, module) => sum + (module.duration || 0), 0) || 0;
    setCourseData(prev => ({ ...prev, duration: totalDuration }));
  }, [courseData.modules]);

  const categories = [
    'Computer Science', 'Data Science', 'Web Development', 'Mobile Development',
    'Design', 'Business', 'Marketing', 'Photography', 'Music', 'Language Learning'
  ];

  const subcategories = {
    'Computer Science': ['Programming', 'Algorithms', 'Data Structures', 'Software Engineering', 'Artificial Intelligence'],
    'Data Science': ['Machine Learning', 'Data Analysis', 'Statistics', 'Visualization', 'Big Data'],
    'Web Development': ['Frontend', 'Backend', 'Full Stack', 'JavaScript', 'React', 'Node.js'],
    'Mobile Development': ['iOS', 'Android', 'React Native', 'Flutter', 'Xamarin'],
    'Design': ['UI/UX', 'Graphic Design', 'Web Design', 'Product Design', 'Branding'],
    'Business': ['Management', 'Entrepreneurship', 'Finance', 'Strategy', 'Leadership'],
    'Marketing': ['Digital Marketing', 'Content Marketing', 'SEO', 'Social Media', 'Email Marketing']
  };

  const moduleTypes = [
    { value: 'video', label: 'Video Lecture', icon: Video },
    { value: 'reading', label: 'Reading Material', icon: FileText },
    { value: 'quiz', label: 'Quiz/Assessment', icon: BookOpen },
    { value: 'assignment', label: 'Assignment', icon: FileText },
    { value: 'discussion', label: 'Discussion', icon: Users }
  ];

  const addModule = () => {
    if (!newModule.title || !newModule.description) {
      alert('Please fill in module title and description');
      return;
    }

    const moduleToAdd: Module = {
      id: `module-${Date.now()}`,
      title: newModule.title!,
      description: newModule.description!,
      content: newModule.content || '',
      type: newModule.type as any,
      duration: newModule.duration || 0,
      order: (courseData.modules?.length || 0) + 1,
      resources: newModule.resources || [],
      isRequired: newModule.isRequired || true
    };

    if (editingModuleIndex !== null) {
      // Update existing module
      const updatedModules = [...(courseData.modules || [])];
      updatedModules[editingModuleIndex] = moduleToAdd;
      setCourseData(prev => ({ ...prev, modules: updatedModules }));
      setEditingModuleIndex(null);
    } else {
      // Add new module
      setCourseData(prev => ({
        ...prev,
        modules: [...(prev.modules || []), moduleToAdd]
      }));
    }

    // Reset form
    setNewModule({
      title: '',
      description: '',
      content: '',
      type: 'video',
      duration: 0,
      resources: [],
      isRequired: true
    });
    setShowModuleForm(false);
  };

  const editModule = (index: number) => {
    const module = courseData.modules?.[index];
    if (module) {
      setNewModule(module);
      setEditingModuleIndex(index);
      setShowModuleForm(true);
    }
  };

  const deleteModule = (index: number) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      const updatedModules = courseData.modules?.filter((_, i) => i !== index) || [];
      // Reorder modules
      const reorderedModules = updatedModules.map((module, i) => ({
        ...module,
        order: i + 1
      }));
      setCourseData(prev => ({ ...prev, modules: reorderedModules }));
    }
  };

  const moveModule = (index: number, direction: 'up' | 'down') => {
    const modules = [...(courseData.modules || [])];
    if (direction === 'up' && index > 0) {
      [modules[index], modules[index - 1]] = [modules[index - 1], modules[index]];
    } else if (direction === 'down' && index < modules.length - 1) {
      [modules[index], modules[index + 1]] = [modules[index + 1], modules[index]];
    }
    
    // Update order numbers
    const reorderedModules = modules.map((module, i) => ({
      ...module,
      order: i + 1
    }));
    
    setCourseData(prev => ({ ...prev, modules: reorderedModules }));
  };

  const addTag = () => {
    if (newTag.trim() && !courseData.tags?.includes(newTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !courseData.prerequisites?.includes(newPrerequisite.trim())) {
      setCourseData(prev => ({
        ...prev,
        prerequisites: [...(prev.prerequisites || []), newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (prerequisite: string) => {
    setCourseData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites?.filter(p => p !== prerequisite) || []
    }));
  };

  const addObjective = () => {
    if (newObjective.trim() && !courseData.learningObjectives?.includes(newObjective.trim())) {
      setCourseData(prev => ({
        ...prev,
        learningObjectives: [...(prev.learningObjectives || []), newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (objective: string) => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives?.filter(o => o !== objective) || []
    }));
  };

  const handleSave = () => {
    if (!courseData.title || !courseData.description || !courseData.category) {
      alert('Please fill in all required fields (title, description, category)');
      return;
    }

    if (!courseData.modules || courseData.modules.length === 0) {
      alert('Please add at least one module to the course');
      return;
    }

    const courseToSave = {
      ...courseData,
      createdAt: existingCourse?.createdAt || new Date(),
      updatedAt: new Date(),
      enrolledStudents: existingCourse?.enrolledStudents || 0,
      rating: existingCourse?.rating || 0,
      reviews: existingCourse?.reviews || []
    };

    onSave(courseToSave);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BookOpen },
    { id: 'modules', label: 'Modules', icon: Video },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'preview', label: 'Preview', icon: Eye }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {existingCourse ? 'Edit Course' : 'Create New Course'}
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
            Save Course
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe what students will learn in this course"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={courseData.category}
                    onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
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
                    Subcategory
                  </label>
                  <select
                    value={courseData.subcategory}
                    onChange={(e) => setCourseData(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!courseData.category}
                  >
                    <option value="">Select subcategory</option>
                    {courseData.category && subcategories[courseData.category as keyof typeof subcategories]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={courseData.difficulty}
                    onChange={(e) => setCourseData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={courseData.language}
                    onChange={(e) => setCourseData(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Thumbnail URL
                </label>
                <input
                  type="url"
                  value={courseData.thumbnail}
                  onChange={(e) => setCourseData(prev => ({ ...prev, thumbnail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courseData.tags?.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prerequisites
                </label>
                <div className="flex gap-2 mb-2">
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
                  {courseData.prerequisites?.map(prerequisite => (
                    <div
                      key={prerequisite}
                      className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded"
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

              {/* Learning Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objectives
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add a learning objective"
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
                  {courseData.learningObjectives?.map(objective => (
                    <div
                      key={objective}
                      className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded"
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
          </div>
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Course Modules</h3>
            <button
              onClick={() => setShowModuleForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Module
            </button>
          </div>

          {/* Module Form */}
          {showModuleForm && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                {editingModuleIndex !== null ? 'Edit Module' : 'Add New Module'}
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    value={newModule.title}
                    onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter module title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Type
                  </label>
                  <select
                    value={newModule.type}
                    onChange={(e) => setNewModule(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {moduleTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newModule.description}
                    onChange={(e) => setNewModule(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what this module covers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newModule.duration}
                    onChange={(e) => setNewModule(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newModule.isRequired}
                      onChange={(e) => setNewModule(prev => ({ ...prev, isRequired: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Required module</span>
                  </label>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newModule.content}
                    onChange={(e) => setNewModule(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter module content, instructions, or embed code"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowModuleForm(false);
                    setEditingModuleIndex(null);
                    setNewModule({
                      title: '',
                      description: '',
                      content: '',
                      type: 'video',
                      duration: 0,
                      resources: [],
                      isRequired: true
                    });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addModule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingModuleIndex !== null ? 'Update Module' : 'Add Module'}
                </button>
              </div>
            </div>
          )}

          {/* Modules List */}
          <div className="space-y-4">
            {courseData.modules?.map((module, index) => (
              <div key={module.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveModule(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveModule(index, 'down')}
                        disabled={index === (courseData.modules?.length || 0) - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {moduleTypes.find(t => t.value === module.type)?.icon && (
                        <moduleTypes.find(t => t.value === module.type)!.icon className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                      <p className="text-sm text-gray-600">{module.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration} min
                        </span>
                        <span className="capitalize">{module.type}</span>
                        {module.isRequired && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">Required</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editModule(index)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteModule(index)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {(!courseData.modules || courseData.modules.length === 0) && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                <p className="text-gray-600 mb-4">Add your first module to get started</p>
                <button
                  onClick={() => setShowModuleForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Module
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Price ($)
                </label>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={(e) => setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Weekly Effort
                </label>
                <input
                  type="text"
                  value={courseData.estimatedEffort}
                  onChange={(e) => setCourseData(prev => ({ ...prev, estimatedEffort: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 3-4 hours per week"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={courseData.certificate}
                    onChange={(e) => setCourseData(prev => ({ ...prev, certificate: e.target.checked }))}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700">Offer completion certificate</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={courseData.isPublished}
                    onChange={(e) => setCourseData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700">Publish course immediately</span>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Course Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Modules:</span>
                  <span className="font-medium text-blue-900">{courseData.modules?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Duration:</span>
                  <span className="font-medium text-blue-900">{Math.floor((courseData.duration || 0) / 60)}h {(courseData.duration || 0) % 60}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Prerequisites:</span>
                  <span className="font-medium text-blue-900">{courseData.prerequisites?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Learning Objectives:</span>
                  <span className="font-medium text-blue-900">{courseData.learningObjectives?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Tags:</span>
                  <span className="font-medium text-blue-900">{courseData.tags?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="relative h-48 bg-gray-200">
              {courseData.thumbnail ? (
                <img
                  src={courseData.thumbnail}
                  alt={courseData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{courseData.title || 'Course Title'}</h1>
                  <p className="text-gray-600">{courseData.description || 'Course description will appear here...'}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">${courseData.price || 0}</div>
                  {courseData.certificate && (
                    <div className="text-sm text-green-600 mt-1">✓ Certificate included</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.floor((courseData.duration || 0) / 60)}h {(courseData.duration || 0) % 60}m
                </span>
                <span className="capitalize">{courseData.difficulty}</span>
                <span>{courseData.language}</span>
                <span>{courseData.modules?.length || 0} modules</span>
              </div>

              {courseData.learningObjectives && courseData.learningObjectives.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">What you'll learn</h3>
                  <ul className="space-y-2">
                    {courseData.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-1">✓</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {courseData.modules && courseData.modules.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Course Content</h3>
                  <div className="space-y-2">
                    {courseData.modules.map((module, index) => (
                      <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{index + 1}.</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{module.title}</h4>
                            <p className="text-sm text-gray-600">{module.description}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {module.duration} min
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBuilder;