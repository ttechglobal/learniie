'use client'
import { useModeStore } from '@/stores/modeStore'
import { clsx } from 'clsx'

export function ModeToggle() {
  const { activeView, setActiveView } = useModeStore()
  return (
    <div className="relative z-10 flex justify-center pt-6 px-4">
      <div className="flex bg-white/10 rounded-full p-1 gap-1">
        {['school', 'exam'].map(v => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            className={clsx(
              'px-5 py-1.5 rounded-full text-sm font-bold capitalize transition-all duration-200',
              activeView === v
                ? 'bg-amber text-ink shadow-amber'
                : 'text-white/60 hover:text-white',
            )}
          >
            {v === 'school' ? '🏫 School' : '📋 Exam'}
          </button>
        ))}
      </div>
    </div>
  )
}

export function useModeView(studentMode) {
  const { activeView } = useModeStore()
  if (studentMode === 'school_exam') return activeView
  return studentMode
}