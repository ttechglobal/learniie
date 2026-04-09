// components/dashboard/SchoolHome.jsx
'use client'

import { CurriculumPathMap } from './CurriculumPathMap'
import { MockPromptCard } from './MockPromptCard'
import { useAcademicWeek } from '@/lib/hooks/useAcademicWeek'
import { Flame, Star, BookOpen } from 'lucide-react'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function SchoolHome({ student, topics = [] }) {
  const { currentWeek, term, shouldShowMockTestPrompt, shouldShowMockExamPrompt } = useAcademicWeek()

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Greeting */}
      <div className="mb-4">
        <h1 className="font-heading text-2xl font-bold text-textPrimary">
          {greeting()}, {student.display_name.split(' ')[0]} 👋
        </h1>
        {term && (
          <p className="text-sm text-textSecondary mt-0.5">
            Term {term} · Week {currentWeek}
          </p>
        )}
      </div>

      {/* Quick stats strip */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {[
          { icon: Flame, label: `${student.streak_days || 0} day streak`, color: 'text-coral' },
          { icon: Star,    label: `${student.xp || 0} XP`,              color: 'text-amber' },
          { icon: BookOpen,label: `${student.lessons_done || 0} lessons done`, color: 'text-primary' },
        ].map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 bg-surface border border-border rounded-full px-3 py-1.5 flex-shrink-0"
          >
            <Icon size={14} className={color} />
            <span className="text-xs font-bold text-textPrimary">{label}</span>
          </div>
        ))}
      </div>

      {/* Mock prompt card — shown when in prompt window */}
      {(shouldShowMockTestPrompt || shouldShowMockExamPrompt) && (
        <MockPromptCard
          type={shouldShowMockExamPrompt ? 'exam' : 'test'}
          term={term}
          className="mb-5"
        />
      )}

      {/* Curriculum path map */}
      <div className="mb-4">
        <h2 className="font-heading text-lg font-bold text-textPrimary mb-4">
          This Term
        </h2>
        <CurriculumPathMap topics={topics} />
      </div>
    </div>
  )
}
