import React, { useState, useEffect } from 'react';
import { 
  Brain, Star, Clock, TrendingUp, BookOpen, Target, 
  ChevronRight, Lightbulb, Award, Users 
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'resource' | 'activity' | 'skill';
  relevance_score: number;
  reasoning: string;
  prerequisites: string[];
  expected_outcomes: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: string;
  category: string;
  tags: string[];
  confidence: number;
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  target_date: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
}

interface SkillGap {
  skill: string;
  current_level: number;
  target_level: number;
  importance: number;
  recommended_resources: string[];
}

const SmartRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['all', 'course', 'resource', 'activity', 'skill'];

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      // Fetch AI-powered recommendations
      const response = await fetch('/api/v1/recommendations/user123?limit=20');
      const result = await response.json();
      
      if (result.recommendations) {
        setRecommendations(result.recommendations);
      }

      // Fetch learning goals (mock data for now)
      setLearningGoals([
        {
          id: '1',
          title: 'Master React Development',
          description: 'Become proficient in React.js and modern frontend development',
          target_date: '2024-06-30',
          progress: 65,
          priority: 'high'
        },
        {
          id: '2',
          title: 'Learn Data Science Fundamentals',
          description: 'Understand statistics, Python, and machine learning basics',
          target_date: '2024-08-15',
          progress: 30,
          priority: 'medium'
        }
      ]);

      // Fetch skill gaps (mock data)
      setSkillGaps([
        {
          skill: 'Machine Learning',
          current_level: 2,
          target_level: 4,
          importance: 9,
          recommended_resources: ['ML Course', 'Python for Data Science', 'Statistics Fundamentals']
        },
        {
          skill: 'Advanced JavaScript',
          current_level: 3,
          target_level: 5,
          importance: 8,
          recommended_resources: ['ES6+ Features', 'Async Programming', 'Design Patterns']
        }
      ]);

    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-5 w-5" />;
      case 'resource': return <Lightbulb className="h-5 w-5" />;
      case 'activity': return <Target className="h-5 w-5" />;
      case 'skill': return <Award className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading smart recommendations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-red-600 mr-2" />
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
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              Smart Recommendations
            </h1>
            <p className="text-gray-600 mt-1">AI-powered personalized learning suggestions</p>
          </div>
          <button
            onClick={fetchRecommendations}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Learning Goals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 text-green-600 mr-2" />
          Learning Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningGoals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">{goal.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                  {goal.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
              <div className="space-y-2">
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
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Target: {new Date(goal.target_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 text-purple-600 mr-2" />
          Skill Gap Analysis
        </h2>
        <div className="space-y-4">
          {skillGaps.map((gap, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{gap.skill}</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Importance:</span>
                  <div className="flex">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < gap.importance ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-sm text-gray-600">Current Level</span>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(gap.current_level / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{gap.current_level}/5</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Target Level</span>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(gap.target_level / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{gap.target_level}/5</span>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 mb-2 block">Recommended Resources:</span>
                <div className="flex flex-wrap gap-2">
                  {gap.recommended_resources.map((resource, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h2>
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {getTypeIcon(recommendation.type)}
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recommendation.difficulty)}`}>
                    {recommendation.difficulty}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">{recommendation.relevance_score}/10</span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{recommendation.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recommendation.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {recommendation.estimated_time}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {recommendation.category}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Why recommended:</strong> {recommendation.reasoning}
                </p>
              </div>

              {recommendation.prerequisites.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs text-gray-600 mb-1 block">Prerequisites:</span>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.prerequisites.slice(0, 3).map((prereq, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <span className="text-xs text-gray-600 mb-1 block">Expected Outcomes:</span>
                <ul className="text-xs text-gray-700 space-y-1">
                  {recommendation.expected_outcomes.slice(0, 2).map((outcome, idx) => (
                    <li key={idx} className="flex items-start">
                      <ChevronRight className="h-3 w-3 mr-1 mt-0.5 text-green-600" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-1 mr-2">
                    <div 
                      className="bg-blue-600 h-1 rounded-full"
                      style={{ width: `${recommendation.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    {Math.round(recommendation.confidence * 100)}% confidence
                  </span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recommendations available for this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartRecommendations;