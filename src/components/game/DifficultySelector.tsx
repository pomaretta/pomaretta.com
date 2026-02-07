'use client'

import { motion } from 'framer-motion'

export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert'

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty
  onSelectDifficulty: (difficulty: Difficulty) => void
}

const difficulties = [
  {
    id: 'easy' as Difficulty,
    label: 'Easy',
    color: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
    selectedColor: 'bg-green-500 text-white border-green-600',
  },
  {
    id: 'normal' as Difficulty,
    label: 'Normal',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
    selectedColor: 'bg-yellow-500 text-white border-yellow-600',
  },
  {
    id: 'hard' as Difficulty,
    label: 'Hard',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30',
    selectedColor: 'bg-orange-500 text-white border-orange-600',
  },
  {
    id: 'expert' as Difficulty,
    label: 'Expert',
    color: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
    selectedColor: 'bg-red-500 text-white border-red-600',
  },
]

export function DifficultySelector({ selectedDifficulty, onSelectDifficulty }: DifficultySelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {difficulties.map((diff) => {
        const isSelected = selectedDifficulty === diff.id

        return (
          <motion.button
            key={diff.id}
            onClick={() => onSelectDifficulty(diff.id)}
            className={`px-6 py-2.5 rounded-full border-2 transition-all duration-200 font-medium ${
              isSelected ? diff.selectedColor : diff.color
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {diff.label}
          </motion.button>
        )
      })}
    </div>
  )
}
