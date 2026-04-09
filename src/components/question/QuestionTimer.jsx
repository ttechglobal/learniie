// components/question/QuestionTimer.jsx
'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'

/**
 * Circular countdown timer for mock assessments.
 * @param {number} totalSeconds - total duration
 * @param {number} remaining - seconds remaining
 */
export function QuestionTimer({ totalSeconds, remaining }) {
  const percent = (remaining / totalSeconds) * 100
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  const isWarning = remaining <= 300 // last 5 minutes
  const isDanger  = remaining <= 60  // last 1 minute

  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      <svg width="48" height="48" viewBox="0 0 48 48">
        {/* Background ring */}
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#E5E5E2" strokeWidth="4" />
        {/* Progress ring */}
        <circle
          cx="24" cy="24" r={radius}
          fill="none"
          strokeWidth="4"
          stroke={isDanger ? '#EF4444' : isWarning ? '#F59E0B' : '#0FA968'}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className={clsx(
        'font-mono text-sm font-bold',
        isDanger  ? 'text-red-500' :
        isWarning ? 'text-amber-500' : 'text-textPrimary',
      )}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
