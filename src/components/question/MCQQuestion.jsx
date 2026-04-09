// components/question/MCQQuestion.jsx
'use client'

import { clsx } from 'clsx'

/**
 * A multiple-choice question card used in practice and mock sessions.
 * @param {object} question - { question, options, correct_index, explanation, source_label }
 * @param {number|null} selectedIndex - index of user's chosen answer, null if unanswered
 * @param {function} onSelect - called with the selected index
 * @param {boolean} showResult - reveal correct/wrong state
 */
export function MCQQuestion({ question, selectedIndex, onSelect, showResult = false }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      {/* Source label for past questions */}
      {question.source_label && (
        <p className="text-xs font-bold uppercase tracking-wide text-textMuted mb-2">
          {question.source_label}
        </p>
      )}

      <p className="font-semibold text-textPrimary mb-4 leading-relaxed">
        {question.question}
      </p>

      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isSelected = selectedIndex === i
          const isCorrect  = i === question.correct_index

          return (
            <button
              key={i}
              onClick={() => !showResult && onSelect?.(i)}
              disabled={showResult}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150',
                // Default (unanswered)
                !showResult && 'border-border hover:border-primary/40 hover:bg-primaryLight/30',
                // Correct answer highlight
                showResult && isCorrect && 'border-primary bg-primaryLight text-primaryDark',
                // Wrong selected answer
                showResult && isSelected && !isCorrect && 'border-red-400 bg-red-50 text-red-700',
                // Unselected wrong options (dim)
                showResult && !isSelected && !isCorrect && 'border-border opacity-40',
              )}
            >
              <span className="flex items-center gap-2">
                <span className="font-black text-xs w-4">{String.fromCharCode(65 + i)}.</span>
                <span className="flex-1">{option}</span>
                {showResult && isCorrect  && <span className="ml-auto">✓</span>}
                {showResult && isSelected && !isCorrect && <span className="ml-auto">✗</span>}
              </span>
            </button>
          )
        })}
      </div>

      {showResult && question.explanation && (
        <div className={clsx(
          'mt-4 p-3 rounded-xl text-sm leading-relaxed',
          selectedIndex === question.correct_index
            ? 'bg-primaryLight text-primaryDark'
            : 'bg-red-50 text-red-700',
        )}>
          <span className="font-bold">
            {selectedIndex === question.correct_index ? '✓ Correct! ' : '✗ Not quite. '}
          </span>
          {question.explanation}
        </div>
      )}
    </div>
  )
}
