// components/dashboard/MockPromptCard.jsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export function MockPromptCard({ type = 'test', term, className = '' }) {
  const router = useRouter()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const isMockExam = type === 'exam'

  return (
    <div className={`relative bg-primaryDark rounded-2xl p-5 ${className}`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-white/60 hover:text-white"
      >
        <X size={16} />
      </button>
      <p className="text-xs font-bold uppercase tracking-wide text-white/60 mb-1">
        {isMockExam ? 'Mock Exam' : 'Mock Test'} — Term {term}
      </p>
      <p className="font-heading text-lg font-bold text-white mb-1">
        {isMockExam
          ? 'Your mock exam is coming up!'
          : 'Your school test is coming up!'}
      </p>
      <p className="text-sm text-white/70 mb-4">
        {isMockExam
          ? 'Week 10 is exam week. Take your mock exam to see how ready you are.'
          : 'Week 6 is test week. Take your mock test now to see how ready you are.'}
      </p>
      <Button
        onClick={() => router.push(isMockExam ? '/mock/exam/new' : '/mock/test/new')}
        className="bg-white text-primaryDark hover:bg-white/90 w-full"
      >
        {isMockExam ? 'Take Mock Exam' : 'Take Mock Test'}
      </Button>
    </div>
  )
}
