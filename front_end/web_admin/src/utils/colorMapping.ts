type PresetColorType =
  | 'magenta'
  | 'red'
  | 'volcano'
  | 'orange'
  | 'gold'
  | 'lime'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'geekblue'
  | 'purple'

type ColorMapping = {
  [key: string]: PresetColorType
}

const typeColors: ColorMapping = {
  'multiple-choice': 'blue',
  'fill-in-blank': 'green'
}

const difficultyColors: ColorMapping = {
  easy: 'green',
  medium: 'gold',
  hard: 'red'
}

const categoryColors: ColorMapping = {
  vocabulary: 'purple',
  grammar: 'cyan',
  reading: 'magenta',
  listening: 'orange'
}

export const getTypeColor = (type: string): PresetColorType => typeColors[type] || 'blue'
export const getDifficultyColor = (difficulty: string): PresetColorType => difficultyColors[difficulty] || 'blue'
export const getCategoryColor = (category: string): PresetColorType => categoryColors[category] || 'blue'
