// components/question/QuestionFeedback.jsx
'use client'

import { motion, AnimatePresence } from 'motion/react'
import { clsx } from 'clsx'

export function QuestionFeedback({ correct, xpEarned, onNext }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={clsx(
          'fixed bottom-20 left-4 right-4 z-50 rounded-2xl p-4',
          'flex items-center justify-between',
          correct ? 'bg-primaryDark' : 'bg-red-600',
        )}
      >
        <div>
          <p className="font-bold text-white">
            {correct ? `✓ Correct! +${xpEarned} XP` : '✗ Incorrect'}
          </p>
        </div>
        <button
          onClick={onNext}
          className="bg-white/20 hover:bg-white/30 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors"
        >
          Next →
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
