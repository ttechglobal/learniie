// components/lesson/bites/QuizBite.jsx
'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

export function QuizBite({ content }) {
  const [selected, setSelected] = useState(null)
  const answered = selected !== null
  const correct = selected === content.correct_index

  function handleSelect(i) {
    if (answered) return
    setSelected(i)
  }

  return (
    <div className="bg-surface border-2 border-indigo/20 rounded-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-indigo mb-3">
        Quick Quiz
      </p>
      <p className="font-semibold text-textPrimary mb-4 leading-relaxed">
        {content.question}
      </p>
      <div className="flex flex-col gap-2">
        {content.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={answered}
            className={clsx(
              'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150',
              !answered && 'border-border hover:border-indigo/40 hover:bg-indigo/5',
              answered && i === content.correct_index && 'border-primary bg-primaryLight text-primaryDark',
              answered && i === selected && i !== content.correct_index && 'border-red-400 bg-red-50 text-red-700',
              answered && i !== selected && i !== content.correct_index && 'border-border opacity-50',
            )}
          >
            <span className="flex items-center gap-2">
              <span className="font-black text-xs">{String.fromCharCode(65 + i)}.</span>
              {option}
              {answered && i === content.correct_index && ' ✓'}
              {answered && i === selected && i !== content.correct_index && ' ✗'}
            </span>
          </button>
        ))}
      </div>
      {answered && (
        <div className={clsx(
          'mt-4 p-3 rounded-xl text-sm leading-relaxed',
          correct ? 'bg-primaryLight text-primaryDark' : 'bg-red-50 text-red-700'
        )}>
          <span className="font-bold">{correct ? '✓ Correct! ' : '✗ Not quite. '}</span>
          {content.explanation}
        </div>
      )}
    </div>
  )
}
