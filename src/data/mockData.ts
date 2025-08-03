import { User, Course, LearningPath, Progress, Analytics } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@edu.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    permissions: [
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'courses', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'system', actions: ['configure'] }
    ],
    mfaEnabled: true,
    lastLogin: new Date('2024-01-22T09:30:00'),
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        courseUpdates: true,
        deadlineReminders: true,
        achievements: true
      }
    },
    department: 'Administration',
    skills: ['Leadership', 'Data Analysis', 'Strategic Planning']
  },
  {
    id: '2',
    name: 'Prof. Michael Rodriguez',
    email: 'michael.r@edu.com',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    permissions: [
      { resource: 'courses', actions: ['create', 'read', 'update'] },
      { resource: 'students', actions: ['read'] },
      { resource: 'assessments', actions: ['create', 'read', 'update', 'grade'] }
    ],
    mfaEnabled: false,
    lastLogin: new Date('2024-01-22T14:15:00'),
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        courseUpdates: true,
        deadlineReminders: true,
        achievements: false
      },
      learningStyle: 'visual'
    },
    department: 'Computer Science',
    skills: ['Machine Learning', 'Python', 'Data Science', 'Teaching']
  },
  {
    id: '3',
    name: 'Emma Thompson',
    email: 'emma.t@student.edu',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    permissions: [
      { resource: 'courses', actions: ['read', 'enroll'] },
      { resource: 'progress', actions: ['read'] },
      { resource: 'discussions', actions: ['create', 'read', 'update'] }
    ],
    mfaEnabled: false,
    lastLogin: new Date('2024-01-22T16:45:00'),
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        courseUpdates: true,
        deadlineReminders: true,
        achievements: true
      },
      learningStyle: 'kinesthetic'
    },
    skills: ['JavaScript', 'React', 'Problem Solving']
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning with hands-on projects and real-world applications.',
    instructor: 'Prof. Michael Rodriguez',
    instructorId: '2',
    duration: 40,
    difficulty: 'beginner',
    category: 'Computer Science',
    subcategory: 'Artificial Intelligence',
    thumbnail: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    modules: [
      {
        id: '1-1',
        title: 'What is Machine Learning?',
        description: 'Overview of ML concepts and applications',
        content: 'Machine learning is a subset of artificial intelligence...',
        type: 'video',
        duration: 45,
        order: 1,
        resources: [
          {
            id: 'r1-1',
            title: 'ML Introduction Slides',
            type: 'pdf',
            url: '/resources/ml-intro-slides.pdf',
            size: 2048,
            downloadable: true
          }
        ],
        isRequired: true
      },
      {
        id: '1-2',
        title: 'Types of Machine Learning',
        description: 'Supervised, unsupervised, and reinforcement learning',
        content: 'There are three main types of machine learning...',
        type: 'reading',
        duration: 30,
        order: 2,
        resources: [],
        isRequired: true
      }
    ],
    enrolledStudents: 128,
    rating: 4.8,
    reviews: [
      {
        id: 'rev1',
        userId: '3',
        userName: 'Emma Thompson',
        rating: 5,
        comment: 'Excellent introduction to ML concepts. Very well structured!',
        createdAt: new Date('2024-01-15'),
        helpful: 12
      }
    ],
    prerequisites: ['Basic Programming', 'Statistics Fundamentals'],
    learningObjectives: [
      'Understand core ML concepts',
      'Implement basic ML algorithms',
      'Evaluate model performance'
    ],
    tags: ['machine-learning', 'ai', 'python', 'beginner'],
    isPublished: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    price: 99,
    language: 'English',
    certificate: true,
    estimatedEffort: '3-4 hours per week'
  },
  {
    id: '2',
    title: 'Data Visualization with Python',
    description: 'Master data visualization techniques using matplotlib, seaborn, and plotly.',
    instructor: 'Dr. Sarah Chen',
    instructorId: '1',
    duration: 25,
    difficulty: 'intermediate',
    category: 'Data Science',
    subcategory: 'Visualization',
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    modules: [],
    enrolledStudents: 96,
    rating: 4.6,
    reviews: [],
    prerequisites: ['Python Basics', 'Pandas'],
    learningObjectives: [
      'Create effective data visualizations',
      'Use matplotlib and seaborn',
      'Build interactive plots with plotly'
    ],
    tags: ['python', 'visualization', 'matplotlib', 'seaborn'],
    isPublished: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    price: 79,
    language: 'English',
    certificate: true,
    estimatedEffort: '2-3 hours per week'
  },
  {
    id: '3',
    title: 'Web Development Fundamentals',
    description: 'Build modern web applications with HTML, CSS, and JavaScript.',
    instructor: 'Prof. Michael Rodriguez',
    instructorId: '2',
    duration: 60,
    difficulty: 'beginner',
    category: 'Web Development',
    subcategory: 'Frontend',
    thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    modules: [],
    enrolledStudents: 204,
    rating: 4.9,
    reviews: [],
    prerequisites: [],
    learningObjectives: [
      'Build responsive web pages',
      'Understand modern JavaScript',
      'Create interactive user interfaces'
    ],
    tags: ['html', 'css', 'javascript', 'frontend', 'beginner'],
    isPublished: true,
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-10'),
    price: 129,
    language: 'English',
    certificate: true,
    estimatedEffort: '4-5 hours per week'
  }
];

