// components/dashboard/SchoolExamHome.jsx
'use client'

import { useModeStore } from '@/stores/modeStore'
import { SchoolHome } from './SchoolHome'
import { ExamHome } from './ExamHome'
import { clsx } from 'clsx'

export function SchoolExamHome({ student, topics = [], examTopics = [] }) {
  const { activeView, setActiveView } = useModeStore()

  return (
    <div>
      {/* Mode toggle — sticky at top */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border px-4 py-2 flex justify-center">
        <div className="flex bg-surfaceSecondary rounded-full p-1 gap-1">
          {['school', 'exam'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={clsx(
                'px-5 py-1.5 rounded-full text-sm font-bold capitalize transition-all duration-150',
                activeView === view
                  ? 'bg-surface text-textPrimary shadow-sm'
                  : 'text-textMuted',
              )}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {activeView === 'school'
        ? <SchoolHome student={student} topics={topics} />
        : <ExamHome student={student} topics={examTopics} />
      }
    </div>
  )
}
