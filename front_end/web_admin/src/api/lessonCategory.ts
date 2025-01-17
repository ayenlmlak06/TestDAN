import api from './axios'
import type {
  LessonCategoryResponse,
  SingleLessonCategoryResponse,
  CreateLessonCategoryRequest,
  UpdateLessonCategoryRequest
} from '../types/lessonCategory'

export const lessonCategoryApi = {
  getAll: async () => {
    const response = await api.get<LessonCategoryResponse>('/lessoncategories')
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<SingleLessonCategoryResponse>(`/lessoncategories/${id}`)
    return response.data
  },

  create: async (data: CreateLessonCategoryRequest) => {
    const formData = new FormData()
    formData.append('Name', data.Name)
    formData.append('Thumbnail', data.Thumbnail)

    const response = await api.post<SingleLessonCategoryResponse>('/lessoncategories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  update: async (id: string, data: UpdateLessonCategoryRequest) => {
    const formData = new FormData()
    formData.append('Name', data.Name)
    if (data.Thumbnail) {
      formData.append('Thumbnail', data.Thumbnail)
    }

    const response = await api.put<SingleLessonCategoryResponse>(`/lessoncategories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete<SingleLessonCategoryResponse>(`/lessoncategories/${id}`)
    return response.data
  }
}
