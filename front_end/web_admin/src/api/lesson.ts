import { ApiResponse } from '../types/auth'
import { CreateLessonRequest, LessonDetail } from '../types/lesson'
import api from './axios'

export const lessonApi = {
  getLessons: async (categoryId: string) => {
    const response = await api.get<ApiResponse<LessonDetail[]>>(
      `/lessons?categoryId=${categoryId}&page=1&pageSize=100&isOrderByView=true`
    )
    return response.data
  },

  createLesson: async (data: CreateLessonRequest) => {
    const response = await api.post<ApiResponse<LessonDetail>>('/lessons', data)
    return response.data
  },

  updateLesson: async (id: string, data: CreateLessonRequest) => {
    const response = await api.put<ApiResponse<LessonDetail>>(`/lessons/${id}`, data)
    return response.data
  },

  deleteLesson: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/lessons/${id}`)
    return response.data
  },

  getLesson: async (id: string) => {
    const response = await api.get<ApiResponse<LessonDetail>>(`/lessons/${id}`)
    return response.data
  }
}
