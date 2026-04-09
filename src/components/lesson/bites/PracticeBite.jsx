'use client'
import { useState } from 'react'
import { clsx } from 'clsx'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
export function PracticeBite({ content, questionNumber=1 }) {
  const [selected, setSelected] = useState(null)
  const answered = selected !== null
  const correct  = selected === content.correct_index
  return (
    <div className="bg-surface rounded-2xl overflow-hidden shadow-card">
      <div className="px-4 py-3 bg-surface2 border-b border-border flex items-center justify-between">
        <p className="text-xs font-bold text-inkLight uppercase tracking-widest">Practice Question {questionNumber}</p>
        <span className="text-lg">{answered ? (correct ? '✅' : '❌') : '❓'}</span>
      </div>
      <div className="p-4">
        <p className="font-semibold text-ink mb-4 leading-relaxed">{content.question}</p>
        <div className="flex flex-col gap-2">
          {content.options.map((opt, i) => {
            const isSel  = selected === i
            const isCorr = i === content.correct_index
            return (
              <button key={i} onClick={() => !answered && setSelected(i)} disabled={answered}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-xl border-[1.5px] text-sm font-medium transition-all',
                  !answered && !isSel && 'border-border hover:border-brand/40 hover:bg-brandLight/30',
                  !answered &&  isSel && 'border-brand bg-brandLight',
                  answered && isCorr                 && 'border-brand bg-brandLight text-brand font-bold',
                  answered && isSel && !isCorr       && 'border-red-400 bg-red-50 text-red-700',
                  answered && !isSel && !isCorr      && 'border-border opacity-40',
                )}>
                <span className="flex items-center gap-3">
                  <span className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0',
                    !answered && isSel ? 'bg-brand text-white' : 'bg-surface2 text-inkLight',
                    answered && isCorr ? 'bg-brand text-white' : '',
                    answered && isSel && !isCorr ? 'bg-red-500 text-white' : '',
                  )}>
                    {answered && isCorr ? '✓' : answered && isSel && !isCorr ? '✗' : String.fromCharCode(65+i)}
                  </span>
                  {opt}
                </span>
              </button>
            )
          })}
        </div>
        {answered && (
          <div className={clsx('mt-4 rounded-xl p-3 flex gap-3 items-start animate-fade-up', correct ? 'bg-brandLight' : 'bg-red-50')}>
            <div className="flex-shrink-0"><LearniiBuddy size={40} expression={correct ? 'celebrating' : 'encouraging'} /></div>
            <div>
              <p className={clsx('font-bold text-sm mb-0.5', correct ? 'text-brand' : 'text-red-700')}>
                {correct ? 'Correct! Well done! 🎉' : 'Not quite — but you got this! 💪'}
              </p>
              <p className={clsx('text-xs leading-relaxed', correct ? 'text-brand/80' : 'text-red-600')}>{content.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
