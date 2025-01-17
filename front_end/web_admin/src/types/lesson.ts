import { ApiResponse } from './auth'

export interface Lesson {
  Id: string
  Title: string
  TotalQuestion: number
  TotalView: number
  LessonCategoryName: string
  Thumbnail: string | null
}

export interface LessonDetail extends Lesson {
  LessonCategoryId: string
  Grammars: Grammar[]
  Vocabularies: Vocabulary[]
  Questions: Question[]
}

export interface Grammar {
  Id?: string
  Content: string
  Note: string
}

export interface Vocabulary {
  Id?: string
  Word: string
  Pronunciation: string
  Meaning: string
  Example: string
  Medias: string[]
}

export interface Question {
  Id?: string
  Content: string
  Answers: Answer[]
}

export interface Answer {
  Id?: string
  Content: string
  IsCorrect: boolean
}

export interface CreateLessonRequest {
  Id?: string
  Title: string
  LessonCategoryId: string
  Thumbnail: string
  Grammars?: Grammar[]
  Vocabularies?: Vocabulary[]
  Questions: {
    Content: string
    Answers: {
      Content: string
      IsCorrect: boolean
    }[]
  }[]
}

export type LessonResponse = ApiResponse<Lesson[]>
export type LessonDetailResponse = ApiResponse<LessonDetail>
