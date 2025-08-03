export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  permissions: Permission[];
  mfaEnabled: boolean;
  lastLogin?: Date;
  preferences: UserPreferences;
  department?: string;
  skills?: string[];
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  courseUpdates: boolean;
  deadlineReminders: boolean;
  achievements: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  duration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  subcategory?: string;
  thumbnail: string;
  modules: Module[];
  enrolledStudents: number;
  rating: number;
  reviews: Review[];
  prerequisites: string[];
  learningObjectives: string[];
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  price?: number;
  language: string;
  certificate: boolean;
  estimatedEffort: string; // e.g., "3-4 hours per week"
}

export interface Module {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'interactive' | 'discussion';
  duration: number; // in minutes
  order: number;
  resources: Resource[];
  isRequired: boolean;
  unlockConditions?: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'link' | 'document';
  url: string;
  size?: number;
  downloadable: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  studentId?: string; // Optional for template paths
  courses: Course[];
  progress: number;
  estimatedTime: number;
  skills: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isTemplate: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  prerequisites: string[];
  learningObjectives: string[];
  isPublic: boolean;
  enrolledStudents: number;
  completionRate: number;
  adaptiveRules?: AdaptiveRule[];
}

export interface AdaptiveRule {
  id: string;
  condition: string;
  action: 'recommend' | 'require' | 'skip' | 'unlock';
  targetCourseId: string;
  priority: number;
}

export interface Progress {
  id: string;
  studentId: string;
  courseId: string;
  moduleId?: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  lastAccessed: Date;
  attempts: number;
  feedback?: string;
  achievements: Achievement[];
  milestones: Milestone[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  points: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  completed: boolean;
  completedAt?: Date;
}

export interface Analytics {
  totalStudents: number;
  totalCourses: number;
  totalLearningPaths: number;
  completionRate: number;
  averageScore: number;
  engagementTrends: EngagementData[];
  popularCourses: Course[];
  performanceMetrics: PerformanceMetric[];
  predictiveInsights: PredictiveInsight[];
  riskStudents: RiskStudent[];
}

export interface EngagementData {
  date: string;
  activeUsers: number;
  completions: number;
  newEnrollments: number;
  averageSessionTime: number;
  dropoffRate: number;
}

export interface PerformanceMetric {
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

export interface PredictiveInsight {
  id: string;
  type: 'completion_risk' | 'performance_decline' | 'engagement_drop' | 'success_prediction';
  studentId?: string;
  courseId?: string;
  confidence: number;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface RiskStudent {
  studentId: string;
  studentName: string;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  recommendations: string[];
  lastActivity: Date;
}

// Assessment and Quiz Types
export interface Assessment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleId?: string;
  type: 'quiz' | 'assignment' | 'project' | 'peer_review';
  questions: Question[];
  timeLimit?: number; // in minutes
  attempts: number;
  passingScore: number;
  isGraded: boolean;
  dueDate?: Date;
  instructions: string;
  rubric?: Rubric;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'code';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Rubric {
  id: string;
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
}

// Notification and Communication Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'course' | 'assignment' | 'system' | 'social';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Discussion {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  posts: DiscussionPost[];
  isLocked: boolean;
  isPinned: boolean;
}

export interface DiscussionPost {
  id: string;
  discussionId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string; // for replies
  likes: number;
  attachments?: string[];
}