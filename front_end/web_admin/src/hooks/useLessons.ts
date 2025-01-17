import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { lessonApi } from '../api/lesson'
import { message } from 'antd'
import { CreateLessonRequest } from '../types/lesson'

export const useLessons = (categoryId: string) => {
  const queryClient = useQueryClient()

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons', categoryId],
    queryFn: async () => {
      const response = await lessonApi.getLessons(categoryId)
      return response.Data
    },
    enabled: !!categoryId
  })

  const createLesson = useMutation({
    mutationFn: lessonApi.createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', categoryId] })
      message.success('Lesson created successfully')
    },
    onError: () => {
      message.error('Failed to create lesson')
    }
  })

  const updateLesson = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateLessonRequest }) => lessonApi.updateLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', categoryId] })
      message.success('Lesson updated successfully')
    },
    onError: () => {
      message.error('Failed to update lesson')
    }
  })

  const deleteLesson = useMutation({
    mutationFn: lessonApi.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', categoryId] })
      message.success('Lesson deleted successfully')
    },
    onError: () => {
      message.error('Failed to delete lesson')
    }
  })

  return {
    lessons,
    isLoading,
    createLesson,
    updateLesson,
    deleteLesson
  }
}

export const useLesson = (id: string) => {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonApi.getLesson(id).then((res) => res.Data),
    enabled: !!id
  })
}
