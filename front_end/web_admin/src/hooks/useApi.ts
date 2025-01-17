import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vocabularyApi, exerciseApi } from '../api'
import { Vocabulary, Exercise } from '../types'

export const useVocabulary = () => {
  const queryClient = useQueryClient()

  const vocabularyQuery = useQuery({
    queryKey: ['vocabulary'],
    queryFn: vocabularyApi.getAll
  })

  const createVocabulary = useMutation({
    mutationFn: vocabularyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] })
    }
  })

  const updateVocabulary = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Vocabulary> }) => vocabularyApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] })
    }
  })

  const deleteVocabulary = useMutation({
    mutationFn: vocabularyApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] })
    }
  })

  return {
    vocabulary: vocabularyQuery.data || [],
    isLoading: vocabularyQuery.isLoading,
    createVocabulary,
    updateVocabulary,
    deleteVocabulary
  }
}

export const useExercises = () => {
  const queryClient = useQueryClient()

  const exercisesQuery = useQuery({
    queryKey: ['exercises'],
    queryFn: exerciseApi.getAll
  })

  const createExercise = useMutation({
    mutationFn: exerciseApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    }
  })

  const updateExercise = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Exercise> }) => exerciseApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    }
  })

  const deleteExercise = useMutation({
    mutationFn: exerciseApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    }
  })

  return {
    exercises: exercisesQuery.data || [],
    isLoading: exercisesQuery.isLoading,
    createExercise,
    updateExercise,
    deleteExercise
  }
}
