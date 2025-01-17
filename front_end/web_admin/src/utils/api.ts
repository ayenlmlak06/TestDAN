import { faker } from '@faker-js/faker'
import { Vocabulary, Exercise } from '../types'

// Generate fake vocabulary data
export const generateVocabulary = (count: number = 1): Vocabulary[] => {
  return Array.from({ length: count }, () => ({
    id: faker.number.int(),
    word: faker.word.sample(),
    meaning: faker.lorem.sentence(),
    pronunciation: faker.lorem.word(),
    example: faker.lorem.sentence(),
    image: faker.image.url()
  }))
}

// Generate fake exercise data
export const generateExercise = (count: number = 1): Exercise[] => {
  return Array.from({ length: count }, () => ({
    id: faker.number.int(),
    question: faker.lorem.sentence() + '?',
    answers: Array.from({ length: 4 }, () => faker.lorem.words(3)),
    correctAnswer: faker.lorem.words(3),
    type: faker.helpers.arrayElement(['multiple-choice', 'fill-in-blank']),
    difficulty: faker.helpers.arrayElement(['easy', 'medium', 'hard']),
    category: faker.helpers.arrayElement(['vocabulary', 'grammar', 'reading', 'listening'])
  }))
}

// Mock API functions with CRUD operations
export const mockApi = {
  vocabulary: {
    getAll: () => Promise.resolve(vocabularyData),
    getById: (id: number) => {
      const item = vocabularyData.find((v) => v.id === id)
      return Promise.resolve(item || null)
    },
    create: (data: Omit<Vocabulary, 'id'>) => {
      const newItem = { ...data, id: faker.number.int() }
      vocabularyData = [...vocabularyData, newItem]
      return Promise.resolve(newItem)
    },
    update: (id: number, data: Partial<Vocabulary>) => {
      vocabularyData = vocabularyData.map((item) => (item.id === id ? { ...item, ...data } : item))
      return Promise.resolve(vocabularyData.find((item) => item.id === id)!)
    },
    delete: (id: number) => {
      vocabularyData = vocabularyData.filter((item) => item.id !== id)
      return Promise.resolve({ success: true })
    }
  },
  exercises: {
    getAll: () => Promise.resolve(exerciseData),
    getById: (id: number) => {
      const item = exerciseData.find((e) => e.id === id)
      return Promise.resolve(item || null)
    },
    create: (data: Omit<Exercise, 'id'>) => {
      const newItem = { ...data, id: faker.number.int() }
      exerciseData = [...exerciseData, newItem]
      return Promise.resolve(newItem)
    },
    update: (id: number, data: Partial<Exercise>) => {
      exerciseData = exerciseData.map((item) => (item.id === id ? { ...item, ...data } : item))
      return Promise.resolve(exerciseData.find((item) => item.id === id)!)
    },
    delete: (id: number) => {
      exerciseData = exerciseData.filter((item) => item.id !== id)
      return Promise.resolve({ success: true })
    }
  }
}

// In-memory storage
let vocabularyData = generateVocabulary(20)
let exerciseData = generateExercise(15)