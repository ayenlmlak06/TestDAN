import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonCategoryApi } from '../api/lessonCategory'
import type { CreateLessonCategoryRequest, UpdateLessonCategoryRequest } from '../types/lessonCategory'

export const useLessonCategories = () => {
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['lessonCategories'],
    queryFn: async () => {
      const response = await lessonCategoryApi.getAll()
      return response.Data || []
    }
  })

  const createCategory = useMutation({
    mutationFn: (data: CreateLessonCategoryRequest) => lessonCategoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonCategories'] })
    }
  })

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonCategoryRequest }) => lessonCategoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonCategories'] })
    }
  })

  const deleteCategory = useMutation({
    mutationFn: (id: string) => lessonCategoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonCategories'] })
    }
  })

  return {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
