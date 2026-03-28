export interface VedicMathModule {
  id: string;
  title: string;
  description: string;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pointsReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  accuracy?: number;
  isPremium: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface ModuleProgress {
  moduleId: string;
  phase: 'learn' | 'practice' | 'understand' | 'completed';
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
}