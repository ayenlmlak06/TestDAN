import { useMemo, useState } from 'react'
import { Exercise } from '../types'

const useExerciseFilters = (exercises: Exercise[]) => {
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState<{
    type: string[]
    difficulty: string[]
    category: string[]
  }>({
    type: [],
    difficulty: [],
    category: []
  })

  const filteredExercises = useMemo(() => {
    return exercises?.filter((exercise) => {
      const matchesSearch =
        exercise.question.toLowerCase().includes(searchText.toLowerCase()) ||
        exercise.correctAnswer.toLowerCase().includes(searchText.toLowerCase())
      const matchesType = filters.type.length === 0 || filters.type.includes(exercise.type)
      const matchesDifficulty = filters.difficulty.length === 0 || filters.difficulty.includes(exercise.difficulty)
      const matchesCategory = filters.category.length === 0 || filters.category.includes(exercise.category)

      return matchesSearch && matchesType && matchesDifficulty && matchesCategory
    })
  }, [exercises, searchText, filters])

  const filterOptions = useMemo(
    () => ({
      type: Array.from(new Set(exercises?.map((ex) => ex.type) || [])),
      difficulty: Array.from(new Set(exercises?.map((ex) => ex.difficulty) || [])),
      category: Array.from(new Set(exercises?.map((ex) => ex.category) || []))
    }),
    [exercises]
  )

  return {
    searchText,
    setSearchText,
    filters,
    setFilters,
    filteredExercises,
    filterOptions
  }
}

export default useExerciseFilters