export const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Data Science Mastery',
    description: 'Complete path from beginner to advanced data scientist',
    studentId: '3',
    courses: [mockCourses[1], mockCourses[0]],
    progress: 65,
    estimatedTime: 65,
    skills: ['Python', 'Machine Learning', 'Data Visualization', 'Statistics'],
    createdBy: '2',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    isTemplate: false,
    difficulty: 'intermediate',
    category: 'Data Science',
    prerequisites: ['Basic Programming'],
    learningObjectives: [
      'Master data analysis techniques',
      'Build machine learning models',
      'Create compelling visualizations'
    ],
    isPublic: false,
    enrolledStudents: 1,
    completionRate: 65
  },
  {
    id: '2',
    title: 'Full Stack Web Developer',
    description: 'Comprehensive path to become a full-stack web developer',
    courses: [mockCourses[2]],
    progress: 0,
    estimatedTime: 120,
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Database'],
    createdBy: '1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    isTemplate: true,
    difficulty: 'beginner',
    category: 'Web Development',
    prerequisites: [],
    learningObjectives: [
      'Build responsive web applications',
      'Develop backend APIs',
      'Deploy applications to production'
    ],
    isPublic: true,
    enrolledStudents: 45,
    completionRate: 78
  }
];

export const mockProgress: Progress[] = [
  {
    id: '1',
    studentId: '3',
    courseId: '1',
    moduleId: '1-1',
    completed: true,
    score: 92,
    timeSpent: 50,
    lastAccessed: new Date('2024-01-20'),
    attempts: 1,
    feedback: 'Excellent understanding of ML concepts!',
    achievements: [
      {
        id: 'ach1',
        title: 'First Module Complete',
        description: 'Completed your first learning module',
        icon: '🎯',
        earnedAt: new Date('2024-01-20'),
        points: 10
      }
    ],
    milestones: [
      {
        id: 'mil1',
        title: 'Video Completion',
        description: 'Watch all video content',
        targetValue: 1,
        currentValue: 1,
        completed: true,
        completedAt: new Date('2024-01-20')
      }
    ]
  },
  {
    id: '2',
    studentId: '3',
    courseId: '1',
    moduleId: '1-2',
    completed: false,
    timeSpent: 15,
    lastAccessed: new Date('2024-01-22'),
    attempts: 0,
    achievements: [],
    milestones: [
      {
        id: 'mil2',
        title: 'Reading Progress',
        description: 'Complete reading assignment',
        targetValue: 1,
        currentValue: 0.5,
        completed: false
      }
    ]
  }
];

export const mockAnalytics: Analytics = {
  totalStudents: 1247,
  totalCourses: 89,
  totalLearningPaths: 156,
  completionRate: 78.5,
  averageScore: 86.2,
  engagementTrends: [
    { date: '2024-01-15', activeUsers: 234, completions: 45, newEnrollments: 12, averageSessionTime: 45, dropoffRate: 12.5 },
    { date: '2024-01-16', activeUsers: 267, completions: 52, newEnrollments: 18, averageSessionTime: 48, dropoffRate: 11.8 },
    { date: '2024-01-17', activeUsers: 298, completions: 61, newEnrollments: 23, averageSessionTime: 52, dropoffRate: 10.2 },
    { date: '2024-01-18', activeUsers: 312, completions: 58, newEnrollments: 15, averageSessionTime: 47, dropoffRate: 13.1 },
    { date: '2024-01-19', activeUsers: 345, completions: 67, newEnrollments: 29, averageSessionTime: 51, dropoffRate: 9.8 },
    { date: '2024-01-20', activeUsers: 378, completions: 74, newEnrollments: 31, averageSessionTime: 55, dropoffRate: 8.9 },
    { date: '2024-01-21', activeUsers: 401, completions: 82, newEnrollments: 27, averageSessionTime: 49, dropoffRate: 11.3 }
  ],
  popularCourses: mockCourses.slice(0, 3),
  performanceMetrics: [
    { metric: 'Course Completion Rate', value: 78.5, change: 5.2, trend: 'up', period: 'Last 30 days' },
    { metric: 'Average Score', value: 86.2, change: -1.8, trend: 'down', period: 'Last 30 days' },
    { metric: 'Student Engagement', value: 92.1, change: 8.7, trend: 'up', period: 'Last 30 days' },
    { metric: 'Course Satisfaction', value: 4.6, change: 0.3, trend: 'up', period: 'Last 30 days' }
  ],
  predictiveInsights: [
    {
      id: 'pi1',
      type: 'completion_risk',
      studentId: '3',
      courseId: '1',
      confidence: 0.85,
      recommendation: 'Provide additional support for Module 2 concepts',
      priority: 'medium',
      createdAt: new Date('2024-01-22')
    },
    {
      id: 'pi2',
      type: 'success_prediction',
      courseId: '2',
      confidence: 0.92,
      recommendation: 'Course performing well, consider expanding content',
      priority: 'low',
      createdAt: new Date('2024-01-21')
    }
  ],
  riskStudents: [
    {
      studentId: '3',
      studentName: 'Emma Thompson',
      riskLevel: 'medium',
      factors: ['Low engagement in last week', 'Struggling with Module 2'],
      recommendations: ['Schedule 1:1 session', 'Provide additional resources'],
      lastActivity: new Date('2024-01-22')
    }
  ]
};