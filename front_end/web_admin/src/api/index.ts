import { mockApi } from '../utils/api'
import { Vocabulary, Exercise } from '../types'

export const vocabularyApi = {
  getAll: () => mockApi.vocabulary.getAll(),
  getById: (id: number) => mockApi.vocabulary.getById(id),
  create: (data: Omit<Vocabulary, 'id'>) => mockApi.vocabulary.create(data),
  update: (id: number, data: Partial<Vocabulary>) => mockApi.vocabulary.update(id, data),
  delete: (id: number) => mockApi.vocabulary.delete(id)
}

export const exerciseApi = {
  getAll: () => mockApi.exercises.getAll(),
  getById: (id: number) => mockApi.exercises.getById(id),
  create: (data: Omit<Exercise, 'id'>) => mockApi.exercises.create(data),
  update: (id: number, data: Partial<Exercise>) => mockApi.exercises.update(id, data),
  delete: (id: number) => mockApi.exercises.delete(id)
}
