export interface Vocabulary {
  id: number
  word: string
  meaning: string
  pronunciation: string
  example: string
  image?: string
}

export interface Exercise {
  id: number
  question: string
  answers: string[]
  correctAnswer: string
  type: 'multiple-choice' | 'fill-in-blank'
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'grammar' | 'vocabulary' | 'reading' | 'listening'
}

export interface DashboardStats {
  vocabularyCount: number
  exerciseCount: number
  activeUsers: number
}

// Add these to your existing types
export interface User {
  name: string
  avatar?: string
  role: 'admin' | 'user'
}

export interface ILessonCategory {
  Id: string
  Name: string
  Thumbnail: string
}
