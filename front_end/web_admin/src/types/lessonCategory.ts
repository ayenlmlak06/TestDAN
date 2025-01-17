import { ApiResponse } from './auth'

export interface LessonCategory {
  Id: string
  Name: string
  Thumbnail: string
}

export type LessonCategoryResponse = ApiResponse<LessonCategory[]>
export type SingleLessonCategoryResponse = ApiResponse<LessonCategory>

export interface CreateLessonCategoryRequest {
  Name: string
  Thumbnail: File
}

export interface UpdateLessonCategoryRequest {
  Name: string
  Thumbnail?: File
}
