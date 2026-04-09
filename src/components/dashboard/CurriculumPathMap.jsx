// components/dashboard/CurriculumPathMap.jsx
'use client'

import { Lock, CheckCircle } from 'lucide-react'
import { clsx } from 'clsx'
import Link from 'next/link'

/**
 * Visual node map of this term's topics in sequence.
 * topic.status: 'complete' | 'in_progress' | 'unlocked' | 'locked'
 */
export function CurriculumPathMap({ topics = [] }) {
  if (topics.length === 0) {
    return (
      <div className="text-center py-12 text-textMuted">
        <p className="text-sm">No topics yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-0 py-2">
      {topics.map((topic, i) => (
        <div key={topic.id} className="flex flex-col items-center w-full">
          {/* Connector line above each node (skip first) */}
          {i > 0 && (
            <div
              className={clsx(
                'w-0.5 h-8',
                topics[i - 1].status === 'complete'
                  ? 'bg-primary'
                  : 'bg-border border-dashed',
              )}
            />
          )}

          {/* Node row */}
          <div className="flex items-center gap-4 w-full max-w-xs">
            {topic.status === 'locked' ? (
              <div className="flex items-center gap-4 w-full opacity-50">
                <NodeCircle topic={topic} />
                <TopicLabel topic={topic} />
              </div>
            ) : (
              <Link
                href={`/learn/${topic.subjectSlug}/${topic.slug}`}
                className="flex items-center gap-4 w-full hover:opacity-80 transition-opacity"
              >
                <NodeCircle topic={topic} />
                <TopicLabel topic={topic} />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function NodeCircle({ topic }) {
  const base = 'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0'

  if (topic.status === 'complete') {
    return (
      <div className={clsx(base, 'bg-primary')}>
        <CheckCircle className="text-white w-6 h-6" />
      </div>
    )
  }
  if (topic.status === 'in_progress') {
    return (
      <div className={clsx(base, 'bg-primary relative')}>
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
        <span className="text-white font-bold text-[10px] relative z-10 uppercase tracking-wide">Now</span>
      </div>
    )
  }
  if (topic.status === 'locked') {
    return (
      <div className={clsx(base, 'bg-surfaceSecondary border-2 border-border')}>
        <Lock className="text-textMuted w-5 h-5" />
      </div>
    )
  }
  // unlocked
  return (
    <div className={clsx(base, 'border-2 border-primary')}>
      <span className="text-primary font-black text-lg">→</span>
    </div>
  )
}

function TopicLabel({ topic }) {
  return (
    <div>
      <p className={clsx(
        'font-bold text-sm',
        topic.status === 'locked' ? 'text-textMuted' : 'text-textPrimary',
      )}>
        {topic.title}
      </p>
      <p className="text-xs text-textMuted mt-0.5">
        {topic.lessonCount} lesson{topic.lessonCount !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
